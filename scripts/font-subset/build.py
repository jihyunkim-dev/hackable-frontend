"""SUIT 가변 폰트를 글자 묶음(unicode-range)으로 나눠 Hackable Sans 웹폰트를 만든다.

브라우저는 페이지에 쓰인 글자가 든 묶음만 받는다. (전체 610KB → 홈 약 240KB)
- 묶음 0: 영문·숫자·기호 등 한글 음절이 아닌 글자 전부
- 묶음 1~: 한글 음절. hangul-order.txt(자주 쓰는 순서)대로 앞에서부터 잘라 담고,
  목록에 없는 글자는 코드 순서로 뒤 묶음에 담는다.

SUIT는 OFL의 예약 폰트 이름(Reserved Font Name)이 "SUIT"라, 수정본(잘라 낸 파일)은
다른 이름을 써야 한다. 그래서 폰트 안 이름을 Hackable Sans로 바꾼다. (저작권·라이선스 표기는 그대로 둔다)

실행 (fonttools, brotli 필요: pip install fonttools brotli)
  python3 scripts/font-subset/build.py

만드는 파일
  app/fonts/hackable-sans/hs-*.woff2   묶음 폰트
  app/fonts/hackableSans.ts            next/font/local 선언 (자동 생성, 직접 고치지 않는다)

hangul-order.txt를 다시 만들 때는 사이트 글(대회·지원사업의 제목과 상세 본문, 클립·팀빌딩 글, 화면 문구)에서
한글 음절을 많이 나온 순서로 적는다. 상세 본문을 빼면 본문에만 나오는 글자가 뒤 묶음으로 밀려 상세 페이지가 묶음을 많이 받는다.
"""

import io
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source" / "SUIT-Variable.woff2"
ORDER = HERE / "hangul-order.txt"
OUT_DIR = ROOT / "app" / "fonts" / "hackable-sans"
OUT_TS = ROOT / "app" / "fonts" / "hackableSans.ts"

FAMILY = "Hackable Sans"
POSTSCRIPT = "HackableSans"
VARIABLE = "--font-hackable-sans"
# CSS에서 쓰는 이름 (next/font가 첫 선언 이름으로 변수를 만들어 그 이름과 같게 둔다)
CSS_FAMILY = "hackableSans"

# 앞쪽(자주 쓰는 글자) 묶음 크기. 대부분 페이지는 이 묶음들 안에서 끝난다.
HEAD_SIZES = [100, 150, 250, 350, 250]
# 뒤쪽(드문 글자) 묶음 크기. 드문 글자 하나 때문에 받는 양이 크지 않게 잘게 나눈다.
TAIL_SIZE = 200
# 미리 받는 묶음: 영문·기호와 앞쪽(자주 쓰는 글자) 한글 묶음. 대부분 페이지는 이 안에서 끝나므로
# 처음부터 받아 첫 글자 표시(FCP)가 늦지 않게 한다. 뒤쪽 묶음은 그 글자가 보일 때 받는다.
PRELOAD_COUNT = 1 + len(HEAD_SIZES)

HANGUL_FIRST, HANGUL_LAST = 0xAC00, 0xD7A3


def is_hangul(cp: int) -> bool:
    return HANGUL_FIRST <= cp <= HANGUL_LAST


def make_slices(cmap: dict[int, str]) -> list[list[int]]:
    others = sorted(cp for cp in cmap if not is_hangul(cp))
    hangul = [cp for cp in sorted(cmap) if is_hangul(cp)]

    ordered = []
    seen = set()
    for ch in ORDER.read_text(encoding="utf-8").strip():
        cp = ord(ch)
        if cp in cmap and is_hangul(cp) and cp not in seen:
            ordered.append(cp)
            seen.add(cp)
    ordered += [cp for cp in hangul if cp not in seen]

    slices = [others]
    start = 0
    for size in HEAD_SIZES:
        slices.append(ordered[start : start + size])
        start += size
    while start < len(ordered):
        slices.append(ordered[start : start + TAIL_SIZE])
        start += TAIL_SIZE
    return [s for s in slices if s]


