// キャンプゲームづくりセット v0.4（基礎検討・Aimy 2026-11-22）
// ワールド側は「Aimyゲームづくり箱庭（基礎検討）」の w26set.js。ブロック → /scriptevent w26:〇〇、ワールド → /tell w26_〇〇。
//
// ■ v0.4（Miya 11/22）
//   ・分類は 役わりで4つ：イベント（きっかけ）／しかけ（コースに起きる）／あそぶ人（遊ぶ人に起きる）／ゲーム（時間・★・くりかえす）
//     （前の「モンスター」「おたから」は ゲームの種類で分けた形だった）
//   ・マーカー（v0.4.3・Miya 11/23）：見た目は うかぶ ひしがた・12色。「〔色〕の マーカーを 〔ブロック〕に する／もとに もどす」（前の ON・はし を まとめた。向きは つかわない）
//   ・めじるし → おてつだいロボ（8色）。しかけは ロボの場所に起きる。橋は そこから ロボの むいている方へ
//   ・おちたとき → アウトゆかに のったとき（どこが アウトかは、子どもが アウトゆかを しいて きめる）
//   ・おたから（ブロック）→ アイテムを 手に入れたとき（チェストに 手で 入れておく）
//   ・かぎ（v0.4.1・Miya 11/22）：チェストは マイクラの物（ふつう・トラップ・銅4だんかい）。かぎを かける ブロックは ない
//     「〔チェスト・とびら〕に さわったとき」→「もし〔アイテム〕を もっていたら ひらく そうでないなら ひらかない」を 1つのブロックで（Miya 11/22「分けないで・セット運用」）
//     アイテムは マイクラの アイテムから 何でも えらべる（MakeCode の minecraftItem。ゲームの 名前〔blocks.nameOfBlock〕で ワールドに わたし、ワールドが ID に なおす。かぎ専用の アイテムは やめた・Miya 11/22「かぎけして 好きなアイテムに」）
//     ひらく／ひらかない は 決まった形（逆には しない）。もっているかは ワールドが さわった しゅんかんに 見る（もちものを MakeCode に 送る形は 不安定なので やめた・Miya 11/22）
//     チェスト：開くかは クリックの その場で きまる。だから スタート前（w26_ping）に「チェストに さわったとき」の 中を 下見して w26:guard で 教えておく
//     とびら：さわったら key_open を 送り、ワールドが その人の もちものを 見て 消す
//     チェストは ふつうは 開く。とじて おくのは この ブロックの「ひらかない」。とびら（専用）は 置いたときから とじていて「ひらく」で 消える
//   ・つかまった → こうげきされた／★は ふやす・へらす を 1つのブロックで／ゆか → きえるブロック（けす・もどす）
//   ・MakeCode に もとからある分類は かくす（作品の pxt.json の toolboxFilter）。だから「くりかえす」は ここに ある
// ■ マルチ（v0.3）：作った子の MakeCode が操作盤。知らせの名前に 遊ぶ人の番号（_0〜_7、だれでもない＝_a）。
//   「する」は w26Who（いま だれの できごとか）を いっしょに送る。送ったあとで w26Who を もどす（2人が同時でも まざらない）
// ■ 時間（v0.3.1）：ワールドが数える。「〇秒ごとに」は ワールドが知らせる。「〇秒 まつ」は 待たずに、あとの「する」に 何tick あとかを書いて送る
// ■ ことば：物は絵、動きはことば。声に出すと文になる（Miya 11/10）。対象は小2〜小6（要所は漢字）

