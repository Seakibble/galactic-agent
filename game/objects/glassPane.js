class GlassPane extends Pyre.Object {
    constructor(x, y, w, h) {
        super(x, y, w, h)
        this.glassPane = true
        this.color = "rgba(200,200,255,0.3)"
        this.brokenColor = "rgba(50,50,100,0.3)"
        this.collision = true
        this.obstructs = true
        this.breakable = true
        this.broken = false
        this.breakingThreshhold = 15
        this.health = 1

        Sound.loadSFX('glassBreak')
    }

    onCollision(other, velocity) {
        if (velocity >= this.breakingThreshhold) {
            this.break()
        }
    }

    break(silent = false) {
        if (!this.broken) {
            this.broken = true
            // audio.glassBreak.play()
            if (!silent) Sound.playSFX('glassBreak')
            this.collision = false
            this.obstructs = false
            this.color = this.brokenColor

            if (this.adjacent) {
                this.adjacent.forEach(pane => {
                    pane.break(true)
                })
            }
        }
    }
}