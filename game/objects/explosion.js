class Explosion extends Pyre.Object {
    constructor(x, y, w, h, lifetime) {
        super(x, y, w, h)
        this.lifetime = lifetime * FPS
        this.life = this.lifetime
        this.color = "orange"
        this.image = 'explosion'

        Sprites.loadSprite('explosion')
        Sprites.loadSprite('explosionAfter')

        Sound.loadSFX('explosion')
    }

    update() {
        if (this.life == this.lifetime) {
            Sound.playSFX('explosion')
        } else if (this.life == 0) {
            this.image = 'explosionAfter'
        } else if (this.life < -this.lifetime) {
            this.destroy = true
        }

        this.life--
    }
}