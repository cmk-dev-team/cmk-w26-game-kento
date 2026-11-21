// キャンプゲームづくりセット v0.3（基礎検討・Aimy 2026-11-21）
// ワールド側は「Aimyゲームづくり箱庭（基礎検討）」の w26set.js。ブロック → /scriptevent w26:〇〇、ワールド → /tell w26_〇〇。
//
// ■ マルチの考え方（Miya 11/21）：作った子の MakeCode が「操作盤」。遊ぶ人は MakeCode を動かさなくてよい。
//   ・ワールドは、遊ぶ人（そのコースのスタートに乗った人）に 0〜7 の番号をふる
//   ・知らせの名前に その番号がつく（例：w26_sw_red_3 ＝ 3番の人が あかのスイッチを ふんだ）。だれでもないときは _a
//   ・「とき」のブロックは 番号ごとに うけて、「いま だれの できごとか」（w26Who）をおぼえる
//   ・「する」のブロックは w26Who を いっしょに送る → ワールドが その人にだけ効かせる（★・クリア・こうか・ワープ など）
//   ・MakeCode は 待つ所（コマンドを送る・まつ）で ほかの「とき」に切りかわる。だから「する」のブロックは、
//     送る前の w26Who をおぼえておき、送ったあとで もどす（2人が同時に ふんでも まざらない）
//   ・ふつうの「一時停止」は もどさないので、このセットの「〇秒 まつ」を使う
// ■ ことば：物は絵、動きはことば。声に出すと文になる（Miya 11/10）。★は のこす。対象は小2〜小6なので 要所は漢字（Miya 11/21）

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
enum W26Mark {
    //% block="あか" jres=W26Icon.mark_red
    Red = 0,
    //% block="あお" jres=W26Icon.mark_blue
    Blue = 1,
    //% block="きいろ" jres=W26Icon.mark_yellow
    Yellow = 2,
    //% block="みどり" jres=W26Icon.mark_green
    Green = 3,
    //% block="ランダム" jres=W26Icon.mark_random
    Random = 4
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
enum W26Monster {
    //% block="ゾンビ" jres=W26Icon.m_zombie
    Zombie = 0,
    //% block="クモ" jres=W26Icon.m_spider
    Spider = 1,
    //% block="スライム" jres=W26Icon.m_slime
    Slime = 2
}
enum W26Power {
    //% block="ON" jres=W26Icon.pw_on
    On = 1,
    //% block="OFF" jres=W26Icon.pw_off
    Off = 0
}
enum W26Fx {
    //% block="かみなり" jres=W26Icon.fx_thunder
    Thunder = 0,
    //% block="はなび" jres=W26Icon.fx_firework
    Firework = 1,
    //% block="ばくはつ" jres=W26Icon.fx_boom
    Boom = 2
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
enum W26Item {
    //% block="けん" jres=W26Icon.i_sword
    Sword = 0,
    //% block="ゆみ" jres=W26Icon.i_bow
    Bow = 1,
    //% block="つえ" jres=W26Icon.i_rod
    Rod = 2,
    //% block="りんご" jres=W26Icon.i_apple
    Apple = 3
}

const W26_COLOR_IDS = ["red", "blue", "yellow", "green", "random"]
const W26_MONSTER_IDS = ["zombie", "spider", "slime"]
const W26_FX_IDS = ["thunder", "firework", "boom"]
const W26_EFFECT_IDS = ["jump", "speed", "slow", "float", "slowfall"]
const W26_ITEM_IDS = ["sword", "bow", "rod", "apple"]
const W26_SLOTS = 8          // 同時に遊べる人数（ワールド側と同じ数）
const W26_ALL = -1           // みんな（スタート・〇秒ごと・時間切れ）
const W26_REPLAY = 100       // あとから加わった人のために「スタートしたとき」を もう一度うごかす（人に効くブロックだけ送る）
let w26Running = false
let w26Who = W26_ALL         // いま うごいている「とき」は だれの できごとか

function w26WhoTag(who: number): string {
    const w = who >= W26_REPLAY ? who - W26_REPLAY : who
    return w < 0 ? "a" : "" + w
}
// コース（めじるし・ゆか・モンスター・時間）に効くブロック。あとから加わった人のための やりなおしでは送らない
function w26World(id: string, message: string): void {
    const me = w26Who
    if (me < W26_REPLAY) player.execute("scriptevent w26:" + id + " " + w26WhoTag(me) + ";" + message)
    w26Who = me
}
// 遊ぶ人に効くブロック（★・クリア・こうか・ワープ・アイテム・メッセージ）
function w26Person(id: string, message: string): void {
    const me = w26Who
    player.execute("scriptevent w26:" + id + " " + w26WhoTag(me) + ";" + message)
    w26Who = me
}
// 「とき」を、みんな（_a）と 番号ごと（_0〜_7）で うける
function w26On(name: string, handler: () => void): void {
    player.onTellCommand(name + "_a", function () {
        w26Who = W26_ALL
        handler()
    })
    for (let i = 0; i < W26_SLOTS; i++) w26OnSlot(name, i, i, handler)
}
function w26OnSlot(name: string, slot: number, who: number, handler: () => void): void {
    player.onTellCommand(name + "_" + slot, function () {
        w26Who = who
        handler()
        w26Who = W26_ALL
    })
}

// ワールドからの よびかけに こたえる（プログラムが うごいているかを ワールドが たしかめる）
player.onTellCommand("w26_ping", function () {
    player.execute("scriptevent w26:pong a;")
})
// ゲームが おわったら「〇秒ごとに」を とめる
player.onTellCommand("w26_end", function () {
    w26Running = false
})

//% color="#E04A3A" weight=100 block="ゲーム" icon="" groups='["とき", "する"]'
namespace W26Game {
    //% blockId=w26_on_start block="スタートしたとき"
    //% group="とき" weight=100
    export function onStart(handler: () => void): void {
        player.onTellCommand("w26_start", function () {
            w26Running = true
            w26Who = W26_ALL
            handler()
        })
        // ゲームのとちゅうで加わった人：人に効くブロックだけ、その人に もう一度
        for (let i = 0; i < W26_SLOTS; i++) w26OnSlot("w26_join", i, W26_REPLAY + i, handler)
    }

