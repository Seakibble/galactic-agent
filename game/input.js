Input = function () {
    return {
        workman: false,
        up: false,
        down: false,
        left: false,
        right: false,
        enter: false,
        jump: false,
        jumpLock: false,
        stickyDelay: 0,
        dash: false,
        dashLock: false,
        shoot: false,
        aiming: false,
        mouse: new Pyre.Vector(0, 0),
        interact: false,
        reset: function () {
            this.up = false
            this.left = false
            this.right = false
            this.down = false
        },
        menuInput: function () {
            // if (this.up) $('button.selected')
            if (this.enter) {
                switch (game.screen.state) {
                    case 'dead':
                        $tryAgain.click()
                        break
                    case 'win':
                        $playAgain.click()
                        break
                    case 'start':
                        $start.click()
                        break
                }
                this.enter = false
            }
        },
        gameInput: function () {
            if (game.over) return

            // game input
            let drag = FLOOR_DRAG
            if (!Data.player.grounded) drag = AIR_DRAG

            // Interact
            if (this.interact) {
                this.interact = false
                if (Data.player.interactTarget !== null) Data.player.interactTarget.onInteract()
            }


            // Left and Right
            if (Data.player.dashCooldown <= 0) {
                if (this.left && Data.player.vel.x > -MAX_SPEED && this.stickyDelay < 0) {
                    if (Data.player.vel.x > 0) Data.player.vel.x = 0
                    // if (Data.player.vel.x > 0) Data.player.vel.x *= drag
                    if (!Data.player.sticking) Data.player.facing = 'left'
                    Data.player.vel.add(new Pyre.Vector(-ACCELERATION, 0))
                } else if (this.right && Data.player.vel.x < MAX_SPEED && this.stickyDelay < 0) {
                    if (Data.player.vel.x < 0) Data.player.vel.x = 0
                    // if (Data.player.vel.x < 0) Data.player.vel.x *= drag
                    Data.player.vel.add(new Pyre.Vector(ACCELERATION, 0))
                    if (!Data.player.sticking) Data.player.facing = 'right'
                } else if (!this.left && !this.right) {
                    Data.player.vel.x *= drag
                }
            }

            // Shooting
            if (Data.player.upgrades.gun && this.shoot) {
                this.shoot = false
                let facing = Data.player.Facing()
                // audio.player.shoot.play()
                Sound.playSFX('shoot')
                let velocity = new Pyre.Vector(Math.cos(Data.player.aimingAngle), Math.sin(Data.player.aimingAngle))
                velocity.multiply(30)
                let position = Data.player.center().add(velocity.clone())

                Projectile(position.x,position.y,5, 5,velocity.x, velocity.y)
            }

            if (Data.player.upgrades.bulletTime && this.aiming) {
                Game.setTimeScale(BULLET_TIME_FACTOR)
                Sound.setBulletTimeVolume(1 - Game.timeScale)
            } else {
                Game.setTimeScale(1)
                Sound.setBulletTimeVolume(1 - Game.timeScale)
            }


            // Play walking SFX
            if (Data.player.grounded && (this.left || this.right)) {
                // if (!audio.player.walk.playing()) audio.player.walk.play()
                Sound.playSFXNoSpam('walk')
            }

            // Jumping
            this.stickyDelay--
            if (this.jump && (Data.player.grounded || Data.player.jumpLate < JUMP_LATE_TOLERANCE) && this.jumpLock == false) {
                //
                if (Data.player.sticking && (!Data.player.grounded || (Data.player.grounded && (this.left || this.right) ))) {
                    if (Data.player.facing == 'left') Data.player.vel.x -= JUMP_POWER * WALL_JUMP_POWER
                    else Data.player.vel.x += JUMP_POWER * WALL_JUMP_POWER
                    this.stickyDelay = STICKY_DELAY
                }
                Data.player.grounded = false
                Data.player.vel.y = -JUMP_POWER

                Data.player.jumped = true
                this.jumpLock = true
                // audio.player.jump.play()
                Sound.playSFX('jump')
            }
            if (!this.jump && Data.player.jumped && Data.player.vel.y < 0) {
                Data.player.vel.y = 0
            }
            if (Data.player.grounded) {
                Data.player.jumped = false
                if (!this.jump) {
                    this.jumpLock = false
                }
            }
            if (Data.player.sticking || Data.player.grounded) {
                Data.player.dashed = false
                this.dashLock = false
            }

            // Dashing
            if (Data.player.upgrades.dash && this.dash && !this.dashLock && Data.player.dashCooldown <= DASH_RECHARGE) {
                this.dashLock = true
                Data.player.dashed = true
                Data.player.dashCooldown = DASH_DURATION
                Data.player.vel.y = 0
                Data.player.vel.x = DASH_POWER * Data.player.Facing()
                Sound.playSFX('jetpack')
            }
            this.dash = false
        },
    }    
}

document.addEventListener("mousemove", (event) => {
    if (!Game.running) return

    input.mouse.set(event.pageX, event.pageY)
})
document.addEventListener("mousedown", (event) => {
    if (!Game.running) return

    let btn = 'Left Click'
    if (event.buttons == 2) btn = 'Right Click'
        
    setInput(btn, true)
})
document.addEventListener("mouseup", (event) => {
    if (!Game.running) return

    let btn = 'Left Click'
    if (event.buttons == 2) btn = 'Right Click'

    setInput(btn, false)
})

document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    // do something
    // console.log(event.key)

    if (!Game.running) return
    setInput(event.key, true)
})
document.addEventListener("keyup", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    if (!Game.running) return
    setInput(event.key, false)
})

function setInput(key, keyDown) {
    if (input.workman) {
        // WORKMAN LAYOUT
        switch (key) {
            case 'R':
            case 'r':
                if (keyDown) input.interact = true
                break

            case 'A':
            case 'a':
            case 'ArrowLeft':
                input.left = keyDown
                break
            case 'ArrowRight':
            case 'H':
            case 'h':
                input.right = keyDown
                break
            case 'D':
            case 'd':
            case 'ArrowUp':
                input.up = keyDown
                break
            case 'S':
            case 's':
            case 'ArrowDown':
                input.down = keyDown
                break
        }
    } else {
        // QUERTY LAYOUT
        switch (key) {
            case 'E':
            case 'e':
                if (keyDown) input.interact = true
                break
            
            case 'A':
            case 'a':
            case 'ArrowLeft':
                input.left = keyDown
                break
            case 'D':
            case 'd':
            case 'ArrowRight':
                input.right = keyDown
                break
            case 'W':
            case 'w':
            case 'ArrowUp':
                input.up = keyDown
                break
            case 'S':
            case 's':
            case 'ArrowDown':
                input.down = keyDown
                break
        }
    }

    // Common keys
    switch (key) {
        case 'Escape':
            if (keyDown) game.pause()
            break
        case 'Shift':
            input.dash = keyDown
            break
        case 'F4':
            if (keyDown) Data.debug = !Data.debug
            break
        case ' ':
            input.jump = keyDown
            break
        case 'Enter':
            if (keyDown) input.enter = true
            break
        case 'Left Click':
            if (game.paused || game.over) break
            if (keyDown) {
                input.aiming = true
            } else {
                input.aiming = false
                input.shoot = true
            }
            break
        case 'Right Click':
            if (game.paused || game.over) break
            if (keyDown) {
                input.aiming = true
            } else {
                input.aiming = false
                input.shoot = true
            }
            break
    }
}