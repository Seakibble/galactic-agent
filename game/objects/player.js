Player = function (x, y) {
    let obj = Obj(x, y)
    obj.player = true
    obj.size.x = 35
    obj.size.y = 60
    obj.color = "#333"
    
    obj.gravity = true
    obj.collision = true
    obj.moves = true
    obj.aimingAngle = 0
    obj.reticulePos = new Pyre.Vector()

    obj.health = 3

    obj.interactTarget = null

    obj.jumpLate = 0
    obj.dashCooldown = 0
    obj.facing = 'right'
    obj.upgrades = {
        wallClimb: false,
        dash: false,
        gun: false,
    }

    obj.damage = function (dam) {
        if (this.health) {
            this.health -= dam
            if (this.health <= 0) game.dead()
        }
    }

    obj.colBoxes = {
        size: 3,
        offset: 10,
        Up: function () {
            return Box(this.offset + obj.pos.x, - this.size + obj.pos.y, obj.size.x - this.offset * 2, this.size)
        },
        Down: function () {
            return Box(this.offset + obj.pos.x, obj.size.y + obj.pos.y, obj.size.x - this.offset * 2, this.size)
        },
        Left: function () {
            return Box(-this.size + obj.pos.x, this.offset + obj.pos.y, this.size, obj.size.y - this.offset * 2)
        },
        Right: function () {
            return Box(obj.size.x + obj.pos.x, this.offset + obj.pos.y, this.size, obj.size.y - this.offset * 2)
        }
    }

    obj.update = function () {
        if (this.upgrades.gun && !Sound.bulletTime.playing()) Sound.bulletTime.play()
        
        if (this.gravity && !this.grounded && this.dashCooldown < 0) {
            this.vel.add(GRAVITY.clone().multiply(Game.timeScale))
        }

        this.pos.add(this.vel.clone().multiply(Game.timeScale))

        // 
        if (input.aiming) {
            this.reticulePos = getWorldSpace(input.mouse)
            let gun = this.getGun()
            let diff = this.reticulePos.difference(gun.pos)
            this.aimingAngle = Math.atan2(diff.y, diff.x)
        } else {
            this.aimingAngle = 0
        }
    }

    obj.checkCollision = function () {
        if (!this.collision) return

        let noGroundCollision = true
        let noWallCollision = true
        let collideLeft = false
        let collideRight = false
        for (let i = 0; i < Data.objects.length; i++) {
            let that = Data.objects[i]
            if (!this.moves) continue
            if (this == that) continue

            if (that.obstructs) {
                let collision = false
                let velocity = this.vel.magnitude()
                // Collide ground
                if (Collides(this.colBoxes.Down(), that)) {
                    collision = true
                    this.pos.y = that.pos.y - this.size.y

                    if (this.vel.y > 25) Sound.playSFX('landHeavy')
                    else if (this.vel.y > 5) Sound.playSFX('land')
                    // if (this.vel.y > 25) audio.player.landHeavy.play() 
                    // else if (this.vel.y > 5) audio.player.land.play()
                        
                    this.vel.y = 0
                    
                    if (this.moves) {
                        this.grounded = true
                    }
                    noGroundCollision = false
                }

                // Collide up
                if (Collides(this.colBoxes.Up(), that)) {
                    collision = true
                    this.pos.y = that.pos.y + that.size.y
                    if (this.vel.y < 0) this.vel.y = 0
                }
                // Collide left
                if (Collides(this.colBoxes.Left(), that)) {
                    collision = true
                    this.pos.x = that.pos.x + that.size.x
                    if (this.vel.x < 0) this.vel.x = 0
                    noWallCollision = false
                    collideLeft = true
                }
                // Collide right
                if (Collides(this.colBoxes.Right(), that)) {
                    collision = true
                    this.pos.x = that.pos.x - this.size.x
                    if (this.vel.x > 0) this.vel.x = 0
                    noWallCollision = false
                    collideRight = true
                }

                if (collision && that.onCollision) that.onCollision(this, velocity)
            }
        }
        if (!noWallCollision && this.upgrades.wallClimb) {
            this.sticking = true
            
            if (collideLeft) this.facing = 'right'
            else this.facing = 'left'

            if (collideLeft && input.left || collideRight && input.right) {
                this.vel.y = 0
                this.jumped = false
            }
            if (!input.jump) {
                input.jumpLock = false
                this.jumpLate = 0
            } 
        } else {
            this.sticking = false
        }

        if (noGroundCollision) {
            if (this.grounded && this.moves) {
                this.grounded = false
                this.jumpLate = 0
            } else {
                this.jumpLate++
            }
        }

        this.dashCooldown--
        if (this.dashCooldown <= DASH_RECHARGE) this.dashed = false
    }
    obj.checkInteract = function () {
        let targets = []
        for (let i = 0; i < Data.objects.length; i++) {
            let that = Data.objects[i]

            if (this == that) continue
            if (!that.interactable) continue
            let distance = this.pos.distance(that.pos)
            // console.log(this.pos, that.pos, this.pos.distance(that.pos), distance)
            if (distance < 100) targets.push({
                obj: that,
                dist: distance
            })
        }
        if (targets.length > 1) {
            targets.sort((a, b) => {
                if (a.dist > b.dist) return -1
                else if (a.dist < b.dist) return 1
                else return 0
            })
        }

        if (targets.length !== 0) this.interactTarget = targets[0].obj
        else this.interactTarget = null
    }

    obj.getGun = function () {
        let pulse = Pulse(700, 2) - 2
        if (this.Facing() == 1) {
            return Box(this.pos.x + this.size.x / 2 - 5, this.pos.y + pulse + this.size.y / 2, 40, 8, GEAR_COLOR)
        } else {
            return Box(this.pos.x + this.size.x / 2 - 35, this.pos.y + pulse + this.size.y / 2, 40, 8, GEAR_COLOR)
        }
    }
    obj.draw = function () {
        // Dude
        camera.RenderObj(this, 3)
        let visorColor = VISOR_COLOR
        let gearColor = GEAR_COLOR
        let thrusterColor = THRUSTER_COLOR
        if (this.dashCooldown > 0) thrusterColor = 'yellow'
        else if (this.dashCooldown > DASH_RECHARGE || this.dashed) thrusterColor = '#332'

        let pulse = Pulse(700, 2) - 2

        let gun = this.getGun()
        let pivot = Pivot()
        if (this.upgrades.gun && input.aiming) {
            if (this.Facing() == 1) pivot = Pivot(4, 4, this.aimingAngle)
            else pivot = Pivot(36, 4, this.aimingAngle + Math.PI)
            
            camera.Render(DrawLine(
                this.reticulePos.x, this.reticulePos.y,
                this.pos.x + this.size.x / 2, this.pos.y + pulse + this.size.y / 2,
                'red'))
            
            
        }

        if (this.upgrades.gun) {
            camera.Render(DrawObj(gun, pivot), 1)
        }

        // Helmet
        camera.Render(Draw(this.pos.x, this.pos.y + pulse - 2, this.size.x, this.size.x-5, gearColor), 3)

        if (this.facing == 'left') {
            // Antenna
            camera.Render(Draw(this.pos.x + this.size.x - 7, this.pos.y - 15 + pulse, 2, 16, this.color), 4)
            
            // Visor
            camera.Render(Draw(this.pos.x, this.pos.y + 5 + pulse, 20, 6, visorColor), 2)
            camera.Render(Draw(this.pos.x, this.pos.y + 10 + pulse, 12, 10, visorColor), 2)

            if (this.upgrades.dash) {
                // Backpack
                camera.Render(Draw(this.pos.x + this.size.x - 9, this.pos.y + pulse + 20, 15, 30, gearColor), 3)
                camera.Render(Draw(this.pos.x + this.size.x - 2, this.pos.y + pulse + 25, 8, 20, thrusterColor), 2)
            }

            
        } else if (this.facing == 'right') {
            // Antenna
            camera.Render(Draw(this.pos.x + 7, this.pos.y - 15 + pulse, 2, 16, this.color), 4)

            // Visor
            camera.Render(Draw(this.pos.x + this.size.x - 20, this.pos.y + 5 + pulse, 20, 6, visorColor), 2)
            camera.Render(Draw(this.pos.x + this.size.x - 12, this.pos.y + 10 + pulse, 12, 10, visorColor), 2)

            if (this.upgrades.dash) {
                // Backpack
                camera.Render(Draw(this.pos.x - 6, this.pos.y + pulse + 20, 15, 30, gearColor), 3)
                camera.Render(Draw(this.pos.x - 6, this.pos.y + pulse + 25, 8, 20, thrusterColor), 2)
            }
        }

        if (this.interactTarget) {
            let t = this.interactTarget
            let text = t.interactText ? t.interactText : 'Interact'
            camera.Render(DrawText(t.pos.x, t.pos.y-30, text))
        }

        if (game.debug) {
            camera.RenderObj(this.colBoxes.Up())
            camera.RenderObj(this.colBoxes.Down())
            camera.RenderObj(this.colBoxes.Left())
            camera.RenderObj(this.colBoxes.Right())
        }
        
    }
    Sound.loadSFXArray(['jump', 'walk', 'land', 'landHeavy', 'shoot'])
    Sound.loadBulletTime('bullet-time')
    
    Data.objects.push(obj)
    Data.player = obj
    return obj
}