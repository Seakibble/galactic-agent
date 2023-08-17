Transition = function (x, y, w, h, destination, fromRoom) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h
    obj.destination = destination
    obj.fromRoom = fromRoom

    obj.collision = true
    obj.color = "white"

    obj.onCollision = function (other) {
        if (other.player) game.start(this.destination, this.fromRoom)
    }

    Data.objects.push(obj)
    return obj
}