Panel = function (x, y, w = GRID_SIZE, h = GRID_SIZE, type = 'panel2') {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h
    obj.background = true

    obj.color = "#222"
    
    if (type !== null) obj.loadImage(type)

    Data.objects.push(obj)
    return obj
}