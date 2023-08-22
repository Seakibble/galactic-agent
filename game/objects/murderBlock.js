// DamageBox = function (x, y, w, h, damage = 1, type = 'murderBlock') {
//     let obj = Obj(x, y)
//     obj.size.x = w
//     obj.size.y = h
//     obj.color = "darkred"

//     obj.contactDamage = damage

//     obj.collision = true

//     obj.onCollision = function (other) {
//         if (other.player) other.damage(this.contactDamage)
//     }
    
//     if (type !== null) obj.loadImage(type)

//     Data.objects.push(obj)
//     return obj
// }

class MurderBlock extends Pyre.Object {
    constructor(x, y, w, h, damage = 1, type = 'murderBlock') {
        super(x, y, w, h)
        this.color = "darkred"
        this.contactDamage = damage
        this.collision = true
        if (type !== null) this.loadImage(type)
    }
    
    onCollision (other) {
        if (other.player) other.damage(this.contactDamage)
    }
}