// キャンプゲームづくりセット（基礎検討・Aimy 2026-11-10）
// ワールド側は「Aimyゲームづくり箱庭（基礎検討）」の w26set.js。ブロック → /scriptevent w26:〇〇、ワールド → /tell w26_〇〇。
// 場所は色でつなぐ（座標は使わない）。条件分岐は使わない（「点が〇になったとき」もイベント）。

enum W26Color {
    //% block="あか"
    Red = 0,
    //% block="あお"
    Blue = 1,
    //% block="きいろ"
    Yellow = 2,
    //% block="みどり"
    Green = 3
}
enum W26Stairs {
    //% block="のぼり"
    Up = 0,
    //% block="くだり"
    Down = 1
}
enum W26Monster {
    //% block="ゾンビ"
    Zombie = 0,
    //% block="クモ"
    Spider = 1,
    //% block="スライム"
    Slime = 2
}

const W26_COLOR_IDS = ["red", "blue", "yellow", "green"]
const W26_MONSTER_IDS = ["zombie", "spider", "slime"]
let w26Running = false

function w26Send(id: string, message: string): void {
    player.execute("scriptevent w26:" + id + " " + message)
}

//% color="#E04A3A" weight=100 block="ゲーム" groups='["イベント", "ルール"]'
namespace W26Game {
    //% blockId=w26_on_start block="スタートしたとき"
    //% group="イベント" weight=100
    export function onStart(handler: () => void): void {
        player.onTellCommand("w26_start", function () {
            w26Running = true
            handler()
        })
    }

    //% blockId=w26_on_goal block="ゴールしたとき"
    //% group="イベント" weight=90
    export function onGoal(handler: () => void): void {
        player.onTellCommand("w26_goal", handler)
    }

    //% blockId=w26_every block="ゲームちゅう $seconds びょうごとに"
    //% seconds.defl=3 seconds.min=1 seconds.max=60
    //% group="イベント" weight=80
    export function every(seconds: number, handler: () => void): void {
        loops.runInBackground(function () {
            while (true) {
                loops.pause(Math.max(1, seconds) * 1000)
                if (w26Running) handler()
            }
        })
    }

    //% blockId=w26_on_timeup block="じかんぎれに なったとき"
    //% group="イベント" weight=70
    export function onTimeUp(handler: () => void): void {
        player.onTellCommand("w26_timeup", handler)
    }

    //% blockId=w26_limit block="せいげん じかんを $seconds びょうに する"
    //% seconds.defl=60 seconds.min=0 seconds.max=600
    //% group="ルール" weight=60
    export function setLimit(seconds: number): void {
        w26Send("limit", "" + Math.max(0, seconds))
    }

    //% blockId=w26_clear block="クリアに する"
    //% group="ルール" weight=50
    export function clear(): void {
        w26Send("clear", "")
    }

    //% blockId=w26_gameover block="ゲームオーバーに する"
    //% group="ルール" weight=40
    export function gameOver(): void {
        w26Send("gameover", "")
    }

    //% blockId=w26_kit block="ぶひんを もらう"
    //% group="ルール" weight=10
    export function kit(): void {
        w26Send("kit", "")
    }
}

// ゲームが おわったら「〇びょうごとに」を とめる
player.onTellCommand("w26_end", function () {
    w26Running = false
})

//% color="#0071BC" weight=95 block="つくる"
namespace W26Build {
    //% blockId=w26_floor block="まえに ゆかを $length マス つくる"
    //% length.defl=5 length.min=1 length.max=64
    //% weight=100
    export function floor(length: number): void {
        w26Send("floor", "" + length)
    }

    //% blockId=w26_color_floor block="まえに $color の ゆかを $length マス つくる"
    //% length.defl=5 length.min=1 length.max=64
    //% weight=90
    export function colorFloor(color: W26Color, length: number): void {
        w26Send("floor", length + "|" + W26_COLOR_IDS[color])
    }

    //% blockId=w26_stairs block="まえに かいだんを $steps だん $dir つくる"
    //% steps.defl=5 steps.min=1 steps.max=64
    //% weight=80
    export function stairs(steps: number, dir: W26Stairs): void {
        w26Send("stairs", steps + "|" + (dir == W26Stairs.Up ? "up" : "down"))
    }
}

//% color="#E8A202" weight=90 block="しかけ"
namespace W26Trick {
    //% blockId=w26_on_switch block="$color の スイッチを ふんだとき"
    //% weight=100
    export function onSwitch(color: W26Color, handler: () => void): void {
        player.onTellCommand("w26_sw_" + W26_COLOR_IDS[color], handler)
    }

    //% blockId=w26_bridge block="$color の めじるしから はしを $length マス だす"
    //% length.defl=5 length.min=1 length.max=64
    //% weight=90
    export function bridge(color: W26Color, length: number): void {
        w26Send("bridge", W26_COLOR_IDS[color] + "|" + length)
    }

    //% blockId=w26_floor_off block="$color の ゆかを けす"
    //% weight=80
    export function floorOff(color: W26Color): void {
        w26Send("floor_off", W26_COLOR_IDS[color])
    }

    //% blockId=w26_floor_on block="$color の ゆかを だす"
    //% weight=70
    export function floorOn(color: W26Color): void {
        w26Send("floor_on", W26_COLOR_IDS[color])
    }
}

//% color="#6C3A8E" weight=85 block="モンスター"
namespace W26Monsters {
    //% blockId=w26_monster block="$color の めじるしに $kind を だす"
    //% weight=100
    export function spawn(color: W26Color, kind: W26Monster): void {
        w26Send("monster", W26_COLOR_IDS[color] + "|" + W26_MONSTER_IDS[kind])
    }

    //% blockId=w26_on_caught block="モンスターに つかまったとき"
    //% weight=90
    export function onCaught(handler: () => void): void {
        player.onTellCommand("w26_caught", handler)
    }

    //% blockId=w26_on_monster_down block="モンスターを たおしたとき"
    //% weight=80
    export function onDown(handler: () => void): void {
        player.onTellCommand("w26_monster_down", handler)
    }
}

//% color="#02AC8F" weight=80 block="おたから"
namespace W26Treasure {
    //% blockId=w26_treasure block="$color の めじるしに おたからを おく"
    //% weight=100
    export function put(color: W26Color): void {
        w26Send("treasure", W26_COLOR_IDS[color])
    }

    //% blockId=w26_on_treasure block="おたからを とったとき"
    //% weight=90
    export function onGet(handler: () => void): void {
        player.onTellCommand("w26_treasure", handler)
    }

    //% blockId=w26_point block="てんを $n ふやす"
    //% n.defl=1
    //% weight=80
    export function addPoint(n: number): void {
        w26Send("point", "" + n)
    }

    //% blockId=w26_on_point block="てんが $n に なったとき"
    //% n.defl=5 n.min=1
    //% weight=70
    export function onPoint(n: number, handler: () => void): void {
        player.onTellCommand("w26_point_" + n, handler)
    }
}
