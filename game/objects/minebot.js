class MineBot extends Pyre.Object {
    constructor(x, y, w = GRID_SIZE, h = GRID_SIZE) {
        super(x, y, w, h)
        this.name = 'minebot'

        this.collision = true
        this.color = "purple"
        this.phase = null
        this.sightRadius = 350
        this.following = false
        this.maxSpeed = 15
        this.moves = true
        this.impactForce = 20

        this.loadImage('minebot', this.size.x, this.size.y)
        Sprites.loadSprite('minebotActive', this.size.x, this.size.y)

        Sound.loadSFX('explosion')
        Sound.loadSFX('minebotActivate')
    }

    onCollision (other) {
        if (other.player) {
            other.damage()
            let force = other.pos.difference(this.pos)
            force.normalize(this.impactForce)
            other.applyForce(force)
            this.destroy = true
        } else if (other.obstructs) {
            this.destroy = true
        } else if (other.projectile) {
            this.destroy = true
        }
        if (this.destroy) new Explosion(this.pos.x, this.pos.y, 64, 64, 0.2)
    }

    update () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(400, 1, this.phase)

        if (this.pos.distance(Data.player.center()) < this.sightRadius) {
            if (this.following == false) {
                Sound.playSFX('minebotActivate')
                this.image = 'minebotActive'
            }
            this.following = true
        }

        if (this.following) {
            let toPlayer = Data.player.center().difference(this.pos)
            this.vel.add(toPlayer.multiply(0.002))
            if (this.vel.magnitude() > this.maxSpeed) {
                this.vel.normalize(this.maxSpeed)
            }
        } else {
            this.pos.y += pulse
        }

        this.pos.add(this.vel.clone().multiply(Game.timeScale))
    }
}