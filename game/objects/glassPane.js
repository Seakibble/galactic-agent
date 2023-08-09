GlassPane = function (x, y, w, h) {
    let obj = Obj(x, y)
    obj.size.x = w
    obj.size.y = h

    obj.color = "rgba(200,200,255,0.3)"
    obj.brokenColor = "rgba(50,50,100,0.3)"
    obj.collision = true
    obj.obstructs = true
    obj.breakable = true
    obj.broken = false
    obj.breakingThreshhold = 15
    obj.health = 1
    
    obj.onCollision = function (other, velocity) {
        if (velocity >= this.breakingThreshhold) {
            this.break()
        }
    }

    obj.break = function () {
        this.broken = true
        // audio.glassBreak.play()
        Sound.playSFX('glassBreak')
        obj.collision = false
        obj.obstructs = false
        this.color = this.brokenColor
    }
    
    Sound.loadSFX('glassBreak')
    Data.objects.push(obj)
    return obj
}