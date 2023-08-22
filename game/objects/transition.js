class Transition extends Pyre.Object {
    constructor(x, y, w, h, destination, fromRoom) {
        super(x, y, w, h)
        this.destination = destination
        this.fromRoom = fromRoom
        this.background = true
        this.shootable = false
        this.collision = true
        this.color = "white"
        this.image = "panel"
        this.loadImage(this.image)
    }

    onCollision = function (other) {
        if (other.player) game.start(this.destination, this.fromRoom)
    }
}