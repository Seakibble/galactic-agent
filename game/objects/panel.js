class Panel extends Pyre.Object {
    constructor(x, y, w = GRID_SIZE, h = GRID_SIZE, type = 'panel2') {
        super(x, y, w, h)
        this.background = true
        this.color = '#222'
        if (type !== null) this.loadImage(type)
    }
}