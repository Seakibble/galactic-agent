Camera = function () {
    return {
        pos: new Pyre.Vector(0,0),
        tracking: null,
        targetPos: new Pyre.Vector(0,0),
        renderList: [],
        Track: function (obj) {
            this.tracking = obj
            this.pos.x = obj.pos.x
            this.pos.y = obj.pos.y
        },
        Update: function () {
            if (this.tracking) {
                this.targetPos = new Pyre.Vector(this.tracking.pos.x, this.tracking.pos.y)
                let left = false
                let right = false
                let up = false
                let down = false

                if (this.targetPos.x < center.x - CAMERA_BOUNDARY) left = true
                if (this.targetPos.x > Level.gridX * GRID_SIZE - center.x + CAMERA_BOUNDARY) right = true
                if (this.targetPos.y < center.y - CAMERA_BOUNDARY) up = true
                if (this.targetPos.y > Level.gridY * GRID_SIZE - center.y + CAMERA_BOUNDARY) down = true

                if (CV.x > Level.gridX * GRID_SIZE + CAMERA_BOUNDARY * 2) {
                    this.pos.x = Level.gridX * GRID_SIZE / 2
                    this.targetPos.x = Level.gridX * GRID_SIZE / 2
                } else if (isLeft(this.targetPos)) {
                    this.targetPos.x = center.x - CAMERA_BOUNDARY
                    if (isLeft(this.pos)) this.pos.x = center.x - CAMERA_BOUNDARY
                } else if (isRight(this.targetPos)) {
                    this.targetPos.x = Level.gridX * GRID_SIZE - center.x + CAMERA_BOUNDARY
                    if (isRight(this.pos)) this.pos.x = Level.gridX * GRID_SIZE - center.x + CAMERA_BOUNDARY
                }

                if (CV.y > Level.gridY * GRID_SIZE + CAMERA_BOUNDARY * 2) {
                    this.pos.y = Level.gridY * GRID_SIZE / 2
                    this.targetPos.y = Level.gridY * GRID_SIZE / 2
                } else if (isUp(this.targetPos)) {
                    this.targetPos.y = center.y - CAMERA_BOUNDARY
                    if (isUp(this.pos)) this.pos.y = center.y - CAMERA_BOUNDARY
                } else if (isDown(this.targetPos)) {
                    this.targetPos.y = Level.gridY * GRID_SIZE - center.y + CAMERA_BOUNDARY
                    if (isDown(this.pos)) this.pos.y = Level.gridY * GRID_SIZE - center.y + CAMERA_BOUNDARY
                }
 
                this.pos.lerp(this.targetPos, CAMERA_LAG)
            }
        },
        DrawToScreen: function () {
            // console.log(this.renderList)
            if (Data.debug) this.Render(Draw(this.targetPos.x, this.targetPos.y, 5, 5, 'red'))
            this.renderList.reverse()
            this.renderList.sort((a, b) => (b.priority - a.priority))
            // console.log(this.renderList)
            // alert()
            this.DrawToScreenArray(this.renderList)
            this.renderList = []
        },
        DrawToScreenArray: function (list) {
            let zoom = game.zoom
            for (let i = 0; i < list.length; i++) {
                let target = list[i]

                ctx.translate(target.x / zoom, target.y / zoom) // target offset
                ctx.translate(center.x, center.y) // center offset
                ctx.translate(-this.pos.x / zoom, -this.pos.y / zoom) // tracking offset

                if (target.image) {
                    // ctx.translate(target.pivot.x, target.pivot.y)
                    ctx.rotate(target.pivot.r)
                    if (Sprites.sprites[target.image]) {
                        ctx.drawImage(Sprites.sprites[target.image], -target.pivot.x / zoom, -target.pivot.y / zoom, target.w / zoom, target.h / zoom)
                    }
                } else if (target.line) {
                    // line
                    ctx.strokeStyle = target.color;
                    ctx.beginPath()
                    ctx.moveTo(target.x1 / zoom, target.y1 / zoom)
                    ctx.lineTo(target.x2 / zoom, target.y2 / zoom)
                    
                    ctx.stroke()
                } else {
                    ctx.translate(target.pivot.x / zoom, target.pivot.y / zoom)
                    ctx.rotate(target.pivot.r)

                    if (target.text !== undefined) {
                        ctx.font = target.font
                        ctx.fillStyle = target.styles
                        ctx.textAlign = target.align
                        ctx.fillText(target.text, -target.pivot.x / zoom, -target.pivot.y / zoom)
                    } else {
                        ctx.fillStyle = target.color
                        ctx.fillRect(-target.pivot.x / zoom, -target.pivot.y / zoom, target.w / zoom, target.h / zoom)
                    }
                }
                ctx.resetTransform()
            } 
        },
        Render: function (drawThis, priority = 5) {
            drawThis.priority = priority
            this.renderList.push(drawThis)
        },
        RenderObj: function (drawThis, priority = null) {
            let obj = DrawObj(drawThis)
            if (priority == null) {
                if (drawThis.background) priority = 10
                else priority = 5
            }
            obj.priority = priority
            this.renderList.push(obj)
        }, 
        CameraSpace: function (vec) {
            let newVec = new Pyre.Vector(vec.x, vec.y)
            let otherVec = new Pyre.Vector(this.pos.x + CV.x / 2, this.pos.y + CV.y / 2)
            newVec.subtract(otherVec)

            return newVec
        }
    }
}

function getWorldSpace(target) {
    let dest = new Pyre.Vector(target.x, target.y)
    dest.subtract(center)
    dest.add(camera.pos)
    return dest
}

// Position (x,y), Rotation in radians
Pivot = function (x = 0, y = 0, r = 0) {
    return {
        x: x,
        y: y,
        r: r
    }
}
DrawLine = function (x1, y1, x2, y2, color = 'white') {
    return {
        line: true,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        color: color
    }
}

Draw = function (x,y,w,h,color = 'white', pivot = Pivot(), image = null) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        color: color,
        pivot: pivot,
        image: image
    }
}
DrawCircle = function (x, y, r, color = 'white') {
    return {
        x: x,
        y: y,
        r: r,
        color: color
    }
}
DrawObjVec = function (pos, size, color, pivot = Pivot()) {
    return {
        x: pos.x,
        y: pos.y,
        w: size.x,
        h: size.y,
        color: color,
        pivot: pivot
    }
}
DrawObj = function (obj, pivot = Pivot()) {
    return {
        x: obj.pos.x,
        y: obj.pos.y,
        w: obj.size.x,
        h: obj.size.y,
        color: obj.color,
        pivot: pivot,
        image: obj.image
    }
}

DrawText = function (x, y, text, styles = 'black', align = 'left', font = '28px PressStart2P', pivot = Pivot()) {
    return {
        x: x,
        y: y,
        font: font,
        styles: styles,
        align: align,
        text: text,
        pivot: pivot
    }
}

function isLeft(pos) {
    return (pos.x < center.x - CAMERA_BOUNDARY)
}
function isRight(pos) {
    return (pos.x > Level.gridX * GRID_SIZE - center.x + CAMERA_BOUNDARY)
}
function isUp(pos) {
    return (pos.y < center.y - CAMERA_BOUNDARY)
}
function isDown(pos) {
    return (pos.y > Level.gridY * GRID_SIZE - center.y + CAMERA_BOUNDARY)
}