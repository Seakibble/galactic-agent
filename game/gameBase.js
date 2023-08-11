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
        "Get to the OBJECTIVE",
        "Press ESC to pause",
        "A/D or arrow keys to move",
        "Spacebar to jump",
        "Shift to dash",
        "LMB to shoot gun",
        "E to interact"
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
        ctx.fillStyle = '#a44'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        // let style = "hsl(0,0%, " + pulse + "%)";
        // ctx.textAlign = "center";

        for (let i = 0; i < Data.objects.length; i++) {
            Data.objects[i].draw()
        }

        // Reticule
        let cursor = getWorldSpace(input.mouse)
        let retThickness = 2
        let retLength = 12
        let retOffset = 8
        
        camera.Render(Draw(cursor.x + retOffset - 1, cursor.y - 1, retLength + 2, retThickness + 2, 'white'), 2)
        camera.Render(Draw(cursor.x + retOffset, cursor.y, retLength, retThickness, 'black'), 1)

        camera.Render(Draw(cursor.x - retOffset - retLength - 1, cursor.y -1, retLength +2, retThickness +2, 'white'), 2)
        camera.Render(Draw(cursor.x - retOffset - retLength, cursor.y, retLength, retThickness, 'black'), 1)
        
        camera.Render(Draw(cursor.x-1, cursor.y + retOffset-1, retThickness+2, retLength+2, 'white'), 2)
        camera.Render(Draw(cursor.x, cursor.y + retOffset, retThickness, retLength, 'black'), 1)

        camera.Render(Draw(cursor.x-1, cursor.y - retOffset - retLength-1, retThickness+2, retLength+2, 'white'), 2)
        camera.Render(Draw(cursor.x, cursor.y - retOffset - retLength, retThickness, retLength, 'black'), 1)

        if (Data.debug) {
            camera.Render(Draw(0,0,10,10,'red'))
        }
        camera.DrawToScreen()

        let time = getTime(Data.timer)
        $timer.innerHTML = `<span>${time[0]}</span>:<span>${time[1]}</span>`
    },
    resize: function () {
        if ($container.offsetHeight / this.zoom < 1 || $container.offsetWidth / this.zoom < 1) {
            console.log('Too small!', zoom)
            return
        }
        CV.x = $container.offsetWidth / this.zoom
        CV.y = $container.offsetHeight / this.zoom
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
        this.loadSettings()
        this.resize()
        this.screen.set('')
        this.screen.init()
        // loadAudio()

        window.addEventListener('resize', () => game.resize())
        this.start()
    },
    start: function () {
        this.world = Math.floor(Data.winStreak / LEVELS_PER_WORLD)+1
        this.levelColor = 'hsl(' + ((this.world-1) * 55 + 210)%360 + ',35%, 40%)'
        $levelStart.classList.remove('start')
        Data.objects = []
        this.over = false
        Data.timer = 0
        Data.coinsThisLevel = 0
        // Terrain
        // let x = (GRID_SCALE_X * Data.winStreak % LEVELS_PER_WORLD + GRID_MINIMUM_X)
        // let y = (GRID_SCALE_Y * Data.winStreak % LEVELS_PER_WORLD + GRID_MINIMUM_Y)
        // this.gridX = Math.floor(Math.random() * x) + x
        // this.gridY = Math.floor(Math.random() * y) + y
        // let gridSize = GRID_SIZE
        // let wall = 1000

        // Platform(-wall, this.gridY * gridSize, this.gridX * gridSize + wall*2, wall)// bottom
        // Platform(-wall, -wall, this.gridX * gridSize + wall*2, wall) // top

        // Platform(-wall, -wall, wall, this.gridY * gridSize + wall*2) // left
        // Platform(this.gridX * gridSize, -wall, wall, this.gridY * gridSize + wall * 2) // right
        
        // let map = []
        // for (let i = 0; i < this.gridX; i++) {
        //     let row = []
        //     for (let j = 0; j < this.gridY; j++) {
        //         row.push(null)
        //     }
        //     map.push(row)
        // }

        // let goal = 0
        // let start = this.gridY-1
        // if (Math.random() < 0.5) {
        //     goal = start
        //     start = 0
        // }
        // let randX = Math.floor(Math.random() * this.gridX)
        // map[randX][start] = 'player' 
        // if (start == 0) map[randX][1] = 'block'

        // randX = Math.floor(Math.random() * this.gridX)

        // map[randX][goal] = 'goal'
            
        // for (let i = 0; i < this.gridX; i++) {
        //     for (let j = 0; j < this.gridY; j++) {
        //         if (map[i][j] == 'player') {
        //             this.player = Player(i * gridSize + 50, j * gridSize)
        //         } else if (map[i][j] == 'goal') {
        //             Goal(i * gridSize, j * gridSize, gridSize, gridSize)
        //         } else if (map[i][j] == 'block') {
        //             Platform(i * gridSize, j * gridSize, gridSize, gridSize)
        //         } else {
        //             let rand = Math.random()
        //             if (rand > 0.95) GlassPane(i * gridSize, j * gridSize, gridSize, gridSize)
        //             else if (rand > 0.94) DamageBox(i * gridSize, j * gridSize, gridSize, gridSize)
        //             else if (rand > .8) Platform(i * gridSize, j * gridSize, gridSize, gridSize)
        //         }
        //     }
        // }        
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
                this.pause()
                Game.start()
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
    pause: function () {
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
        Data.coinsBanked += Data.coinsThisLevel
        this.screen.getStats()
        this.screen.set('win')
    },
    dead: function () {
        this.over = true
        this.pause()
        Data.winStreak = 0
        Data.coinsBanked = 0
        this.screen.set('dead')
    }
}


Game.setUpdateCallback(game.tick)
Game.setDrawCallback(game.draw)

// Initial code when page loads
redirectToHttps()
cleanLinks()
$start.addEventListener('click', () => { 
    game.init()
})