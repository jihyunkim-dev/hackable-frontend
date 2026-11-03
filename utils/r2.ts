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

// 실패 이유 (응답에 담아 원인을 확인한다)
// config: 환경변수 없음 / rejected: R2가 거절(키·권한·버킷 이름) / network: R2에 닿지 못함
export type R2PutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "r2-config" | `r2-rejected-${number}` | "r2-network" };

// key 위치에 파일을 올리고 공개 주소를 돌려준다.
export async function putR2Object(
  key: string,
  body: Blob,
  contentType: string,
): Promise<R2PutResult> {
  if (!client || !endpoint || !bucket || !publicUrl) {
    // 어떤 이름이 비었는지만 남긴다. (값은 남기지 않는다)
    const missing = Object.entries({
      R2_ENDPOINT: endpoint,
      R2_BUCKET: bucket,
      R2_PUBLIC_URL: publicUrl,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    })
      .filter(([, value]) => !value)
      .map(([name]) => name);
    console.error("R2 Upload Error", "환경변수가 없어요.", missing);
    return { ok: false, reason: "r2-config" };
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
      return { ok: false, reason: `r2-rejected-${res.status}` };
    }

    return { ok: true, url: `${publicUrl}/${key}` };
  } catch (error) {
    console.error("R2 Upload Fetch Error", error);
    return { ok: false, reason: "r2-network" };
  }
}
