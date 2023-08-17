Platform = function (x, y, w, h, type = 'block') {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "#000"
    obj.collision = true
    obj.obstructs = true
    
    if (type !== null) obj.loadImage(type)

    Data.objects.push(obj)
    return obj
}