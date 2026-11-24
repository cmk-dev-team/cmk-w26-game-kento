"""go が とどかない 対策の 組みなおしに つかう 表を 作る（11/24）。
python gen_data.py → ../../hakoniwa/pack/bp/scripts/w26restore_data.js
- enums：custom.ts の enum（名前 → {値: メンバー名}）。MakeCode から 来る しるしは enum の「値」
- items / blocks：MakeCode の アイテム・ブロックの 番号 → [TS の 定数, ブロックの 中の 値]（minecraft の target.json から。mkc build の キャッシュ）
- lzma：MJ 振替の lzma.mjs を パックへ うつす（作品 URL を 作る）
"""
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
EXT = os.path.join(HERE, '..')
SCRIPTS = os.path.join(EXT, '..', 'hakoniwa', 'pack', 'bp', 'scripts')
TARGET = os.path.expanduser(r'~/.pxt/mkc-cache/https_58__47__47_minecraft.makecode.com_47_-target.json')
LZ = r'C:/Users/nishi/OneDrive/デスクトップ/Miya/tools_dev/furikae/coaster_robo/makecode/lzma.mjs'

src = open(os.path.join(EXT, 'custom.ts'), encoding='utf-8').read()
enums = {}
for m in re.finditer(r'^enum (\w+) \{(.*?)^\}', src, re.S | re.M):
    enums[m.group(1)] = {int(v): k for k, v in re.findall(r'^\s*(\w+) = (-?\d+)', m.group(2), re.M)}

t = json.dumps(json.load(open(TARGET, encoding='utf-8')))


def table(name):
    i = t.find(f'const enum {name} {{')
    body = t[i:t.find('}', i)].replace('\\n', '\n').replace('\\"', '"')
    out = {}
    for alias, member, val in re.findall(r'jres alias=(\w+)\s*\n\s*(\w+) = (-?\d+)', body):
        out.setdefault(int(val), [alias, f'{name}.{member}'])
    return out


items, blocks = table('Item'), table('Block')
assert items[266][0] == 'GOLD_INGOT' and blocks[1][0] == 'STONE', (items.get(266), blocks.get(1))
pxt = json.load(open(os.path.join(EXT, 'pxt.json'), encoding='utf-8'))
tf = json.load(open(os.path.join(EXT, 'toolbox_filter.json'), encoding='utf-8'))
data = {'version': pxt['version'], 'enums': enums, 'items': items, 'blocks': blocks, 'toolboxFilter': tf}
js = '// gen_data.py が 作った（手で 直さない）\nexport const RD = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(os.path.join(SCRIPTS, 'w26restore_data.js'), 'w', encoding='utf-8').write(js)
shutil.copy(LZ, os.path.join(SCRIPTS, 'lzma.js'))
print('ok enums', len(enums), 'items', len(items), 'blocks', len(blocks), 'bytes', len(js))
