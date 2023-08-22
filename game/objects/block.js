class Block extends Pyre.Object {
    constructor(x, y, w, h, type = 'block') {
        super(x, y, w, h)
        this.color = "#000"
        this.collision = true
        this.obstructs = true
        if (type !== null) this.loadImage(type)
    }
}