Coin = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 10
    obj.size.y = 10

    obj.collision = true
    obj.shootable = false
    obj.color = "lightyellow"
    obj.collectable = true
    obj.collectRange = 100
    obj.phase = null

    obj.onCollision = function (other) {
        if (other.player) {
            Data.coinsThisLevel++
            Sound.playSFX('coin')
            this.destroy = true
        }
    }
    obj.draw = function () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(400, 5, this.phase)
        let pivot = Pivot(this.size.x / 2, this.size.y / 2, Math.PI / 4 + pulse)
        camera.Render(Draw(this.pos.x, this.pos.y + pulse, this.size.x, this.size.y, this.color, pivot))
    }
    obj.update = function () {
        if (this.pos.distance(Data.player.center()) < this.collectRange) {
            let toPlayer = Pyre.Vector.lerpDifference(this.pos, Data.player.center(), 0.03)
            this.vel.add(toPlayer.multiply(Game.timeScale))
        } else {
            this.vel.multiply(0.5)
        }
        this.pos.add(this.vel.clone().multiply(Game.timeScale))
    },

    Data.objects.push(obj)
    Sound.loadSFX('coin')
    return obj
}