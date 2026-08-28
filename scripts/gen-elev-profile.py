#!/usr/bin/env python3
"""Generate src/lib/elevProfile.js from the AcrossR10 GPX track.

Maps the real elevation profile (km -> elevation) onto an SVG coordinate
box (x: 0..500, y: 10..110) and writes a small ES module that the Svelte
home page imports. The path data stays on disk and is never hand-typed.
"""
import json
import math
import xml.etree.ElementTree as ET

GPX = "/root/.hermes/cache/documents/doc_a79fbd60e8de_t344757311_across-r10.gpx"
OUT = "/opt/AcrossR10/src/lib/elevProfile.js"
NS = {"gpx": "http://www.topografix.com/GPX/1/1"}

root = ET.parse(GPX).getroot()
pts = root.findall(".//gpx:trkpt", NS)

# Build cumulative distance (km) + elevation per point.
data = []
cum = 0.0
prev = None
for p in pts:
    lat = float(p.get("lat"))
    lon = float(p.get("lon"))
    el = p.find("gpx:ele", NS)
    e = float(el.text) if el is not None and el.text else None
    if prev:
        x1, y1 = math.radians(prev[0]), math.radians(prev[1])
        x2, y2 = math.radians(lat), math.radians(lon)
        a = math.sin((x2 - x1) / 2) ** 2 + math.cos(x1) * math.cos(x2) * math.sin((y2 - y1) / 2) ** 2
        cum += 2 * 6371 * math.asin(math.sqrt(a))
    if e is None and data:
        e = data[-1][1]
    data.append((cum, e))
    prev = (lat, lon)

total = data[-1][0]


def X(km):
    return 500.0 * km / total


def Y(e):
    # elevation 150m -> y=110 (bottom), 950m -> y=10 (top)
    return 110.0 - (e - 150.0) / 800.0 * 100.0


# Resample to ~150 points evenly spaced by distance.
N = 150
step = total / N
out = []
idx = 0
for i in range(N + 1):
    target = step * i
    while idx + 1 < len(data) - 1 and data[idx + 1][0] <= target:
        idx += 1
    km, e = data[idx]
    out.append((X(km), Y(e)))

segs = [f"{x:.1f},{y:.1f}" for x, y in out]
line = "M" + " L".join(segs)
fill = line + " L500,110 L0,110 Z"

grid = {int(m): round(Y(m), 1) for m in (300, 500, 700, 900)}
# km markers from the real track
labels = [
    {"name": "H\u00f6rschel", "x": round(X(0), 1)},
    {"name": "Ruhla", "x": round(X(35.4), 1)},
    {"name": "Friedrichroda", "x": round(X(57.1), 1)},
    {"name": "Oberhof", "x": round(X(total), 1)},
]
stats = {"totalKm": round(total, 1), "minEle": round(min(d[1] for d in data)), "maxEle": round(max(d[1] for d in data))}

# Emit a compact ES module.
with open(OUT, "w", encoding="utf-8") as fh:
    fh.write("// AUTO-GENERATED from acrossr10 GPX track. Do not edit by hand.\n")
    fh.write("// Regenerate: python3 scripts/gen-elev-profile.py\n")
    fh.write(f"export const totalKm = {stats['totalKm']};\n")
    fh.write(f"export const minEle = {stats['minEle']};\n")
    fh.write(f"export const maxEle = {stats['maxEle']};\n")
    fh.write(f"export const elevLine = {json.dumps(line)};\n")
    fh.write(f"export const elevFill = {json.dumps(fill)};\n")
    fh.write(f"export const elevGrid = {json.dumps(grid)};\n")
    fh.write(f"export const elevLabels = {json.dumps(labels, ensure_ascii=False)};\n")
    fh.write(f"export const elevStats = {json.dumps(stats)};\n")

print("wrote", OUT)
print("line length:", len(line))
print("fill length:", len(fill))
print("grid:", grid)
print("labels:", labels)
print("stats:", stats)
