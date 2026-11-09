// キャンプゲームづくりセット v0.2（基礎検討・Aimy 2026-11-10）
// ワールド側は「Aimyゲームづくり箱庭（基礎検討）」の w26set.js。ブロック → /scriptevent w26:〇〇、ワールド → /tell w26_〇〇。
// Miya 11/10「図やテクスチャ、絵を使ってほしい。文字はなるだけへらす」→ 部品・モンスターは ワールドと同じ絵で選ぶ。
// 場所は色でつなぐ（座標は使わない）。条件分岐は使わない（「てんが〇」も イベント）。
// 「てん」「クリア」「スタートに もどす」は、きっかけを起こした人（とった・たおした・つかまった・ふんだ人）に効く（マルチ）。

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
    Green = 3
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
enum W26Stairs {
    //% block="のぼり" jres=W26Icon.st_up
    Up = 0,
    //% block="くだり" jres=W26Icon.st_down
    Down = 1
}

const W26_COLOR_IDS = ["red", "blue", "yellow", "green"]
const W26_MONSTER_IDS = ["zombie", "spider", "slime"]
let w26Running = false

function w26Send(id: string, message: string): void {
    player.execute("scriptevent w26:" + id + " " + message)
}

//% color="#E04A3A" weight=100 block="ゲーム" icon="" groups='["とき", "する"]'
namespace W26Game {
    //% blockId=w26_on_start block="▶ スタート したとき"
    //% group="とき" weight=100
    export function onStart(handler: () => void): void {
        player.onTellCommand("w26_start", function () {
            w26Running = true
            handler()
        })
    }

    //% blockId=w26_on_goal block="🏁 ゴール したとき"
    //% group="とき" weight=90
    export function onGoal(handler: () => void): void {
        player.onTellCommand("w26_goal", handler)
    }

    //% blockId=w26_every block="⏱ $seconds びょう ごとに"
    //% seconds.defl=3 seconds.min=1 seconds.max=60
    //% group="とき" weight=80
    export function every(seconds: number, handler: () => void): void {
        loops.runInBackground(function () {
            while (true) {
                loops.pause(Math.max(1, seconds) * 1000)
                if (w26Running) handler()
            }
        })
    }

    //% blockId=w26_on_timeup block="⏱ じかんぎれ のとき"
    //% group="とき" weight=70
    export function onTimeUp(handler: () => void): void {
        player.onTellCommand("w26_timeup", handler)
    }

    //% blockId=w26_limit block="⏱ $seconds びょう"
    //% seconds.defl=60 seconds.min=0 seconds.max=600
    //% group="する" weight=60
    export function setLimit(seconds: number): void {
        w26Send("limit", "" + Math.max(0, seconds))
    }

    //% blockId=w26_clear block="★ クリア"
    //% group="する" weight=50
    export function clear(): void {
        w26Send("clear", "")
    }

    //% blockId=w26_gameover block="✖ ゲームオーバー"
    //% group="する" weight=40
    export function gameOver(): void {
        w26Send("gameover", "")
    }

    //% blockId=w26_back block="◀ スタートに もどす"
    //% group="する" weight=30
    export function back(): void {
        w26Send("back", "")
    }

    //% blockId=w26_kit block="ぶひんを もらう"
    //% group="する" weight=10
    export function kit(): void {
        w26Send("kit", "")
    }
}

// ゲームが おわったら「〇びょうごとに」を とめる
player.onTellCommand("w26_end", function () {
    w26Running = false
})

//% color="#0071BC" weight=95 block="つくる" icon=""
namespace W26Build {
    //% blockId=w26_floor block="ゆか $length"
    //% length.defl=5 length.min=1 length.max=64
    //% weight=100
    export function floor(length: number): void {
        w26Send("floor", "" + length)
    }

    //% blockId=w26_color_floor block="$floor $length"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% length.defl=5 length.min=1 length.max=64
    //% weight=90
    export function colorFloor(floor: W26Floor, length: number): void {
        w26Send("floor", length + "|" + W26_COLOR_IDS[floor])
    }

