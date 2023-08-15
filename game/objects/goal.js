Goal = function (x, y, w, h, type) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.interactable = true
    obj.interactText = 'EXIT'
    obj.color = "goldenrod"
    obj.goal = true

    obj.onInteract = function (other) {
        game.win()
    }

    if (type !== null) obj.loadImage(type)

    Data.objects.push(obj)
    return obj
}