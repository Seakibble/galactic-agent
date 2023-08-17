Transition = function (x, y, w, h, destination, fromRoom) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h
    obj.destination = destination
    obj.fromRoom = fromRoom
    obj.background = true

    obj.shootable = false
    obj.collision = true
    obj.color = "white"
    obj.image = "panel"
    obj.loadImage(obj.image)

    obj.onCollision = function (other) {
        if (other.player) game.start(this.destination, this.fromRoom)
    }

    Data.objects.push(obj)
    return obj
}