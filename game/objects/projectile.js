Projectile = function (x, y, w, h, vx, vy) {
    let obj = Obj(x-w/2, y-h/2)
    obj.size.set(w, h)
    obj.vel.set(vx, vy)

    obj.color = "red"
    obj.collision = true
    obj.shootable = false
    obj.moves = true
    obj.projectile = true
    obj.damage = 1
    obj.image = 'bullet'

    obj.draw = function () {
        // if (this.size.x == this.size.y) {
        //     camera.Render(DrawCircle(this.pos.x, this.pos.y, this.size.x, this.color))
        // } else {
        if (Data.debug) {
            camera.Render(Draw(this.pos.x,this.pos.y, this.size.x, this.size.y, this.color), 1)
        } else {
            camera.Render(Draw(this.pos.x, this.pos.y, 64, 64, 'white', Pivot(32, 32, this.vel.angle()), 'bullet'), 2)
        }
    }

    obj.onCollision = function (other) {
        if (other.shootable) {
            other.damage(this.damage)
            this.destroy = true
        }
    }

    Sprites.loadSprite('bullet')
    Data.objects.push(obj)
    return obj
}