Orb = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 32
    obj.size.y = 32
    obj.name = 'orb'

    obj.collision = true
    obj.shootable = false
    obj.color = "lightyellow"
    obj.collectable = true
    obj.collectRange = 100
    obj.following = false
    obj.phase = null

    obj.onCollision = function (other) {
        if (other.player) {
            Data.orbsThisLevel++
            Sound.playSFX(this.name)
            this.destroy = true
        }
    }
    obj.draw = function () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(400, 5, this.phase)
        let pivot = Pivot(this.size.x / 2, this.size.y / 2)
        // let pivot = Pivot(this.size.x / 2, this.size.y / 2, Math.PI / 4 + pulse)
        camera.Render(Draw(this.pos.x, this.pos.y + pulse, this.size.x, this.size.y, this.color, pivot, this.image))
    }
    obj.update = function () {
        if (this.pos.distance(Data.player.center()) < this.collectRange) {
            this.following = true    
        }
        if (this.following) {
            let toPlayer = Pyre.Vector.lerpDifference(this.pos, Data.player.center(), 0.02)
            this.vel.add(toPlayer.multiply(Game.timeScale))
        }
        this.vel.multiply(0.95)
        
        this.pos.add(this.vel.clone().multiply(Game.timeScale))
    }

    obj.loadImage(obj.name, obj.size.x, obj.size.y)
    Data.objects.push(obj)
    Sound.loadSFX(obj.name)
    return obj
}