    //% blockId=w26_on_goal block="ゴールしたとき"
    //% group="とき" weight=90
    export function onGoal(handler: () => void): void {
        w26On("w26_goal", handler)
    }

    //% blockId=w26_every block="$seconds 秒ごとに"
    //% seconds.defl=3 seconds.min=1 seconds.max=60
    //% group="とき" weight=80
    export function every(seconds: number, handler: () => void): void {
        loops.runInBackground(function () {
            while (true) {
                loops.pause(Math.max(1, seconds) * 1000)
                if (w26Running) {
                    w26Who = W26_ALL
                    handler()
                }
            }
        })
    }

    //% blockId=w26_on_timeup block="時間ぎれに なったとき"
    //% group="とき" weight=70
    export function onTimeUp(handler: () => void): void {
        player.onTellCommand("w26_timeup", function () {
            w26Who = W26_ALL
            handler()
        })
    }

    //% blockId=w26_limit block="$seconds 秒で おわりに する"
    //% seconds.defl=60 seconds.min=0 seconds.max=600
    //% group="する" weight=60
    export function setLimit(seconds: number): void {
        w26World("limit", "" + Math.max(0, seconds))
    }

    //% blockId=w26_wait block="$seconds 秒 まつ"
    //% seconds.defl=1 seconds.min=0 seconds.max=60
    //% group="する" weight=55
    export function wait(seconds: number): void {
        const me = w26Who
        loops.pause(Math.max(0, seconds) * 1000)
        w26Who = me
    }

    //% blockId=w26_clear block="クリアに する"
    //% group="する" weight=50
    export function clear(): void {
        w26Person("clear", "")
    }

    //% blockId=w26_gameover block="ゲームオーバーに する"
    //% group="する" weight=40
    export function gameOver(): void {
        w26Person("gameover", "")
    }

    //% blockId=w26_kit block="ぶひんを もらう"
    //% group="する" weight=10
    export function kit(): void {
        player.execute("scriptevent w26:kit a;")
    }
}

//% color="#E8A202" weight=90 block="しかけ" icon=""
namespace W26Trick {
    //% blockId=w26_on_switch block="$sw の スイッチを ふんだとき"
    //% sw.fieldEditor="imagedropdown" sw.fieldOptions.columns=4 sw.fieldOptions.width=200
    //% weight=100
    export function onSwitch(sw: W26Switch, handler: () => void): void {
        w26On("w26_sw_" + W26_COLOR_IDS[sw], handler)
    }

    //% blockId=w26_power block="$mark の めじるしを $power に する"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% power.fieldEditor="imagedropdown" power.fieldOptions.columns=2 power.fieldOptions.width=100
    //% weight=95
    export function power(mark: W26Mark, power: W26Power): void {
        w26World("power", W26_COLOR_IDS[mark] + "|" + (power == W26Power.On ? "on" : "off"))
    }

    //% blockId=w26_bridge block="$mark の めじるしから はしを $length マス だす"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% length.defl=3 length.min=1 length.max=64
    //% weight=90
    export function bridge(mark: W26Mark, length: number): void {
        w26World("bridge", W26_COLOR_IDS[mark] + "|" + length)
    }

    //% blockId=w26_floor_off block="$floor の ゆかを けす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=80
    export function floorOff(floor: W26Floor): void {
        w26World("floor_off", W26_COLOR_IDS[floor])
    }

    //% blockId=w26_floor_on block="$floor の ゆかを だす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=70
    export function floorOn(floor: W26Floor): void {
        w26World("floor_on", W26_COLOR_IDS[floor])
    }

