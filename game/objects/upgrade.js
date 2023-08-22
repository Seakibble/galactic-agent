class Upgrade extends Pyre.Object {
    constructor(x, y, type = 'dash') {
        super(x, y, 50, 50)
        this.type = type
        this.collision = true
        this.color = "cyan"
        this.collectable = true
        this.phase = null

        Sound.loadSFX('upgrade')
    }
    onCollision (other) {
        if (other.player) {
            Sound.playSFX('upgrade')
            other.upgrades[this.type] = true
            this.destroy = true
        }
    }
    draw () {
        if (this.phase == null) this.phase = Math.random() * 2 * Math.PI
        let pulse = Pulse(3000, 5, this.phase)
        let pivot = Pivot(this.size.x / 2, this.size.y / 2, Math.PI / 4 + pulse)
        camera.Render(Draw(this.pos.x, this.pos.y, this.size.x, this.size.y, this.color, pivot))
        camera.Render(DrawText(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2 + 7, this.type, 'black', 'center', '14px PressStart2P'), 1)
    }
}