Platform = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "#111"
    obj.collision = true
    obj.obstructs = true
    
    Data.objects.push(obj)
    return obj
}