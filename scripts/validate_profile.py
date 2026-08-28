#!/usr/bin/env python3
"""Validate src/lib/elevProfile.js structurally. Writes a short report to
/tmp/profile_check.txt so long numeric strings never pass through the
assistant context."""
import json
import re
import sys

SRC = "/opt/AcrossR10/src/lib/elevProfile.js"
REPORT = "/tmp/profile_check.txt"


def main():
    problems = []
    src = open(SRC, encoding="utf-8").read()

    def grab(name):
        m = re.search(rf"export const {name} = (.*?);\n", src)
        if not m:
            return None
        return json.loads(m.group(1))

    line = grab("elevLine")
    fill = grab("elevFill")
    grid = grab("elevGrid")
    labels = grab("elevLabels")
    stats = grab("elevStats")

    if line is None or fill is None:
        problems.append("missing elevLine/elevFill")
    else:
        toks = line[1:].replace(" L", " ").split()
        bad = [t for t in toks if not re.fullmatch(r"\d+\.\d+,\d+\.\d+", t)]
        if bad:
            problems.append(f"{len(bad)} malformed tokens")
        xs = [float(t.split(",")[0]) for t in toks if "," in t]
        if xs and (xs[0] < 0 or xs[-1] > 500.001):
            problems.append(f"x range {xs[0]}..{xs[-1]} outside 0..500")
        if not line.startswith("M0.0,"):
            problems.append("line does not start at x=0")
        if not fill.endswith(" L500,110 L0,110 Z"):
            problems.append("fill closure wrong")
        if len(toks) not in (151, 152):
            problems.append(f"expected ~151 points, got {len(toks)}")

    if stats is None:
        problems.append("missing elevStats")
    else:
        if not (120 <= stats["totalKm"] <= 140):
            problems.append(f"totalKm {stats['totalKm']} unexpected")
        if stats["minEle"] >= stats["maxEle"]:
            problems.append("minEle >= maxEle")

    if labels:
        last = labels[-1]
        if last["name"] != "Oberhof":
            problems.append(f"last label {last['name']!r} != Oberhof")
        if abs(last["x"] - 500.0) > 0.01:
            problems.append(f"Oberhof x={last['x']} not at 500")

    lines = []
    lines.append("OK" if not problems else "FAIL")
    lines.append(f"file_bytes={len(src)}")
    if line:
        lines.append(f"points={len(line[1:].replace(' L', ' ').split())}")
    if stats:
        lines.append(
            "totalKm=%s minEle=%s maxEle=%s"
            % (stats["totalKm"], stats["minEle"], stats["maxEle"])
        )
    if labels:
        lines.append("labels=" + ",".join(l["name"] for l in labels))
    lines.extend(problems)
    with open(REPORT, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    return 0 if not problems else 1


if __name__ == "__main__":
    sys.exit(main())