def to_unicode_range(cps: list[int]) -> str:
    ranges = []
    cps = sorted(cps)
    first = prev = cps[0]
    for cp in cps[1:]:
        if cp == prev + 1:
            prev = cp
            continue
        ranges.append((first, prev))
        first = prev = cp
    ranges.append((first, prev))
    return ",".join(
        f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in ranges
    )


def rename(font: TTFont) -> None:
    # 저작권(0)·라이선스(13, 14)는 그대로 두고, 이름에 들어간 SUIT를 바꾼다.
    keep = {0, 13, 14}
    for record in font["name"].names:
        if record.nameID in keep:
            continue
        text = record.toUnicode()
        if "SUIT" not in text:
            continue
        replacement = POSTSCRIPT if record.nameID in (6, 25) else FAMILY
        record.string = text.replace("SUIT", replacement)


def build_slice(cps: list[int]) -> bytes:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    font = TTFont(SOURCE)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=cps)
    subsetter.subset(font)
    rename(font)
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    return buffer.getvalue()


def write_ts(entries: list[tuple[str, str, bool]]) -> None:
    lines = [
        "// 자동 생성 파일. 직접 고치지 않는다. (scripts/font-subset/build.py)",
        "// Hackable Sans: SUIT 가변 폰트를 글자 묶음으로 나눈 웹폰트. 페이지에 쓰인 글자가 든 묶음만 받는다.",
        f"// 모든 묶음이 같은 font-family({CSS_FAMILY})를 쓰고, unicode-range로 담당 글자를 나눈다.",
        "// (next/font는 첫 선언의 이름으로 CSS 변수를 만들므로, font-family를 그 이름에 맞춘다)",
        'import localFont from "next/font/local";',
        "",
    ]
    names = []
    for index, (file_name, unicode_range, preload) in enumerate(entries):
        name = CSS_FAMILY if index == 0 else f"{CSS_FAMILY}{index:02d}"
        names.append(name)
        # 대체 폰트(크기 보정한 Arial)와 CSS 변수는 첫 묶음 하나만 만든다.
        extra = (
            f'  variable: "{VARIABLE}",'
            if index == 0
            else "  adjustFontFallback: false,"
        )
        lines += [
            f"{'export ' if index == 0 else ''}const {name} = localFont({{",
            f'  src: "./hackable-sans/{file_name}",',
            '  weight: "100 900",',
            '  display: "swap",',
            f"  preload: {'true' if preload else 'false'},",
            extra,
            "  declarations: [",
            f'    {{ prop: "font-family", value: "{CSS_FAMILY}" }},',
            f'    {{ prop: "unicode-range", value: "{unicode_range}" }},',
            "  ],",
            "});",
            "",
        ]
    lines += [
        "// 나머지 묶음. 쓰는 곳은 없지만 @font-face가 빌드에 실리도록 내보낸다.",
        f"export const {CSS_FAMILY}Slices = [",
        *[f"  {name}," for name in names[1:]],
        "];",
        "",
    ]
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    cmap = TTFont(SOURCE).getBestCmap()
    slices = make_slices(cmap)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("hs-*.woff2"):
        old.unlink()

    entries = []
    for index, cps in enumerate(slices):
        file_name = f"hs-{index:02d}.woff2"
        data = build_slice(cps)
        (OUT_DIR / file_name).write_bytes(data)
        entries.append((file_name, to_unicode_range(cps), index < PRELOAD_COUNT))
        print(f"{file_name}  {len(cps):4d}자  {len(data) // 1024:4d}KB")

    write_ts(entries)
    print(f"{OUT_TS.relative_to(ROOT)} 생성")


if __name__ == "__main__":
    main()
