function Screenwrap(obj) {
    if (obj.pos.x < -obj.size.x) obj.pos.x += CV.x + obj.size.x * 2
    else if (obj.pos.x > CV.x + obj.size.x) obj.pos.x -= (CV.x + obj.size.x * 2)
    if (obj.pos.y < -obj.size.y) obj.pos.y += CV.y + obj.size.y * 2
    else if (obj.pos.y > CV.y + obj.size.y) obj.pos.y -= (CV.y + obj.size.y * 2)
}


// Checks to see if a box is overlapping with another box, point by point
// NOT SYMETRICAL! This tells you if each corner of a is inside b, will fail if b is inside a!!!
// Call Collides(a,b) AND Collides (b, a) to be sure if there was a collision!
function Collides(a, b) {
    return (IsInside(new Pyre.Vector(a.pos.x, a.pos.y), b) // a top left is inside b?
        || IsInside(new Pyre.Vector(a.pos.x + a.size.x, a.pos.y), b) // a top right is inside b?
        || IsInside(new Pyre.Vector(a.pos.x + a.size.x, a.pos.y + a.size.y), b) // a bottom right is inside b?
        || IsInside(new Pyre.Vector(a.pos.x, a.pos.y + a.size.y), b) // a bottom left is inside b?
    ) 
}

/// Checks to see if a point is inside a box
function IsInside(a, b) {
    return (a.x > b.pos.x && a.x < b.pos.x + b.size.x // a is between box left and right
        && a.y > b.pos.y && a.y < b.pos.y + b.size.y) // a is between box top and bottom
}

function setMusicMenuText() {
    $toggleMusic.innerHTML = 'Toggle Music: ' + (Sound.musicEnabled() ? 'ON' : 'OFF')
}

function getTime(timer) {
    let sec = Math.floor(Data.timer / FPS)
    let min = Math.floor(sec / 60)
    sec = sec % 60
    if (min < 10) min = '0' + min
    if (sec < 10) sec = '0' + sec
    // if (mil < 10) mil = '00' + mil
    // if (mil < 100) mil = '0' + mil

    // $imer.innerHTML += `<span class=mil>:${mil}</span>`
    return [min, sec]
}

function setWorkman() {
    if (input.workman) input.workman = false
    else input.workman = true
    
    setWorkmanMenuText()
}
function setWorkmanMenuText() { 
    if (input.workman) $keyboardLayout.innerHTML = 'Keyboard: WORKMAN'
    else $keyboardLayout.innerHTML = 'Keyboard: QWERTY'
}

let x = 0
function drawRect(obj) {
    let cameraSpace = game.camera.CameraSpace(obj.pos)
    x = obj
    ctx.fillRect(cameraSpace.x, cameraSpace.y, obj.size.x, obj.size.y)
}


Box = function (x,y,w,h, color='red') {
    return {
        pos: new Pyre.Vector(x, y),
        size: new Pyre.Vector(w, h),
        color: color
    }
}

function LerpVec(a, b, t) {
    let newPos = b.Diff(a)
    newPos.Mult(t)
    return newPos
}

function Pulse(frequency = 1000, amplitude = 1, phase = 0) {
    return Math.sin((Game.now - Game.startTime) / frequency + phase) * amplitude
}

function ChooseRandom(array) {
    return array[Math.floor(Math.random()*array.length)]
}