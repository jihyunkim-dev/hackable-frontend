// 이미지 파일 앞부분만 받아 가로·세로 크기를 읽는다. (서버에서 실행)
// 클립 본문(마크다운) 이미지에 width/height를 넣어, 이미지가 늦게 떠도 자리를 미리 잡게 한다. (레이아웃 이동 방지)
// PNG·GIF·WebP·JPEG만 읽는다. 읽지 못하면 null이고, 그 이미지는 크기 없이 그대로 둔다.

export interface ImageSize {
  width: number;
  height: number;
}

// 대부분의 이미지는 앞 64KB 안에 크기 정보가 있다.
const HEAD_BYTES = 64 * 1024;
const TIMEOUT_MS = 3000;

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

function readPng(view: DataView, bytes: Uint8Array): ImageSize | null {
  if (ascii(bytes, 1, 3) !== "PNG") return null;
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function readGif(view: DataView, bytes: Uint8Array): ImageSize | null {
  if (ascii(bytes, 0, 3) !== "GIF") return null;
  return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
}

function readWebp(view: DataView, bytes: Uint8Array): ImageSize | null {
  if (ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") {
    return null;
  }
  const chunk = ascii(bytes, 12, 4);
  // 손실 압축
  if (chunk === "VP8 ") {
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  // 무손실 압축 (14비트씩 담는다)
  if (chunk === "VP8L") {
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  // 확장 형식 (24비트씩 담는다)
  if (chunk === "VP8X") {
    const width = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
    const height = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
    return { width, height };
  }
  return null;
}

// JPEG는 SOF(프레임 시작) 표시를 찾을 때까지 블록을 건너뛴다.
function readJpeg(view: DataView, bytes: Uint8Array): ImageSize | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

export function readImageSize(bytes: Uint8Array): ImageSize | null {
  if (bytes.length < 30) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const size =
    readPng(view, bytes) ??
    readGif(view, bytes) ??
    readWebp(view, bytes) ??
    readJpeg(view, bytes);
  return size && size.width > 0 && size.height > 0 ? size : null;
}

export async function fetchImageSize(src: string): Promise<ImageSize | null> {
  try {
    const res = await fetch(src, {
      headers: { Range: `bytes=0-${HEAD_BYTES - 1}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return readImageSize(new Uint8Array(await res.arrayBuffer()));
  } catch {
    return null;
  }
}

// 여러 이미지의 크기를 한 번에 읽는다. 읽지 못한 이미지는 빠진다.
export async function fetchImageSizes(srcs: string[]) {
  const unique = [...new Set(srcs)];
  const sizes = await Promise.all(unique.map(fetchImageSize));
  return new Map(
    unique.flatMap((src, index) => {
      const size = sizes[index];
      return size ? [[src, size] as const] : [];
    }),
  );
}
