let ctx = canvas.getContext('2d');
const CV = new Pyre.Vector()
let center = null
const Sound = new Pyre.Audio()
const Level = new Pyre.Level()
const Data = new Pyre.GameData()
const Game = new Pyre.GameLoop()
const Sprites = new Pyre.SpriteManager()

let input = Input()
let camera = Camera()

let game = {
    options: {
        music: true
    },
    zoom: 1,
    fpsInterval: null,
    then: null,
    elapsed: null,    
    objectives: [
        "Get to the EXIT"
    ],
    objectiveTimeouts: [],
    paused: true,
    screen: Screens(),
    initialized: false,
    over: false,
    world: 1,
    levelColor: 'hsl(210,35%, 40%)',


    displayObjectives: function () {
        $objectives.innerHTML = ''
        for (let i = 0; i < this.objectiveTimeouts.length; i++) {
            clearTimeout(this.objectiveTimeouts[i])
        }
        for (let i = 0; i < this.objectives.length; i++) {
            $objectives.innerHTML += `<div id="objective-${i}" class="box ${i == 0 ? 'primary' : ''}">${this.objectives[i]}</div>`
            this.objectiveTimeouts.push(setTimeout(() => {
                document.getElementById('objective-' + i).classList.add('objective')
            }, 400 * i + 1000))
        }
    },
    draw: function () {
        // ctx.fillStyle = this.levelColor
        // ctx.fillStyle = '#555'
        // ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        if (Sprites.sprites['stars']) ctx.drawImage(Sprites.sprites['stars'], 0,0, 1920, 1080)
        // let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        for (let i = 0; i < Data.objects.length; i++) {
            Data.objects[i].draw()
        }

        if (Data.debug) {
            camera.Render(Draw(0,0,10,10,'red'),1)
        }


        camera.DrawToScreen()

        // let time = getTime(Data.timer)
        // $timer.innerHTML = `<span>${time[0]}</span>:<span>${time[1]}</span>`
    },
    resize: function () {
        if ($container.offsetHeight / this.zoom < 1 || $container.offsetWidth / this.zoom < 1) {
            console.log('Too small!', zoom)
            return
        }
        CV.x = $container.offsetWidth // / this.zoom
        CV.y = $container.offsetHeight // / this.zoom
        $canvas.width = CV.x
        $canvas.height = CV.y
        center = new Pyre.Vector($canvas.width / 2, $canvas.height / 2);

        this.draw()
    },
    saveSettings: function () {
        localStorage.setItem('workman', input.workman)
        localStorage.setItem('musicEnabled', Sound.musicEnabled())
    },
    loadSettings: function () {
        let workman = localStorage.getItem('workman')
        input.workman = (workman === 'true')
        let musicEnabled = localStorage.getItem('musicEnabled')
        Sound.enableMusic(musicEnabled === 'true')
        
        setMusicMenuText()
        setWorkmanMenuText()
    },    
    init: function () {
        this.resize()
        this.screen.init()
        // loadAudio()

        window.addEventListener('resize', () => game.resize())
        Sprites.loadSprite('stars', 1920, 1080)
        this.openingText()
        
    },
    openingText() {
        Sound.loadMusic('07-a-threat-to-galactic-peace', true)
        if (!Sound.musicEnabled()) Sound.music.stop()

        $titles.classList.add('hide')
        let timing = 2000

        $openingText.style.display = 'grid'

        for (let i = 0; i < $openingSlides.length; i++) {
            timing += 2500  
            setTimeout(() => { $openingSlides[i].classList.remove('hide') }, timing)
            timing += 5500
            setTimeout(() => { $openingSlides[i].classList.add('hide') }, timing)
        }
        
        timing += 5000
        setTimeout(() => { this.start() }, timing)
    },
    start: function () {
        fadeToBlack(true, () => {
            this.world = Math.floor(Data.winStreak / LEVELS_PER_WORLD) + 1
            this.levelColor = 'hsl(' + ((this.world - 1) * 55 + 210) % 360 + ',35%, 40%)'
            $levelStart.classList.remove('start')
            Data.objects = []
            this.over = false
            Data.timer = 0
            Data.orbsThisLevel = 0
            $orbTotal.textContent = Data.orbsThisLevel + Data.orbsBanked

            let levelToLoad = Data.winStreak + 1
            if (levelToLoad > 3) levelToLoad = 'win'
            Level.loadLevel('level-' + levelToLoad)
                .then((player) => {
                    Data.player = Level.player
                    camera.Track(Data.player)

                    // $levelStart.innerHTML = 'LEVEL ' + this.world + '-' + ((this.winStreak % LEVELS_PER_WORLD) + 1)
                    $levelStart.innerHTML = Level.name
                    setTimeout(() => { $levelStart.classList.add('start') }, 500)
                    this.displayObjectives()

                    // this.startAnimating()
                    // this.initialized = true
                    this.pause(false)
                    Game.start()
                })
        })
        
        
    },
    tick: function () {

        // request another frame
        // requestAnimationFrame(() => game.tick())

        // calc elapsed time since last loop
        this.now = Date.now();
        this.elapsed = this.now - this.then;

        if (game.paused) {
            input.menuInput()
            return
        }

        // if enough time has elapsed, draw the next frame
        if (this.elapsed > this.fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = this.now - (this.elapsed % this.fpsInterval);

            game.onFrame()
            game.cleanUp()
        }
    },
    onFrame: function () {
        Data.timer++
        input.gameInput()

        for (let i = 0; i < Data.objects.length; i++) Data.objects[i].update()
        for (let i = 0; i < Data.objects.length; i++) Data.objects[i].checkCollision()
        
        for (let i = 0; i < Data.collisions.length; i++) {
            Data.collisions[i][0].onCollision(Data.collisions[i][1])
        }
        Data.collisions = []
        
        Data.player.checkInteract()
        
        camera.Update()
        // this.draw()
    },
    cleanUp: function () {
        for (let i = Data.objects.length - 1; i >= 0; i--) {
            if (Data.objects[i].destroy) {
                Data.objects[i].onDestroy()
                Data.objects.splice(i, 1)
            }
        }
    },
    startAnimating: function () {
        this.fpsInterval = 1000 / FPS
        this.then = Date.now()
        this.tick()
    },
    pause: function (setPaused = null) {
        if (setPaused !== null) this.paused = !setPaused
            
        if (!this.over) {
            this.paused = !this.paused
            if (this.paused) this.screen.set('pause')
            else this.screen.set('')
        } else {
            if (!this.paused) this.paused = true
        }
    },
    win: function () {
        this.over = true
        this.pause()
        Data.winStreak++
        Data.orbsBanked += Data.orbsThisLevel
        this.screen.getStats()
        this.screen.set('win')
    },
    dead: function () {
        this.over = true
        Data.player.destroy = true
        // this.pause()
        Data.winStreak = 0
        Data.orbsBanked = 0
        this.screen.set('dead')
    }
}


Game.setUpdateCallback(game.tick)
Game.setDrawCallback(game.draw)

// Initial code when page loads
redirectToHttps()
cleanLinks()
game.loadSettings()

let gameFont = new FontFace('PressStart2P', 'url(PressStart2P-Regular.ttf)')
gameFont.load().then((font) => document.fonts.add(font))

Sound.loadSFXArray(['btnHover', 'btnClick'])

Sound.loadMusic('06-a-galaxy-to-protect', true)
if (!Sound.musicEnabled()) Sound.music.stop()

$content.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON' || e.target.classList.contains('button')) Sound.playSFX('btnClick')
})
$content.addEventListener('mouseover', (e) => {
    if (e.target.nodeName === 'BUTTON' || e.target.classList.contains('button')) Sound.playSFX('btnHover')
})

$start.addEventListener('click', () => { 
    game.init()
})