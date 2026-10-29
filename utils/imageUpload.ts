// 팀빌딩 이미지 첨부 규칙. (브라우저·서버 공용)

// 받을 수 있는 이미지 형식
export const IMAGE_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// 고를 수 있는 원본 최대 10MB. 올리기 전에 브라우저에서 줄인다.
export const IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

// 줄인 뒤 서버가 받는 최대 크기. (GIF는 줄이지 않으므로 이 크기를 넘으면 올릴 수 없다)
export const IMAGE_UPLOAD_MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

// 긴 변 최대 길이(px). 상세 화면 폭 800px의 2배 화면까지 선명하다.
const MAX_DIMENSION = 1600;
const QUALITY = 0.85;

// R2 안에서 팀빌딩 이미지를 모아 두는 폴더
export const IMAGE_UPLOAD_PREFIX = "teambuildings/";

// 긴 변을 MAX_DIMENSION 이하로 줄이고 WebP로 바꾼다. (WebP를 못 만드는 브라우저는 JPEG)
// GIF는 움직임이 사라지므로 그대로 둔다. 줄인 결과가 더 크면 원본을 쓴다.
async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, QUALITY),
    );
  let blob = await toBlob("image/webp");
  if (blob?.type !== "image/webp") blob = await toBlob("image/jpeg");

  return blob && blob.size < file.size ? blob : file;
}

// 이미지를 줄여서 올리고 공개 주소를 돌려준다. (app/api/uploads/image)
export async function uploadImage(file: File): Promise<string> {
  const image = await compressImage(file);
  if (image.size > IMAGE_UPLOAD_MAX_UPLOAD_BYTES) {
    throw new Error("이미지가 너무 커요.");
  }
  const body = new FormData();
  body.append("file", image, file.name);
  const res = await fetch("/api/uploads/image", { method: "POST", body });
  if (!res.ok) throw new Error("이미지를 올리지 못했어요.");
  const data: { url: string } = await res.json();
  return data.url;
}
