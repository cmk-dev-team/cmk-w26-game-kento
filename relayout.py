"""main.blocks の いちばん外のブロックを、重ならないよう2列に並べなおす（文が長くなったので。11/10）
python relayout.py <main.blocks> ...
"""
import re, sys
import xml.etree.ElementTree as ET
NS = "https://developers.google.com/blockly/xml"
ET.register_namespace("", NS)
COLX = [20, 560]
for path in sys.argv[1:]:
    root = ET.parse(path).getroot()
    tops = [b for b in root if b.tag == f"{{{NS}}}block"]
    ys = [20, 20]
    for b in tops:
        inner = ET.tostring(b, encoding="unicode").count("<block") + ET.tostring(b, encoding="unicode").count(":block ") - 1   # 中に入っているブロックの数
        h = 70 + 56 * max(1, inner)
        col = 0 if ys[0] <= ys[1] else 1
        b.set("x", str(COLX[col])); b.set("y", str(ys[col]))
        ys[col] += h + 30
    ET.ElementTree(root).write(path, encoding="unicode")
    print(path.split("w26set-ext")[-1], len(tops), ys)
