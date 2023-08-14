ExplosionBullet = function (x, y, w, h, lifetime) {
    let obj = Obj(x, y)
    obj.size.set(w, h)
    obj.lifetime = lifetime * FPS
    obj.life = obj.lifetime
    
    obj.color = "yellow"
    obj.image = 'explosionBullet'

    obj.draw = function () {
        camera.Render(Draw(this.pos.x-16, this.pos.y-16, 32, 32, 'white', Pivot(), this.image), 2)
    }

    obj.update = function () {
        if (this.life == this.lifetime) {
            Sound.playSFX('bulletImpact')
        } else if (this.life == 0) {
            obj.image = 'explosionBulletAfter'
        } else if (this.life < -this.lifetime) {
            this.destroy = true
        }

        this.life--
    }

    Sprites.loadSprite(obj.image)
    Sprites.loadSprite('explosionBulletAfter')
    Sound.loadSFX('bulletImpact')
    Data.objects.push(obj)
    return obj
}