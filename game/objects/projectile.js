class Projectile extends Pyre.Object {
    constructor(x, y, w, h, vx, vy) {
        super(x, y, w, h)
        this.size.set(w, h)
        this.vel.set(vx, vy)

        this.color = "red"
        this.collision = true
        this.shootable = false
        this.moves = true
        this.projectile = true
        this.damage = 1
        this.image = 'bullet'

        Sprites.loadSprite('bullet')
        Sound.loadSFX('bulletImpact')
    }

    draw () {
        if (Data.debug) {
            camera.Render(Draw(this.pos.x, this.pos.y, this.size.x, this.size.y, this.color), 1)
        } else {
            camera.Render(Draw(this.pos.x, this.pos.y, 64, 64, 'white', Pivot(32, 32, this.vel.angle()), 'bullet'), 2)
        }
    }

    onCollision (other) {
        if (other.shootable) {
            other.damage(this.damage)
            this.destroy = true

            new ExplosionBullet(this.pos.x - this.size.x, this.pos.y - this.size.y, 32, 32, 0.1)
        }
    }
}