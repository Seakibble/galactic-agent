class Pyre {
    static Vector = class {
        constructor(x = 0, y = 0) {
            this.x = x
            this.y = y
            this._cachedX = x
            this._cachedY = y
            this._cachedMagnitude = null
        }

        add(vec) {
            this.x += vec.x
            this.y += vec.y
            this._clearCachedMagnitude()
            return this
        }
        subtract(vec) {
            this.x -= vec.x
            this.y -= vec.y
            this._clearCachedMagnitude()
            return this
        }
        difference(vec) {
            return new Pyre.Vector(this.x - vec.x, this.y - vec.y)
        }
        set(x,y) {
            this.x = x
            this.y = y
            this._clearCachedMagnitude()
        }
        multiply(n) {
            this.x *= n
            this.y *= n
            this._clearCachedMagnitude()
            return this
        }
        magnitude() {
            if (this._cachedMagnitude === null || this.x !== this._cachedX || this.y !== this._cachedY) {
                this._cachedMagnitude = Math.sqrt(this.x * this.x + this.y * this.y)
                this._cachedX = this.x
                this._cachedY = this.y
            }
            return this._cachedMagnitude
        }
        distance(vec) {
            let diff = this.difference(vec)
            return diff.magnitude()
        }
        normalize(magnitude = 1) {
            let currentMagnitude = this.magnitude() 
            if (currentMagnitude !== 0) return this.multiply(magnitude / currentMagnitude)
            else return this
        }
        angle() {
            return Math.atan2(this.y,this.x)
        }
        clone() {
            return new Pyre.Vector(this.x, this.y)
        }
        lerp(b, t) {
            let diff = Pyre.Vector.lerpDifference(this, b, t)
            return this.add(diff)
        }
        _clearCachedMagnitude() {
            this._cachedMagnitude = null
        }

        static zero() { return new Pyre.Vector(0, 0) }
        static up() { return new Pyre.Vector(0,1) }
        static down() { return new Pyre.Vector(0, -1) }
        static left() { return new Pyre.Vector(-1, 0) }
        static right() { return new Pyre.Vector(1, 0) }
        
        static random(magnitude) {
            let angle = Math.random() * Math.PI * 2
            let heading = new Pyre.Vector(Math.cos(angle), Math.sin(angle))
            if (magnitude) heading.multiply(magnitude)
            return heading
        }
        static randomXY(x = 1, y = 1) {
            return new Pyre.Vector(Math.random()*x, Math.random()*y)
        }

        static _applyRounding(method) {
            this.x = method(this.x)
            this.y = method(this.y)
            this._clearCachedMagnitude()
            return this
        }
        static round() {
            return this._applyRounding(Math.round)
        }
        static floor() {
            return this._applyRounding(Math.floor)
        }
        static ceil() {
            return this._applyRounding(Math.ceil)
        }

        static average(array) {
            if (!Array.isArray(array)) throw new Error("Invalid input: not an array.")
            if (array.length == 0) throw new Error("Invalid input: array is empty.")
            
            let average = new Pyre.Vector()
            for (let i = 0; i < array.length; i++) {
                average.x += array[i].x
                average.y += array[i].y
            }
            return average.multiply(array.length)
        }
        
        static lerpDifference(a, b, t) {
            let diff = b.clone().difference(a)
            return diff.multiply(t)
        }
    }



    static Audio = class {
        constructor() {
            this.volume = {
                master: 1,
                music: 1,
                sfx: 1,
                voice: 1,
                bulletTime: 0
            }
            this.musicName = null
            this.music = null
            this.bulletTime = null
            this._enableMusic = true
            this._pauseFade = false
            this._pauseFadeValue = 0.35
            this.sfx = {}
        }
        pauseFade(enabled = null) {
            if (enabled === null) enabled = !this._pauseFade
            this._pauseFade = enabled
            this._updateMusicVolume()
            this._updateSFXVolume()
            this._updateBulletTimeVolume()
        }
        stopMusic() {
            this.music.fade(this._calculateVolume('music'), 0, 100)
            this.music.once('fade', () => {
                this.music.stop()
                this.music.volume(this._calculateVolume('music'))
            })
        }
        startMusic() {
            if (this.music && !this.music.playing() && this._enableMusic) this.music.play()
        }
        playSFXNoSpam(name) {
            if (!this.sfx[name].playing()) this.sfx[name].play()
        }
        playSFX(name) {
            this.sfx[name].play()
        }
        setSFXVolume(volume) {
            this.volume.sfx = volume
            this._updateSFXVolume()
        }
        _updateSFXVolume() {
            for (let name in this.sfx) {
                this.sfx[name].volume(this._calculateVolume('sfx'))
            }
        }
        _updateMusicVolume() {
            if (this.music) this.music.volume(this._calculateVolume('music'))
        }
        _updateBulletTimeVolume() {
            if (this.bulletTime) this.bulletTime.volume(this._calculateVolume('bulletTime'))
        }
        setMasterVolume(volume) {
            this.volume.master = volume
            this._updateMusicVolume()
            this._updateSFXVolume()
            this._updateBulletTimeVolume()
        }
        setMusicVolume(volume) {
            this.volume.music = volume
            this._updateMusicVolume()
        }
        setBulletTimeVolume(volume) {
            this.volume.bulletTime = volume
            this._updateBulletTimeVolume()
            this._updateMusicVolume()
        }
        enableMusic(b = true) {
            this._enableMusic = b
            if (this.music) {
                if (this._enableMusic) {
                    if (!this.music.playing()) this.music.play()
                } else this.music.stop() 

            }
        }
        musicEnabled() {
            return this._enableMusic
        }
        loadMusic(src, autoplay = true) {
            if (!this.music || !this.music.playing()) {
                // just go
                this._loadTrack(src, autoplay)
            } else if (this.music && this.musicName != src) {
                // fade 
                
                this.music.fade(this._calculateVolume('music'), 0, 4000)
                // console.log('playing:', this.music.playing())
                this.music.once('fade', () => {
                    this._loadTrack(src, autoplay)
                })
            }
        }
        loadBulletTime(src) {
            if (this.bulletTime) this.bulletTime.stop()
            this.bulletTime = new Howl({
                src: ['game/audio/music/' + src + '.mp3'],
                loop: true,
                volume: this._calculateVolume('bulletTime'),
                html5: true,
                autoplay: true
            })
        }
        _loadTrack(src, autoplay = false) {
            if (this.music) this.music.stop()
            this.music = new Howl({
                src: ['game/audio/music/' + src + '.mp3'],
                loop: true,
                volume: this._calculateVolume('music'),
                html5: true,
                autoplay: autoplay
            })
            this.musicName = src
        }
        loadSFXArray(list) {
            list.forEach(sfx => {
                this.loadSFX(sfx)
            })
        }
        loadSFX(src, name = src, loop = false) {
            if (this.sfx[name]) return
            this.sfx[name] = new Howl({
                src: ['game/audio/sfx/' + src + '.mp3'],
                volume: this._calculateVolume('sfx'),
                loop: loop
            })
        }
        _calculateVolume(type) {
            let volume = this.volume.master * this.volume[type] * (this._pauseFade ? this._pauseFadeValue : 1)
            if (type === 'music') volume *= (1-this.volume.bulletTime)
            return volume
        }
    }

    static Level = class {
        constructor() {
            this.map = []
            this.name = null
            this.player = null
            this.music = null
            this.gridX = null
            this.gridY = null
            this.gridWall = 1000
            this.path = 'game/levels/'
        }
        loadLevel(src) {
            return new Promise((resolve, reject) => { 
                fetch(this.path + src + '.csv')
                    .then((response) => response.text())
                    .then((data) => {
                        this.map = []
                        this.player = null
                        this.gridX = null
                        this.gridY = null
                        let rows = data.split("\n")
                        rows.forEach(row => {
                            row = row.split(',')
                            this.map.push(row)
                            
                        })
                        this.id = this.map[0][1]
                        this.name = this.map[1][1]
                        this.music = this.map[2][1]
                        this.upgrades = this.map[3][1].split('')

                        
                        Sound.loadMusic(this.music,false)
                        
                        
                        this.map.forEach(row => {
                            row.shift()
                            row.shift()
                            let char = row[row.length-1]
                            if (char) char = char.split('\r')[0]
                            // console.log(char, char === 'p')
                            row[row.length - 1] = char
                        })

                        // console.log(this.map.length, this.map[0].length)
                        this.gridX = this.map[0].length
                        this.gridY = this.map.length

                        this._generateLevel()
                        resolve(true)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
        _generateLevel() {
            Platform(-this.gridWall, this.gridY * GRID_SIZE, this.gridX * GRID_SIZE + this.gridWall * 2, this.gridWall, null)// bottom
            Platform(-this.gridWall, -this.gridWall, this.gridX * GRID_SIZE + this.gridWall * 2, this.gridWall, null) // top

            Platform(-this.gridWall, -this.gridWall, this.gridWall, this.gridY * GRID_SIZE + this.gridWall * 2, null) // left
            Platform(this.gridX * GRID_SIZE, -this.gridWall, this.gridWall, this.gridY * GRID_SIZE + this.gridWall * 2, null) // right

            for (let i = 0; i < this.gridX; i++) {
                for (let j = 0; j < this.gridY; j++) {
                    let tile = null
                    switch (this.map[j][i]) {
                        case 'p':
                            if (!this.player) this.player = Player(i * GRID_SIZE + 10, j * GRID_SIZE)
                            else this.player.pos = new Pyre.Vector(i * GRID_SIZE + 10, j * GRID_SIZE)
                            this.upgrades.forEach((char) => {
                                let upgrade = 'none'
                                switch (char) {
                                    case 'D': upgrade = 'dash'; break
                                    case 'W': upgrade = 'wallClimb'; break
                                    case 'G': upgrade = 'gun'; break
                                    case 'B': upgrade = 'bulletTime'; break
                                }
                                this.player.upgrades[upgrade] = true
                            })
                            break
                        case 'g': tile = Goal(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE, 'door')
                            break
                        case '#': tile = Platform(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE)
                            break
                        case '|': tile = GlassPane(i * GRID_SIZE + (GRID_SIZE-10)/2, j * GRID_SIZE, 10, GRID_SIZE)
                            break
                        case '-': tile = GlassPane(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, 10)
                            break
                        case '^': tile = DamageBox(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE)
                            break
                        case 'D': tile = Upgrade(i * GRID_SIZE, j * GRID_SIZE, 'dash')
                            break
                        case 'W': tile = Upgrade(i * GRID_SIZE, j * GRID_SIZE, 'wallClimb')
                            break
                        case 'G': tile = Upgrade(i * GRID_SIZE, j * GRID_SIZE, 'gun')
                            break
                        case 'M': tile = MineBot(i * GRID_SIZE, j * GRID_SIZE)
                            break
                        case 'c': // Deprecated
                        case 'o': tile = Orb(i * GRID_SIZE + GRID_SIZE / 2, j * GRID_SIZE + GRID_SIZE / 2)
                            break
                    }
                    this.map[j][i] = tile
                }
            }


            // Link glass panes
            for (let i = 0; i < this.gridX; i++) {
                for (let j = 0; j < this.gridY; j++) {
                    let tile = this.map[j][i]
                    if (tile && tile.glassPane) {
                        tile.adjacent = []
                        if (this.map[j] && this.map[j][i-1] && this.map[j][i-1].glassPane) {
                            tile.adjacent.push(this.map[j][i-1])
                        }
                        if (this.map[j] && this.map[j][i + 1] && this.map[j][i + 1].glassPane) {
                            tile.adjacent.push(this.map[j][i + 1])
                        }
                        if (this.map[j-1] && this.map[j-1][i] && this.map[j-1][i].glassPane) {
                            tile.adjacent.push(this.map[j-1][i])
                        }
                        if (this.map[j + 1] && this.map[j + 1][i] && this.map[j+1][i].glassPane) {
                            tile.adjacent.push(this.map[j + 1][i])
                        }
                    }
                }
            }
            

        }
    }

    static GameData = class {
        constructor() {
            this.player = null
            this.objects = []
            this.collisions = []
            this.debug = false

            this.timer = 0
            this.winStreak = 0
            this.orbsBanked = 0
            this.orbsThisLevel = 0
            
        }
    }
    
    static SpriteManager = class {
        constructor() {
            this.sprites = {}
        }
        loadSprite(src,w = 64, h = 64) {
            if (this.sprites[src] === undefined) {
                let sprite = new Image(w, h)
                sprite.src = 'game/sprites/' + src + '.png'
                this.sprites[src] = sprite
            }            
        }
    }


    static GameLoop = class {
        constructor() {
            this.startTime = Date.now()
            this.now = null
            this.elapsed = null
            this.fpsInterval = null

            this.timeScale = 1

            this.running = false
            this.previousTimestamp = 0
            this.updateCallback = null
            this.drawCallback = null
        }

        start() {
            this.running = true
            this.fpsInterval = 1000 / FPS
            this.then = Date.now()
            requestAnimationFrame(this.loop.bind(this))
        }
        stop() {
            this.running = false
        }

        setTimeScale(newTimeScale) {
            if (this.timeScale !== newTimeScale) {
                this.timeScale += (newTimeScale - this.timeScale) * TIMESCALE_LERP_FACTOR
            }
        }

        setUpdateCallback(callback) {
            this.updateCallback = callback
        }
        setDrawCallback(callback) {
            this.drawCallback = callback
        }

        loop(timestamp) {
            if (!this.running) return

            if (this.previousTimestamp === 0) {
                this.previousTimestamp = timestamp
            }

            const deltaTime = (timestamp - this.previousTimestamp) / 1000

            if (this.updateCallback) {
                this.updateCallback()
            }
            if (this.drawCallback) {
                this.drawCallback()
            }

            this.previousTimestamp = timestamp
            requestAnimationFrame(this.loop.bind(this))
        }
    }
}