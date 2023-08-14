Explosion = function (x, y, w, h, lifetime) {
    let obj = Obj(x, y)
    obj.size.set(w, h)
    obj.lifetime = lifetime * FPS
    obj.life = obj.lifetime
    
    obj.color = "orange"
    obj.image = 'explosion'

    // obj.draw = function () {
    //     camera.Render(Draw(this.pos.x, this.pos.y, 32, 32, 'white', Pivot(16, 16, 0), this.image), 2)
    // }

    obj.update = function () {
        if (this.life == this.lifetime) {
            Sound.playSFX('explosion')
        } else if (this.life == 0) {
            obj.image = 'explosionAfter'
        } else if (this.life < -this.lifetime) {
            this.destroy = true
        }

        this.life--
    }

    Sprites.loadSprite(obj.image)
    Sprites.loadSprite('explosionAfter')

    Sound.loadSFX('explosion')
    Data.objects.push(obj)
    return obj
}