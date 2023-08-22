class ExplosionBullet extends Pyre.Object {
    constructor(x, y, w, h, lifetime) {
        super(x, y, w, h)
        this.lifetime = lifetime * FPS
        this.life = this.lifetime
        this.color = "yellow"
        this.image = 'explosionBullet'

        Sprites.loadSprite('explosionBullet')
        Sprites.loadSprite('explosionBulletAfter')
        Sound.loadSFX('bulletImpact')
    }

    draw () {
        camera.Render(Draw(this.pos.x - 16, this.pos.y - 16, 32, 32, 'white', Pivot(), this.image), 2)
    }

    update() {
        if (this.life == this.lifetime) {
            Sound.playSFX('bulletImpact')
        } else if (this.life == 0) {
            this.image = 'explosionBulletAfter'
        } else if (this.life < -this.lifetime) {
            this.destroy = true
        }

        this.life--
    }
}