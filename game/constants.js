// UI
const UI_COLOR_PRIMARY = 'rgb(0, 16, 42)'
const UI_COLOR_SECONDARY = 'rgb(68, 214, 255)'
const UI_COLOR_TERTIARY = '#ccffff'
document.body.style.setProperty('--primary', UI_COLOR_PRIMARY)
document.body.style.setProperty('--secondary', UI_COLOR_SECONDARY)
document.body.style.setProperty('--tertiary', UI_COLOR_TERTIARY)

// General
const FPS = 60
const GRAVITY = new Pyre.Vector(0, 0.5)
const CAMERA_LAG = 0.08
const CAMERA_BOUNDARY = 200
const TIMESCALE_LERP_FACTOR = 0.05

// Audio
const MUSIC_VOLUME = 0.4

// World
const GRID_MINIMUM_X = 8
const GRID_MINIMUM_Y = 5
const GRID_SCALE_X = 4
const GRID_SCALE_Y = 1
const GRID_SIZE = 64
const DIFFICULTY_SCALE = 1.5
const LEVELS_PER_WORLD = 5

// Audio
const MUSIC = [
    "01-galactic-agent",
    "02-clearly-the-bad-guys",
    "03-mildly-intoxicating"
]


// Player
const JUMP_LATE_TOLERANCE = 0.1 * FPS
const JUMP_POWER = 15
const WALL_JUMP_POWER = 0.5
const STICKY_DELAY = 0.075 * FPS
const DASH_POWER = 15
const DASH_RECHARGE = -0.7 * FPS
const DASH_DURATION = 0.3 * FPS
const AIR_DRAG = 0.9
const FLOOR_DRAG = 0.5
const MAX_SPEED = 7
const ACCELERATION = 0.8
const BULLET_TIME_FACTOR = 0.2

const VISOR_COLOR = 'limegreen'
const GEAR_COLOR = '#ccc'
const THRUSTER_COLOR = 'olive'