    //% blockId=w26_stairs block="$dir $steps"
    //% dir.fieldEditor="imagedropdown" dir.fieldOptions.columns=2 dir.fieldOptions.width=100
    //% steps.defl=5 steps.min=1 steps.max=64
    //% weight=80
    export function stairs(dir: W26Stairs, steps: number): void {
        w26Send("stairs", steps + "|" + (dir == W26Stairs.Up ? "up" : "down"))
    }
}

//% color="#E8A202" weight=90 block="しかけ" icon=""
namespace W26Trick {
    //% blockId=w26_on_switch block="$sw ふんだとき"
    //% sw.fieldEditor="imagedropdown" sw.fieldOptions.columns=4 sw.fieldOptions.width=200
    //% weight=100
    export function onSwitch(sw: W26Switch, handler: () => void): void {
        player.onTellCommand("w26_sw_" + W26_COLOR_IDS[sw], handler)
    }

    //% blockId=w26_bridge block="$mark はし $length"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=4 mark.fieldOptions.width=200
    //% length.defl=3 length.min=1 length.max=64
    //% weight=90
    export function bridge(mark: W26Mark, length: number): void {
        w26Send("bridge", W26_COLOR_IDS[mark] + "|" + length)
    }

    //% blockId=w26_floor_off block="$floor けす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=80
    export function floorOff(floor: W26Floor): void {
        w26Send("floor_off", W26_COLOR_IDS[floor])
    }

    //% blockId=w26_floor_on block="$floor だす"
    //% floor.fieldEditor="imagedropdown" floor.fieldOptions.columns=4 floor.fieldOptions.width=200
    //% weight=70
    export function floorOn(floor: W26Floor): void {
        w26Send("floor_on", W26_COLOR_IDS[floor])
    }
}

//% color="#6C3A8E" weight=85 block="モンスター" icon=""
namespace W26Monsters {
    //% blockId=w26_monster block="$mark に $kind"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=4 mark.fieldOptions.width=200
    //% kind.fieldEditor="imagedropdown" kind.fieldOptions.columns=3 kind.fieldOptions.width=150
    //% weight=100
    export function spawn(mark: W26Mark, kind: W26Monster): void {
        w26Send("monster", W26_COLOR_IDS[mark] + "|" + W26_MONSTER_IDS[kind])
    }

    //% blockId=w26_on_caught block="つかまったとき"
    //% weight=90
    export function onCaught(handler: () => void): void {
        player.onTellCommand("w26_caught", handler)
    }

    //% blockId=w26_on_monster_down block="たおしたとき"
    //% weight=80
    export function onDown(handler: () => void): void {
        player.onTellCommand("w26_monster_down", handler)
    }
}

//% color="#02AC8F" weight=80 block="おたから" icon=""
namespace W26Treasure {
    //% blockId=w26_treasure block="$mark に $b"
    //% mark.fieldEditor="imagedropdown" mark.fieldOptions.columns=4 mark.fieldOptions.width=200
    //% b.shadow=minecraftBlock
    //% weight=100
    export function put(mark: W26Mark, b: number): void {
        // えらんだブロックを 頭の上 60 に いちど置く → ワールドが読んで おたからにし、けす（ジェットコースターロボと同じ）
        blocks.place(b, pos(0, 60, 0))
        w26Send("treasure", W26_COLOR_IDS[mark] + "|" + b)
    }

    //% blockId=w26_on_treasure block="とったとき"
    //% weight=90
    export function onGet(handler: () => void): void {
        player.onTellCommand("w26_treasure", handler)
    }

    //% blockId=w26_on_treasure_block block="$b を とったとき"
    //% b.shadow=minecraftBlock
    //% weight=85
    export function onGetBlock(b: number, handler: () => void): void {
        player.onTellCommand("w26_tr_" + b, handler)
    }

    //% blockId=w26_point block="★ + $n"
    //% n.defl=1
    //% weight=80
    export function addPoint(n: number): void {
        w26Send("point", "" + n)
    }

    //% blockId=w26_on_point block="★ が $n のとき"
    //% n.defl=5 n.min=1
    //% weight=70
    export function onPoint(n: number, handler: () => void): void {
        player.onTellCommand("w26_point_" + n, handler)
    }
}
