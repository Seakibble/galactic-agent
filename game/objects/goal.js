Goal = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.interactable = true
    obj.interactText = 'Exit'
    obj.color = "goldenrod"
    obj.goal = true

    obj.onInteract = function (other) {
        game.win()
    }

    Data.objects.push(obj)
    return obj
}