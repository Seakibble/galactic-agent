Upgrade = function (x, y, type = 'dash') {
    let obj = Obj(x, y)
    obj.size.x = 50
    obj.size.y = 50
    obj.type = type

    obj.collision = true
    obj.color = "cyan"
    obj.collectable = true
    obj.phase = null

    obj.onCollision = function (other) {
        if (other.player) {
            Sound.playSFX('upgrade')
            other.upgrades[this.type] = true
            this.destroy = true
        }
    }
    obj.draw = function () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(3000, 5, this.phase)
        let pivot = Pivot(this.size.x/2, this.size.y/2, Math.PI/4+pulse)
        camera.Render(Draw(this.pos.x, this.pos.y, this.size.x, this.size.y, this.color, pivot))
        camera.Render(DrawText(this.pos.x+this.size.x/2, this.pos.y + 30, this.type, 'black', 'center','bold 20px Fira Mono'))
    }
    obj.update = function () {
        // if (this.pos.distance(game.player.pos) < 100) {
        //     let toPlayer = Pyre.Vector.lerpDifference(this.pos, game.player.pos, 0.03)
        //     this.vel.add(toPlayer)
        // } else {
        //     this.vel.multiply(0.5)
        // }
        // this.pos.add(this.vel)
    },

    Data.objects.push(obj)
    Sound.loadSFX('upgrade')
    return obj
}