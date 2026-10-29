// Cloudflare R2(S3 호환)에 파일을 올린다. (서버 전용: 키가 브라우저로 나가지 않게 route handler에서만 쓴다)
import { AwsClient } from "aws4fetch";

const endpoint = process.env.R2_ENDPOINT?.replace(/\/+$/, "");
const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");

const client =
  process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
    ? new AwsClient({
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        service: "s3",
        region: "auto",
      })
    : null;

// 올린 파일의 공개(CDN) 주소인지 확인한다. 글에 저장할 이미지 주소 검사에 쓴다.
export function isR2PublicUrl(value: string, prefix = ""): boolean {
  return Boolean(publicUrl) && value.startsWith(`${publicUrl}/${prefix}`);
}

// key 위치에 파일을 올리고 공개 주소를 돌려준다. 설정이 없거나 실패하면 null
export async function putR2Object(
  key: string,
  body: Blob,
  contentType: string,
): Promise<string | null> {
  if (!client || !endpoint || !bucket || !publicUrl) {
    console.error("R2 Upload Error", "R2 환경변수가 없어요.");
    return null;
  }

  try {
    const bytes = new Uint8Array(await body.arrayBuffer());
    // 서명만 aws4fetch로 하고 전송은 바이트 배열로 직접 한다.
    // (서명된 Request를 그대로 보내면 본문이 스트림이 되어 Content-Length가 빠지고, R2가 411로 거절한다)
    const signed = await client.sign(`${endpoint}/${bucket}/${key}`, {
      method: "PUT",
      body: bytes,
      headers: {
        "Content-Type": contentType,
        // 파일 이름이 매번 달라 내용이 바뀌지 않으므로 오래 캐시한다.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    const res = await fetch(signed.url, {
      method: "PUT",
      headers: signed.headers,
      body: bytes,
    });

    if (!res.ok) {
      console.error("R2 Upload Error", res.status, await res.text());
      return null;
    }

    return `${publicUrl}/${key}`;
  } catch (error) {
    console.error("R2 Upload Fetch Error", error);
    return null;
  }
}
