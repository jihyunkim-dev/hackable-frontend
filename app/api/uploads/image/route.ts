import { withAuth } from "@/utils/authSession";
import { putR2Object } from "@/utils/r2";
import { RequestMe } from "@/utils/requestToSrv";
import {
  IMAGE_UPLOAD_MAX_UPLOAD_BYTES,
  IMAGE_UPLOAD_PREFIX,
  IMAGE_UPLOAD_TYPES,
} from "@/utils/imageUpload";

// 이미지 한 장을 R2에 올린다. (로그인한 사용자만) 응답: { url }
// 크기는 브라우저에서 미리 줄여 온다. (utils/imageUpload)
// 백엔드 /utils/convert는 1MB 넘는 파일을 받지 못해(nginx 413) 쓰지 않는다.
export async function POST(request: Request) {
  const user = await withAuth(RequestMe);
  if (!user) return new Response(null, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return new Response(null, { status: 400 });
  if (!IMAGE_UPLOAD_TYPES.includes(file.type)) {
    return new Response(null, { status: 415 });
  }
  if (file.size > IMAGE_UPLOAD_MAX_UPLOAD_BYTES) {
    return new Response(null, { status: 413 });
  }

  const extension =
    file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];

  // 예: teambuildings/2026/10/<uuid>.webp (이름이 겹치지 않게 무작위로 짓는다)
  const month = new Date().toISOString().slice(0, 7).replace("-", "/");
  const key = `${IMAGE_UPLOAD_PREFIX}${month}/${crypto.randomUUID()}.${extension}`;

  const url = await putR2Object(key, file, file.type);
  if (!url) return new Response(null, { status: 502 });

  return Response.json({ url }, { status: 201 });
}