enum W26Switch {
    //% block="あか" jres=W26Icon.sw_red
    Red = 0,
    //% block="あお" jres=W26Icon.sw_blue
    Blue = 1,
    //% block="きいろ" jres=W26Icon.sw_yellow
    Yellow = 2,
    //% block="みどり" jres=W26Icon.sw_green
    Green = 3
}
enum W26Robo {
    //% block="あか" jres=W26Icon.robo_red
    Red = 0,
    //% block="あお" jres=W26Icon.robo_blue
    Blue = 1,
    //% block="きいろ" jres=W26Icon.robo_yellow
    Yellow = 2,
    //% block="みどり" jres=W26Icon.robo_green
    Green = 3,
    //% block="オレンジ" jres=W26Icon.robo_orange
    Orange = 4,
    //% block="むらさき" jres=W26Icon.robo_purple
    Purple = 5,
    //% block="みずいろ" jres=W26Icon.robo_aqua
    Aqua = 6,
    //% block="ピンク" jres=W26Icon.robo_pink
    Pink = 7,
    //% block="くろ" jres=W26Icon.robo_black
    Black = 8,
    //% block="しろ" jres=W26Icon.robo_white
    White = 9,
    //% block="ちゃいろ" jres=W26Icon.robo_brown
    Brown = 10,
    //% block="きみどり" jres=W26Icon.robo_lime
    Lime = 11,
    //% block="ランダム" jres=W26Icon.robo_random
    Random = 12
}
enum W26Floor {
    //% block="あか" jres=W26Icon.floor_red
    Red = 0,
    //% block="あお" jres=W26Icon.floor_blue
    Blue = 1,
    //% block="きいろ" jres=W26Icon.floor_yellow
    Yellow = 2,
    //% block="みどり" jres=W26Icon.floor_green
    Green = 3
}
enum W26Door {
    //% block="あか" jres=W26Icon.door_red
    Red = 0,
    //% block="あお" jres=W26Icon.door_blue
    Blue = 1,
    //% block="きいろ" jres=W26Icon.door_yellow
    Yellow = 2,
    //% block="みどり" jres=W26Icon.door_green
    Green = 3
}
enum W26Lock {
    //% block="あかの とびら" jres=W26Icon.door_red
    DoorRed = 0,
    //% block="あおの とびら" jres=W26Icon.door_blue
    DoorBlue = 1,
    //% block="きいろの とびら" jres=W26Icon.door_yellow
    DoorYellow = 2,
    //% block="みどりの とびら" jres=W26Icon.door_green
    DoorGreen = 3,
    //% block="チェスト" jres=W26Icon.ch_chest
    Chest = 4,
    //% block="トラップチェスト" jres=W26Icon.ch_trapped
    Trapped = 5,
    //% block="どうの チェスト" jres=W26Icon.ch_copper
    Copper = 6,
    //% block="ふうかした どうの チェスト" jres=W26Icon.ch_exposed
    Exposed = 7,
    //% block="さびた どうの チェスト" jres=W26Icon.ch_weathered
    Weathered = 8,
    //% block="さんかした どうの チェスト" jres=W26Icon.ch_oxidized
    Oxidized = 9
}
enum W26Plate {
    //% block="いし" jres=W26Icon.pl_stone
    Stone = 0,
    //% block="オーク" jres=W26Icon.pl_oak
    Oak = 1,
    //% block="トウヒ" jres=W26Icon.pl_spruce
    Spruce = 2,
    //% block="シラカバ" jres=W26Icon.pl_birch
    Birch = 3,
    //% block="ジャングル" jres=W26Icon.pl_jungle
    Jungle = 4,
    //% block="アカシア" jres=W26Icon.pl_acacia
    Acacia = 5,
    //% block="ダークオーク" jres=W26Icon.pl_dark_oak
    DarkOak = 6,
    //% block="マングローブ" jres=W26Icon.pl_mangrove
    Mangrove = 7,
    //% block="サクラ" jres=W26Icon.pl_cherry
    Cherry = 8,
    //% block="タケ" jres=W26Icon.pl_bamboo
    Bamboo = 9,
    //% block="ペールオーク" jres=W26Icon.pl_pale_oak
    PaleOak = 10,
    //% block="しんく" jres=W26Icon.pl_crimson
    Crimson = 11,
    //% block="ゆがんだ" jres=W26Icon.pl_warped
    Warped = 12,
    //% block="きん（かるい）" jres=W26Icon.pl_gold
    Gold = 13,
    //% block="てつ（おもい）" jres=W26Icon.pl_iron
    Iron = 14
}
enum W26Button {
    //% block="いし" jres=W26Icon.bt_stone
    Stone = 0,
    //% block="オーク" jres=W26Icon.bt_oak
    Oak = 1,
    //% block="トウヒ" jres=W26Icon.bt_spruce
    Spruce = 2,
    //% block="シラカバ" jres=W26Icon.bt_birch
    Birch = 3,
    //% block="ジャングル" jres=W26Icon.bt_jungle
    Jungle = 4,
    //% block="アカシア" jres=W26Icon.bt_acacia
    Acacia = 5,
    //% block="ダークオーク" jres=W26Icon.bt_dark_oak
    DarkOak = 6,
    //% block="マングローブ" jres=W26Icon.bt_mangrove
    Mangrove = 7,
    //% block="サクラ" jres=W26Icon.bt_cherry
    Cherry = 8,
    //% block="タケ" jres=W26Icon.bt_bamboo
    Bamboo = 9,
    //% block="ペールオーク" jres=W26Icon.bt_pale_oak
    PaleOak = 10,
    //% block="しんく" jres=W26Icon.bt_crimson
    Crimson = 11,
    //% block="ゆがんだ" jres=W26Icon.bt_warped
    Warped = 12
}
enum W26Monster {
    //% block="ゾンビ 2" jres=W26Icon.m_zombie
    Zombie = 0,
    //% block="クモ 2" jres=W26Icon.m_spider
    Spider = 1,
    //% block="スライム 2" jres=W26Icon.m_slime
    Slime = 2,
    //% block="ハスク 2" jres=W26Icon.m_husk
    Husk = 3,
    //% block="スケルトン 2" jres=W26Icon.m_skeleton
    Skeleton = 4,
    //% block="ストレイ 2" jres=W26Icon.m_stray
    Stray = 5,
    //% block="どうくつグモ 2" jres=W26Icon.m_cave_spider
    CaveSpider = 6,
    //% block="シルバーフィッシュ 2" jres=W26Icon.m_silverfish
    Silverfish = 7,
    //% block="ドラウンド 2" jres=W26Icon.m_drowned
    Drowned = 8,
    //% block="むらびとゾンビ 2" jres=W26Icon.m_zombie_villager
    ZombieVillager = 9,
    //% block="ファントム 2" jres=W26Icon.m_phantom
    Phantom = 10,
    //% block="マグマキューブ 2" jres=W26Icon.m_magma_cube
    MagmaCube = 11,
    //% block="クリーパー 5" jres=W26Icon.m_creeper
    Creeper = 12,
    //% block="ウィッチ 5" jres=W26Icon.m_witch
    Witch = 13,
    //% block="ブレイズ 5" jres=W26Icon.m_blaze
    Blaze = 14,
    //% block="エンダーマン 5" jres=W26Icon.m_enderman
    Enderman = 15,
    //% block="ピリジャー 5" jres=W26Icon.m_pillager
    Pillager = 16,
    //% block="ヴィンディケーター 10" jres=W26Icon.m_vindicator
    Vindicator = 17,
    //% block="エヴォーカー 10" jres=W26Icon.m_evoker
    Evoker = 18,
    //% block="ラヴェジャー 10" jres=W26Icon.m_ravager
    Ravager = 19,
    //% block="ウォーデン 30" jres=W26Icon.m_warden
    Warden = 20,
    //% block="ウィザー 30" jres=W26Icon.m_wither
    Wither = 21
}
enum W26Animal {
    //% block="ブタ 1" jres=W26Icon.m_pig
    Pig = 22,
    //% block="ニワトリ 1" jres=W26Icon.m_chicken
    Chicken = 23,
    //% block="ヒツジ 1" jres=W26Icon.m_sheep
    Sheep = 24,
    //% block="ウシ 1" jres=W26Icon.m_cow
    Cow = 25,
    //% block="ウサギ 1" jres=W26Icon.m_rabbit
    Rabbit = 26
}
enum W26MonsterDown {
    //% block="すべて" jres=W26Icon.md_all
    All = -1,
    //% block="ゾンビ" jres=W26Icon.md_zombie
    Zombie = 0,
    //% block="クモ" jres=W26Icon.md_spider
    Spider = 1,
    //% block="スライム" jres=W26Icon.md_slime
    Slime = 2,
    //% block="ハスク" jres=W26Icon.md_husk
    Husk = 3,
    //% block="スケルトン" jres=W26Icon.md_skeleton
    Skeleton = 4,
    //% block="ストレイ" jres=W26Icon.md_stray
    Stray = 5,
    //% block="どうくつグモ" jres=W26Icon.md_cave_spider
    CaveSpider = 6,
    //% block="シルバーフィッシュ" jres=W26Icon.md_silverfish
    Silverfish = 7,
    //% block="ドラウンド" jres=W26Icon.md_drowned
    Drowned = 8,
    //% block="むらびとゾンビ" jres=W26Icon.md_zombie_villager
    ZombieVillager = 9,
    //% block="ファントム" jres=W26Icon.md_phantom
    Phantom = 10,
    //% block="マグマキューブ" jres=W26Icon.md_magma_cube
    MagmaCube = 11,
    //% block="クリーパー" jres=W26Icon.md_creeper
    Creeper = 12,
    //% block="ウィッチ" jres=W26Icon.md_witch
    Witch = 13,
    //% block="ブレイズ" jres=W26Icon.md_blaze
    Blaze = 14,
    //% block="エンダーマン" jres=W26Icon.md_enderman
    Enderman = 15,
    //% block="ピリジャー" jres=W26Icon.md_pillager
    Pillager = 16,
    //% block="ヴィンディケーター" jres=W26Icon.md_vindicator
    Vindicator = 17,
    //% block="エヴォーカー" jres=W26Icon.md_evoker
    Evoker = 18,
    //% block="ラヴェジャー" jres=W26Icon.md_ravager
    Ravager = 19,
    //% block="ウォーデン" jres=W26Icon.md_warden
    Warden = 20,
    //% block="ウィザー" jres=W26Icon.md_wither
    Wither = 21,
    //% block="ブタ" jres=W26Icon.md_pig
    Pig = 22,
    //% block="ニワトリ" jres=W26Icon.md_chicken
    Chicken = 23,
    //% block="ヒツジ" jres=W26Icon.md_sheep
    Sheep = 24,
    //% block="ウシ" jres=W26Icon.md_cow
    Cow = 25,
    //% block="ウサギ" jres=W26Icon.md_rabbit
    Rabbit = 26
}
enum W26Fx {
    //% block="かみなり" jres=W26Icon.fx_thunder
    Thunder = 0,
    //% block="はなび" jres=W26Icon.fx_firework
    Firework = 1,
    //% block="火のついた TNT" jres=W26Icon.fx_boom
    Boom = 2,
    //% block="トロッコ" jres=W26Icon.fx_minecart
    Minecart = 3,
    //% block="チェストつき トロッコ" jres=W26Icon.fx_chest_minecart
    ChestMinecart = 4,
    //% block="ホッパーつき トロッコ" jres=W26Icon.fx_hopper_minecart
    HopperMinecart = 5,
    //% block="TNTつき トロッコ" jres=W26Icon.fx_tnt_minecart
    TntMinecart = 6,
    //% block="ボート" jres=W26Icon.fx_boat
    Boat = 7,
    //% block="チェストつき ボート" jres=W26Icon.fx_chest_boat
    ChestBoat = 8
}
// パーティクル（v0.4.8・Miya 11/24「パーティクルセットも ほしい」）。ジュニア冬と 同じ 9つ（course_dev/minecraft/particles.md から。キラキラは crop_growth_emitter）
enum W26Particle {
    //% block="ハート" jres=W26Icon.p_heart
    Heart = 0,
    //% block="キラキラ" jres=W26Icon.p_sparkle
    Sparkle = 1,
    //% block="トーテム" jres=W26Icon.p_totem
    Totem = 2,
    //% block="さくら" jres=W26Icon.p_cherry
    Cherry = 3,
    //% block="おんぷ" jres=W26Icon.p_note
    Note = 4,
    //% block="ほのお" jres=W26Icon.p_flame
    Flame = 5,
    //% block="けむり" jres=W26Icon.p_smoke
    Smoke = 6,
    //% block="ばくはつ" jres=W26Icon.p_boom
    Boom = 7,
    //% block="かぜ" jres=W26Icon.p_wind
    Wind = 8
}
enum W26Effect {
    //% block="ジャンプ力" jres=W26Icon.e_jump
    Jump = 0,
    //% block="はやくなる" jres=W26Icon.e_speed
    Speed = 1,
    //% block="おそくなる" jres=W26Icon.e_slow
    Slow = 2,
    //% block="ふわふわ うく" jres=W26Icon.e_float
    Float = 3,
    //% block="ゆっくり おちる" jres=W26Icon.e_slowfall
    SlowFall = 4
}
enum W26Change {
    //% block="ふやす"
    Add = 1,
    //% block="へらす"
    Sub = -1
}