    //% blockId=w26_fx block="$mark の めじるしに $fx を おこす"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% fx.fieldEditor="imagedropdown" fx.fieldOptions.columns=3 fx.fieldOptions.width=150
    //% weight=60
    export function fx(mark: W26Mark, fx: W26Fx): void {
        w26World("fx", W26_COLOR_IDS[mark] + "|" + W26_FX_IDS[fx])
    }
}

//% color="#6C3A8E" weight=85 block="モンスター" icon=""
namespace W26Monsters {
    //% blockId=w26_monster block="$mark の めじるしに $kind を だす"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% kind.fieldEditor="imagedropdown" kind.fieldOptions.columns=3 kind.fieldOptions.width=150
    //% weight=100
    export function spawn(mark: W26Mark, kind: W26Monster): void {
        w26World("monster", W26_COLOR_IDS[mark] + "|" + W26_MONSTER_IDS[kind])
    }

    //% blockId=w26_on_caught block="モンスターに つかまったとき"
    //% weight=90
    export function onCaught(handler: () => void): void {
        w26On("w26_caught", handler)
    }

    //% blockId=w26_on_monster_down block="モンスターを たおしたとき"
    //% weight=80
    export function onDown(handler: () => void): void {
        w26On("w26_monster_down", handler)
    }
}

//% color="#02AC8F" weight=80 block="おたから" icon=""
namespace W26Treasure {
    //% blockId=w26_treasure block="$mark の めじるしに $b を おたからとして おく"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% b.shadow=minecraftBlock
    //% weight=100
    export function put(mark: W26Mark, b: number): void {
        // えらんだブロックを 頭の上 60 に いちど置く → ワールドが読んで おたからにし、けす（ジェットコースターロボと同じ）
        const me = w26Who
        if (me >= W26_REPLAY) return
        blocks.place(b, pos(0, 60, 0))
        w26Who = me
        w26World("treasure", W26_COLOR_IDS[mark] + "|" + b)
    }

    //% blockId=w26_on_treasure block="おたからを とったとき"
    //% weight=90
    export function onGet(handler: () => void): void {
        w26On("w26_treasure", handler)
    }

    //% blockId=w26_on_treasure_block block="おたから $b を とったとき"
    //% b.shadow=minecraftBlock
    //% weight=85
    export function onGetBlock(b: number, handler: () => void): void {
        w26On("w26_tr_" + b, handler)
    }

    //% blockId=w26_point block="★を $n ふやす"
    //% n.defl=1
    //% weight=80
    export function addPoint(n: number): void {
        w26Person("point", "" + n)
    }

    //% blockId=w26_point_sub block="★を $n へらす"
    //% n.defl=1 n.min=1
    //% weight=75
    export function subPoint(n: number): void {
        w26Person("point", "" + (0 - n))
    }

    //% blockId=w26_on_point block="★が $n に なったとき"
    //% n.defl=5 n.min=1
    //% weight=70
    export function onPoint(n: number, handler: () => void): void {
        w26On("w26_point_" + n, handler)
    }
}

// 名前は「あそぶ人」（MakeCode に もとからある「プレイヤー」と かぶらないように）
//% color="#2E7D32" weight=75 block="あそぶ人" icon="" groups='["とき", "する"]'
namespace W26Player {
    //% blockId=w26_on_fall block="おちたとき"
    //% group="とき" weight=100
    export function onFall(handler: () => void): void {
        w26On("w26_fall", handler)
    }

    //% blockId=w26_on_use block="$item を つかったとき"
    //% item.fieldEditor="imagedropdown" item.fieldOptions.columns=4 item.fieldOptions.width=200
    //% group="とき" weight=90
    export function onUse(item: W26Item, handler: () => void): void {
        w26On("w26_use_" + W26_ITEM_IDS[item], handler)
    }

    //% blockId=w26_effect block="$effect を $seconds 秒 つける"
    //% effect.fieldEditor="imagedropdown" effect.fieldOptions.columns=5 effect.fieldOptions.width=250
    //% seconds.defl=5 seconds.min=1 seconds.max=60
    //% group="する" weight=80
    export function effect(effect: W26Effect, seconds: number): void {
        w26Person("effect", W26_EFFECT_IDS[effect] + "|" + seconds)
    }

    //% blockId=w26_warp block="$mark の めじるしへ ワープさせる"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=5 mark.fieldOptions.width=250
    //% group="する" weight=70
    export function warp(mark: W26Mark): void {
        w26Person("warp", W26_COLOR_IDS[mark])
    }

    //% blockId=w26_back block="スタートに もどす"
    //% group="する" weight=65
    export function back(): void {
        w26Person("back", "")
    }

    //% blockId=w26_give block="$item を あげる"
    //% item.fieldEditor="imagedropdown" item.fieldOptions.columns=4 item.fieldOptions.width=200
    //% group="する" weight=60
    export function give(item: W26Item): void {
        w26Person("give", W26_ITEM_IDS[item])
    }

    //% blockId=w26_say block="メッセージ $text を だす"
    //% text.defl="やったね！"
    //% group="する" weight=50
    export function say(text: string): void {
        w26Person("say", text)
    }
}
