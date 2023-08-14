HoverBot = function (x, y) {
    let obj = Obj(x, y)
    obj.size.x = 64
    obj.size.y = 64
    obj.name = 'hoverbot'

    obj.collision = true
    obj.obstructs = true
    obj.color = "purple"
    obj.phase = null
    obj.sightRadius = 350
    obj.following = false
    obj.maxSpeed = 6
    obj.moves = true

    obj.onCollision = function (other) {
        if (other.player) {
            other.damage()
            this.destroy = true
        } else if (other.obstructs) {
            this.destroy = true
        } else if (other.projectile) {
            this.destroy = true
        }
        if (this.destroy) Explosion(this.pos.x, this.pos.y, 64, 64, 0.2)
    }

    // obj.draw = function () {
    //     // let pivot = Pivot(this.size.x / 2, this.size.y / 2, Math.PI / 4 + pulse)
    //     camera.Render(DrawObj(this))
    // }
    obj.update = function () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(400, 1, this.phase)

        if (this.pos.distance(Data.player.center()) < this.sightRadius) {
            this.following = true    
        }

        if (this.following) {
            let toPlayer = Pyre.Vector.lerpDifference(this.pos, Data.player.center(), 0.001)
            this.vel.add(toPlayer)
            if (this.vel.magnitude() > this.maxSpeed) {
                this.vel.normalize(this.maxSpeed)
            }
        } else {
            this.pos.y += pulse
        }
        
        this.pos.add(this.vel.clone().multiply(Game.timeScale))
    }

    obj.loadImage(obj.name, obj.size.x, obj.size.y)
    Data.objects.push(obj)
    Sound.loadSFX('explosion')
    return obj
}