const W26_COLOR_IDS = ["red", "blue", "yellow", "green", "orange", "purple", "aqua", "pink", "black", "white", "brown", "lime", "random"]
const W26_LOCK_IDS = ["door_red", "door_blue", "door_yellow", "door_green", "chest_normal", "chest_trapped", "chest_copper", "chest_exposed", "chest_weathered", "chest_oxidized"]
const W26_PLATE_IDS = ["stone", "oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "pale_oak", "crimson", "warped", "gold", "iron"]
const W26_BUTTON_IDS = ["stone", "oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "pale_oak", "crimson", "warped"]
const W26_MONSTER_IDS = ["zombie", "spider", "slime", "husk", "skeleton", "stray", "cave_spider", "silverfish", "drowned", "zombie_villager", "phantom", "magma_cube", "creeper", "witch", "blaze", "enderman", "pillager", "vindicator", "evoker", "ravager", "warden", "wither", "pig", "chicken", "sheep", "cow", "rabbit"]
const W26_FX_IDS = ["thunder", "firework", "boom", "minecart", "chest_minecart", "hopper_minecart", "tnt_minecart", "boat", "chest_boat"]   // のりもの（v0.4.8・Miya 11/23「トロッコ・ボートも。トロッコは 各種」）
const W26_PARTICLE_IDS = ["heart", "sparkle", "totem", "cherry", "note", "flame", "smoke", "boom", "wind"]
const W26_EFFECT_IDS =["jump", "speed", "slow", "float", "slowfall"]
let w26Watch: string[] = []  // 「〔アイテム〕を 手に入れたとき・つかったとき」で 見る アイテム（番号:名前）。スタート前に ワールドに わたす
// アイテムは ゲームの 名前で ワールドに わたす（blocks.nameOfBlock。MEE で「Wheat Seeds」「Chainmail Helmet」と 返るのを 見た・Miya 11/23）
function w26ItemName(item: number): string { return blocks.nameOfBlock(item) }
function w26WatchItem(item: number): void { const e = item + ":" + w26ItemName(item); if (w26Watch.indexOf(e) < 0) w26Watch.push(e) }
const W26_SLOTS = 8          // 同時に遊べる人数（ワールド側と同じ数）
const W26_ALL = -1           // みんな（スタート・〇秒ごと・時間切れ）
const W26_REPLAY = 100       // あとから加わった人のために「スタートしたとき」を もう一度うごかす（人に効くブロックだけ送る）
const W26_DELAY_CAP = 600    // 先に予約できる時間（秒）
let w26Who = W26_ALL         // いま うごいている「イベント」は だれの できごとか
let w26Delay = 0             // その中で「まつ」を足した合計（秒）
let w26Probe = ""            // 「さわったとき」の 下見ちゅう（スタート前に 中を 1回 なぞって、どの チェストに かぎが いるかを ワールドに 教える）
let w26Guards: string[] = [] // 下見で 見つけた「チェスト=アイテム」
let w26TouchIds: string[] = []
let w26TouchFns: (() => void)[] = []
let w26Everys: number[] = [] // 「〇秒ごとに」の秒（番号＝ならび順）。ワールドに わたす

function w26Head(who: number, delay: number): string {
    const w = who >= W26_REPLAY ? who - W26_REPLAY : who
    const t = Math.round(delay * 20)
    return (w < 0 ? "a" : "" + w) + (t > 0 ? "@" + t : "") + ";"
}
// コース（ロボ・きえるブロック・とびら・モンスター・時間）に効く「する」。あとから加わった人のための やりなおしでは送らない
function w26World(id: string, message: string): void {
    const me = w26Who, d = w26Delay
    if (w26Probe) return
    if (me < W26_REPLAY) player.execute("scriptevent w26:" + id + " " + w26Head(me, d) + message)
    w26Who = me
    w26Delay = d
}
// 遊ぶ人に効く「する」（★・クリア・こうか・ワープ・アイテム・メッセージ）
function w26Person(id: string, message: string): void {
    const me = w26Who, d = w26Delay
    if (w26Probe) return
    player.execute("scriptevent w26:" + id + " " + w26Head(me, d) + message)
    w26Who = me
    w26Delay = d
}
// イベントを、みんな（_a）と 番号ごと（_0〜_7）で うける
function w26On(name: string, handler: () => void): void {
    player.onTellCommand(name + "_a", function () {
        w26Who = W26_ALL
        w26Delay = 0
        handler()
    })
    for (let i = 0; i < W26_SLOTS; i++) w26OnSlot(name, i, i, handler)
}
function w26OnSlot(name: string, slot: number, who: number, handler: () => void): void {
    player.onTellCommand(name + "_" + slot, function () {
        w26Who = who
        w26Delay = 0
        handler()
        w26Who = W26_ALL
        w26Delay = 0
    })
}
function w26OnAll(name: string, handler: () => void): void {
    player.onTellCommand(name, function () {
        w26Who = W26_ALL
        w26Delay = 0
        handler()
    })
}

// ---- go が とどかない 対策（11/24 Miya 決定。course_dev/minecraft/makecode-go-connection.md）
// (1) プログラムが うごきだしたら ワールドへ「つながったよ」（w26:alive）。とどかない子は MakeCode が マイクラと つながっていない
// (2) そのとき プログラムを まるごと ワールドへ 送る（w26:prog）。入りなおしたら ワールドが 組みなおして 開く
//     ジュニア冬は「うごいた ブロック」だけ 記録したが、ここは 下見（チェストと 同じ）で ぜんぶの イベントの 中を 1回 なぞる
//     → まだ ふまれていない 感圧板の 中も のこる。なぞる あいだは ブロックは 何も しない（しるしを 書くだけ）
let w26Dumping = false
let w26Toks: string[] = []
let w26EvToks: string[] = []
let w26EvFns: (() => void)[] = []
function w26Reg(tok: string, handler: () => void): void {
    w26EvToks.push(tok)
    w26EvFns.push(handler)
}
function w26Tok(tok: string): boolean {
    if (!w26Dumping) return false
    w26Toks.push(tok)
    return true
}
function w26Dump(): void {
    const n = w26EvToks.length
    if (n == 0) player.execute("scriptevent w26:prog 0/0")
    for (let i = 0; i < n; i++) {
        w26Toks = []
        w26Dumping = true
        w26EvFns[i]()
        w26Dumping = false
        player.execute("scriptevent w26:prog " + i + "/" + n + "¦" + w26EvToks[i] + (w26Toks.length ? "¦" + w26Toks.join("¦") : ""))
    }
    w26Who = W26_ALL
    w26Delay = 0
}
// うごきだして すぐは とどかない ことが ある（ジュニア冬 11/24 MEE）→ 1.5びょう まって 送る
loops.runInBackground(function () {
    loops.pause(1500)
    player.execute("scriptevent w26:alive 0.4.8")
    w26Dump()
})

// ワールドからの よびかけに こたえる（プログラムが うごいているかを ワールドが たしかめる）。「〇秒ごとに」の秒も わたす
// チェストは さわった しゅんかんに 開く・開かないが きまるので、ワールドは 前もって「どの チェストに どの アイテムが いるか」を 知っておく。
// そのため スタートの前に「チェストに さわったとき」の 中を 1回 なぞる（下見。ブロックは 何も 送らない。「もし〜もっていたら」だけ 書きとめる）
player.onTellCommand("w26_ping", function () {
    w26Guards = []
    for (let i = 0; i < w26TouchIds.length; i++) {
        if (w26TouchIds[i].indexOf("chest_") != 0) continue
        w26Probe = w26TouchIds[i]
        w26Who = W26_ALL
        w26Delay = 0
        w26TouchFns[i]()
    }
    w26Probe = ""
    w26Who = W26_ALL
    w26Delay = 0
    player.execute("scriptevent w26:guard a;" + w26Guards.join(","))
    player.execute("scriptevent w26:watch a;" + w26Watch.join(","))
    player.execute("scriptevent w26:pong a;" + w26Everys.join(","))
})

//% color="#E04A3A" weight=100 block="イベント" icon="" groups='["ゲーム", "コース", "アイテム", "モンスター", "時間・★"]'
namespace W26Event {
    //% blockId=w26_on_start block="スタートしたとき"
    //% group="ゲーム" weight=100
    export function onStart(handler: () => void): void {
        w26Reg("start", handler)
        w26OnAll("w26_start", handler)
        // ゲームのとちゅうで加わった人：人に効くブロックだけ、その人に もう一度
        for (let i = 0; i < W26_SLOTS; i++) w26OnSlot("w26_join", i, W26_REPLAY + i, handler)
    }

    //% blockId=w26_on_goal block="ゴールしたとき"
    //% group="ゲーム" weight=95
    export function onGoal(handler: () => void): void {
        w26Reg("goal", handler)
        w26On("w26_goal", handler)
    }

    //% blockId=w26_on_plate block="$plate の 感圧板が ふまれた とき"
    //% plate.fieldEditor="imagedropdown" plate.fieldOptions.columns=6 plate.fieldOptions.width=480 plate.fieldOptions.tooltips=true
    //% group="コース" weight=90
    export function onPlate(plate: W26Plate, handler: () => void): void {
        w26Reg("plate:" + plate, handler)
        // マイクラの 感圧板（しゅるいで えらぶ）。その子が 置いた 物だけ（となりの コースと まざらない・Miya 11/23）
        w26On("w26_plate_" + W26_PLATE_IDS[plate], handler)
    }

    //% blockId=w26_on_button block="$button の ボタンが おされた とき"
    //% button.fieldEditor="imagedropdown" button.fieldOptions.columns=6 button.fieldOptions.width=480 button.fieldOptions.tooltips=true
    //% group="コース" weight=89
    export function onButton(button: W26Button, handler: () => void): void {
        w26Reg("button:" + button, handler)
        w26On("w26_button_" + W26_BUTTON_IDS[button], handler)
    }

    //% blockId=w26_on_out block="アウトゆかに のったとき"
    //% group="コース" weight=85
    export function onOut(handler: () => void): void {
        w26Reg("out", handler)
        w26On("w26_out", handler)
    }

    //% blockId=w26_on_touch block="$lock に さわったとき"
    //% lock.fieldEditor="imagedropdown" lock.fieldOptions.columns=5 lock.fieldOptions.width=250
    //% group="コース" weight=80
    export function onTouch(lock: W26Lock, handler: () => void): void {
        w26Reg("touch:" + lock, handler)
        w26TouchIds.push(W26_LOCK_IDS[lock])
        w26TouchFns.push(handler)
        w26On("w26_touch_" + W26_LOCK_IDS[lock], handler)
    }

    //% blockId=w26_on_got block="$item を ゲットしたとき"
    //% item.shadow=minecraftItem
    //% group="アイテム" weight=75
    export function onGot(item: number, handler: () => void): void {
        w26Reg("got:" + item, handler)
        w26WatchItem(item)
        w26On("w26_got_" + item, handler)
    }

    //% blockId=w26_on_use block="$item を つかったとき"
    //% item.shadow=minecraftItem
    //% group="アイテム" weight=70
    export function onUse(item: number, handler: () => void): void {
        w26Reg("use:" + item, handler)
        w26WatchItem(item)
        w26On("w26_use_" + item, handler)
    }

    //% blockId=w26_on_monster_down block="$kind を たおしたとき"
    //% kind.fieldEditor="imagedropdown" kind.fieldOptions.columns=6 kind.fieldOptions.width=480 kind.fieldOptions.tooltips=true
    //% group="モンスター" weight=65
    export function onDown(kind: W26MonsterDown, handler: () => void): void {
        w26Reg("down:" + kind, handler)
        // v0.4.7（Miya 11/23）：しゅるいを えらぶ。「すべて」は どれを たおしても
        w26On(kind == W26MonsterDown.All ? "w26_monster_down" : "w26_mdown_" + W26_MONSTER_IDS[kind], handler)
    }

    //% blockId=w26_on_hit block="モンスターに こうげきされたとき"
    //% group="モンスター" weight=60
    export function onHit(handler: () => void): void {
        w26Reg("hit", handler)
        w26On("w26_hit", handler)
    }

    //% blockId=w26_on_dead block="やられたとき"
    //% group="モンスター" weight=55
    export function onDead(handler: () => void): void {
        w26Reg("dead", handler)
        w26On("w26_dead", handler)
    }

    //% blockId=w26_every block="$seconds 秒ごとに"
    //% seconds.defl=3 seconds.min=1 seconds.max=60
    //% group="時間・★" weight=50
    export function every(seconds: number, handler: () => void): void {
        w26Reg("every:" + seconds, handler)
        // 時間は ワールドが数える。ここは 番号と秒を おぼえて、知らせを待つだけ
        const id = w26Everys.length
        w26Everys.push(Math.max(1, seconds))
        w26OnAll("w26_every_" + id, handler)
    }

    //% blockId=w26_on_timeup block="時間ぎれに なったとき"
    //% group="時間・★" weight=45
    export function onTimeUp(handler: () => void): void {
        w26Reg("timeup", handler)
        w26OnAll("w26_timeup", handler)
    }

    //% blockId=w26_on_point block="★が $n に なったとき"
    //% n.defl=5 n.min=1
    //% group="時間・★" weight=40
    export function onPoint(n: number, handler: () => void): void {
        w26Reg("point:" + n, handler)
        w26On("w26_point_" + n, handler)
    }
}

//% color="#E8A202" weight=90 block="しかけ" icon=""
namespace W26Trick {
    //% blockId=w26_marker_set block="$robo の マーカーを $block に する"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% block.shadow=minecraftBlock
    //% weight=100
    export function markerSet(robo: W26Robo, block: number): void {
        if (w26Tok("mset:" + robo + ":" + block)) return
        // その色の マーカーを ぜんぶ、えらんだ ブロックに する（はし・かべ・かいだんは マーカーの ならべ方で きまる。Miya 11/23）
        w26World("marker_set", W26_COLOR_IDS[robo] + "|" + blocks.nameOfBlock(block))
    }

    //% blockId=w26_marker_back block="$robo の マーカーを もとに もどす"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% weight=95
    export function markerBack(robo: W26Robo): void {
        if (w26Tok("mback:" + robo)) return
        w26World("marker_back", W26_COLOR_IDS[robo])
    }

    //% blockId=w26_monster block="$robo の マーカーで $kind を だす"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% kind.fieldEditor="imagedropdown" kind.fieldOptions.columns=6 kind.fieldOptions.width=480 kind.fieldOptions.tooltips=true
    //% weight=85
    export function spawn(robo: W26Robo, kind: W26Monster): void {
        if (w26Tok("monster:" + robo + ":" + kind)) return
        w26World("monster", W26_COLOR_IDS[robo] + "|" + W26_MONSTER_IDS[kind])
    }

    //% blockId=w26_animal block="$robo の マーカーで $kind を だす"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% kind.fieldEditor="imagedropdown" kind.fieldOptions.columns=5 kind.fieldOptions.width=400 kind.fieldOptions.tooltips=true
    //% weight=83
    export function spawnAnimal(robo: W26Robo, kind: W26Animal): void {
        if (w26Tok("animal:" + robo + ":" + kind)) return
        // いきもの（v0.4.8・Miya 11/23「モンスター・いきもの・そのほか で 分けたい」）。ワールドへの 送り方は モンスターと 同じ
        w26World("monster", W26_COLOR_IDS[robo] + "|" + W26_MONSTER_IDS[kind])
    }

    //% blockId=w26_fx block="$robo の マーカーで $fx を だす"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% fx.fieldEditor="imagedropdown" fx.fieldOptions.columns=3 fx.fieldOptions.width=240 fx.fieldOptions.tooltips=true
    //% weight=80
    export function fx(robo: W26Robo, fx: W26Fx): void {
        if (w26Tok("fx:" + robo + ":" + fx)) return
        w26World("fx", W26_COLOR_IDS[robo] + "|" + W26_FX_IDS[fx])
    }

    //% blockId=w26_particle block="$robo の マーカーで $p を だす"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% p.fieldEditor="imagedropdown" p.fieldOptions.columns=3 p.fieldOptions.width=192 p.fieldOptions.tooltips=true
    //% weight=78
    export function particle(robo: W26Robo, p: W26Particle): void {
        if (w26Tok("part:" + robo + ":" + p)) return
        w26World("particle", W26_COLOR_IDS[robo] + "|" + W26_PARTICLE_IDS[p])
    }

    //% blockId=w26_floor_off block="$floor の きえるブロックを けす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=70
    export function floorOff(floor: W26Floor): void {
        if (w26Tok("floor_off:" + floor)) return
        w26World("floor_off", W26_COLOR_IDS[floor])
    }

    //% blockId=w26_floor_on block="$floor の きえるブロックを もどす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=65
    export function floorOn(floor: W26Floor): void {
        if (w26Tok("floor_on:" + floor)) return
        w26World("floor_on", W26_COLOR_IDS[floor])
    }

    //% blockId=w26_key_open block="もし $item を もっていたら ひらく|そうでないなら ひらかない"
    //% inlineInputMode=external
    //% item.shadow=minecraftItem
    //% weight=62
    export function keyOpen(item: number): void {
        if (w26Tok("keyopen:" + item)) return
        // さわった とびら・チェストを、その人が item を もっていれば ひらく。もっていなければ ひらかない（チェストは その人だけ・はなれるまで）
        // もっているかは ワールドが さわった しゅんかんに 見る（どれを さわったかも ワールドが おぼえている）
        // チェストは 下見で 書きとめた ものを ワールドが つかう（さわった しゅんかんに きめる）。ここで 送るのは とびらの ため
        if (w26Probe) { w26Guards.push(w26Probe + "=" + w26ItemName(item)); return }
        w26World("key_open", w26ItemName(item))
    }

    //% blockId=w26_door_open block="$door の とびらを ひらく"
    //% door.fieldEditor="imagedropdown" door.fieldOptions.columns=4 door.fieldOptions.width=200
    //% weight=60
    export function doorOpen(door: W26Door): void {
        if (w26Tok("door:" + door)) return
        w26World("door_open", W26_COLOR_IDS[door])
    }
}

//% color="#2E7D32" weight=80 block="あそぶ人" icon=""
namespace W26Player {
    //% blockId=w26_give block="$item を $n こ あげる"
    //% item.shadow=minecraftItem
    //% n.defl=1 n.min=1 n.max=64
    //% weight=100
    export function give(item: number, n: number): void {
        if (w26Tok("give:" + item + ":" + n)) return
        w26Person("give", w26ItemName(item) + "|" + Math.max(1, Math.round(n)))
    }

    //% blockId=w26_take block="$item を $n こ けす"
    //% item.shadow=minecraftItem
    //% n.defl=1 n.min=1 n.max=64
    //% weight=95
    export function take(item: number, n: number): void {
        if (w26Tok("take:" + item + ":" + n)) return
        // もちものから けす（Miya 11/23「けすも ほしい 個数つきで」）。もっている より 多ければ ある だけ
        w26Person("take", w26ItemName(item) + "|" + Math.max(1, Math.round(n)))
    }

    //% blockId=w26_effect block="$effect を $seconds 秒 つける　つよさ $level"
    //% effect.fieldEditor="imagedropdown" effect.fieldOptions.columns=5 effect.fieldOptions.width=250
    //% seconds.defl=5 seconds.min=1 seconds.max=60
    //% level.defl=1 level.min=1 level.max=5
    //% weight=90
    export function effect(effect: W26Effect, seconds: number, level: number): void {
        if (w26Tok("effect:" + effect + ":" + seconds + ":" + level)) return
        // つよさ 1〜5（マイクラの レベル I〜V）。上を 5で とめるのは、ジャンプ・うくが 強すぎると コースの 外へ 飛ぶため（Miya 11/23「強さも 決めたい」）
        w26Person("effect", W26_EFFECT_IDS[effect] + "|" + seconds + "|" + level)
    }

    //% blockId=w26_pparticle block="あそぶ人に $p を だす"
    //% p.fieldEditor="imagedropdown" p.fieldOptions.columns=3 p.fieldOptions.width=192 p.fieldOptions.tooltips=true
    //% weight=85
    export function particle(p: W26Particle): void {
        if (w26Tok("ppart:" + p)) return
        w26Person("pparticle", W26_PARTICLE_IDS[p])
    }

    //% blockId=w26_warp block="$robo の マーカーへ テレポートさせる"
    //% robo.fieldEditor="imagedropdown" robo.fieldOptions.columns=7 robo.fieldOptions.width=350
    //% weight=80
    export function warp(robo: W26Robo): void {
        if (w26Tok("warp:" + robo)) return
        w26Person("warp", W26_COLOR_IDS[robo])
    }

    //% blockId=w26_back block="スタートに もどす"
    //% weight=70
    export function back(): void {
        if (w26Tok("back")) return
        w26Person("back", "")
    }

    //% blockId=w26_say block="メッセージ $text を だす"
    //% text.defl="やったね！"
    //% weight=60
    export function say(text: string): void {
        if (w26Tok("say:" + text)) return
        w26Person("say", text)
    }
}

//% color="#5B6BC0" weight=70 block="ゲーム" icon=""
namespace W26Game {
    //% blockId=w26_limit block="$seconds 秒で おわりに する"
    //% seconds.defl=60 seconds.min=0 seconds.max=600
    //% weight=100
    export function setLimit(seconds: number): void {
        if (w26Tok("limit:" + seconds)) return
        w26World("limit", "" + Math.max(0, seconds))
    }

    //% blockId=w26_point block="★を $n $change"
    //% n.defl=1 n.min=1
    //% weight=90
    export function point(n: number, change: W26Change): void {
        if (w26Tok("star:" + n + ":" + change)) return
        w26Person("point", "" + (change == W26Change.Sub ? 0 - n : n))
    }

    //% blockId=w26_wait block="$seconds 秒 まつ"
    //% seconds.defl=1 seconds.min=0 seconds.max=60
    //% weight=80
    export function wait(seconds: number): void {
        if (w26Tok("wait:" + seconds)) return
        const s = Math.max(0, seconds)
        if (w26Delay + s <= W26_DELAY_CAP) {
            w26Delay += s      // 待たない。あとの「する」が そのぶん おくれて動く（ワールドが数える）
            return
        }
        const me = w26Who, d = w26Delay
        loops.pause(s * 1000)
        w26Who = me
        w26Delay = d
    }

    //% blockId=w26_wait_tick block="$ticks tick まつ"
    //% ticks.defl=1 ticks.min=1 ticks.max=20
    //% weight=79
    export function waitTick(ticks: number): void {
        if (w26Tok("tick:" + ticks)) return
        // 1 tick ＝ 1/20 秒（Miya 11/23「1tick まつも つくれたりしないかな」）。ワールドが 数える
        wait(Math.max(1, Math.round(ticks)) / 20)
    }

    //% blockId=w26_repeat block="$times 回 くりかえす"
    //% times.defl=4 times.min=1 times.max=100
    //% handlerStatement=1
    //% weight=70
    export function repeat(times: number, handler: () => void): void {
        if (w26Dumping) {
            w26Toks.push("rep:" + times)
            handler()
            w26Toks.push("end")
            return
        }
        for (let i = 0; i < times; i++) handler()
    }

    //% blockId=w26_clear block="クリアに する"
    //% weight=60
    export function clear(): void {
        if (w26Tok("clear")) return
        w26Person("clear", "")
    }

    //% blockId=w26_gameover block="ゲームオーバーに する"
    //% weight=50
    export function gameOver(): void {
        if (w26Tok("gameover")) return
        w26Person("gameover", "")
    }
}
