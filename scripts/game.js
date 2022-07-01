// data members
let canvas
let context
let WIDTH, HEIGHT, SPRITE = 32
const levelWidth = 512
const levelHeight = 256
let oldTimeStamp = 0
let collisionBox = 32

// keep track of what sprites are ready
let loaded = {
    background: false,
    player: false
}

// background sprite
let sprite_background = new Image()
sprite_background.src = '../images/moro.jpg'
sprite_background.onload = () => loaded.background = true

// walls
let walls = []

// enemies
let enemies = []
let enemyCounter = 0

// player 
let player = {
    x: 0,
    y: 0,
    hp: 8,
    speed: 4,
    alive: true,
    facingRight: true,
    reset: () => {
        player.x = WIDTH / 2
        player.y = WIDTH / 2
    },
    draw: () => {
        //draw rect for now
        context.fillStyle = 'red'
        context.fillRect(player.x, player.y, 32, 32)
    },
    checkCollision: () => {
        for (let i = 0; i < enemies.length; i++) {
            let distance = SPRITE
            let collisions = {
                x: false,
                y: false
            }
            if (enemies[i].x > player.x) {
                collisions.x = (enemies[i] - player.x) < distance ? true : false
            } else if (player.x > enemies[i].x) {
                collisions.x = (player.x - enemies[i].x) < distance ? true : false
            }
            if (enemies.y > player.y) {
                collisions.y = (enemies.y - player.y) < distance ? true : false
            } else if (player.y > enemies.y) {
                collisions.y = (player.y - enemies.y) < distance ? true : false
            }
            if (collisions.x && collisions.y) {
                return true
            }
        }
    },
    collisionRight: () => {
        for (let i = 0; i < walls.length; i++) {
            if (walls[i].x > player.x) {
                if ((walls[i].x - player.x) < collisionBox) {
                    let difference = walls[i].y > player.y ? walls[i].y - player.y : player.y - walls[i].y
                    if (difference < collisionBox) {
                        return true
                    }
                }
            }
        }
        return false
    },
    collisionLeft: () => {
        for (let i = 0; i < walls.length; i++) {
            if (walls[i].x <= player.x) {
                if ((player.x - walls[i].x) < collisionBox) {
                    let difference = walls[i].y > player.y ? walls[i].y - player.y : player.y - walls[i].y
                    if (difference < collisionBox) {
                        return true
                    }
                }
            }
        }
        return false
    },
    collisionBottom: () => {
        for (let i = 0; i < walls.length; i++) {
            if (walls[i].y > player.y) {
                if ((walls[i].y - player.y) < collisionBox) {
                    let difference = walls[i].x > player.x ? walls[i].x - player.x : player.x - walls[i].x
                    if (difference < collisionBox) {
                        return true
                    }
                }
            }
        }
        return false
    },
    collisionTop: () => {
        for (let i = 0; i < walls.length; i++) {
            if (walls[i].y <= player.y) {
                if ((player.y - walls[i].y) < collisionBox) {
                    let difference = walls[i].x > player.x ? walls[i].x - player.x : player.x - walls[i].x
                    if (difference < collisionBox) {
                        return true
                    }
                }
            }
        }
        return false
    },
    sprite: null,
}

// walls
class Wall {
    constructor(x, y, number) {
        this.number = number
        this.x = x
        this.y = y
    }
    draw() {
        //draw rect for now
        context.fillStyle = 'blue'
        context.fillRect(this.x, this.y, 32, 32)
    }
}

// enemies
class Enemy {
    constructor(x, y, number) {
        this.x = x
        this.y = y
        this.number = number
        this.speed = 0.25
    }
    draw() {
        //draw rect for now
        context.fillStyle = 'green'
        context.fillRect(this.x, this.y, 32, 32)
        this.move()
    }
    move() {
        // add some randomization
        let rand = Math.floor(Math.random() * 3)
        // avoid other enemies
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] != this && enemies[i].number != this.number) {
                if (enemies[i].x > this.x && enemies[i].x - this.x < SPRITE) {
                    this.x -= this.speed * rand
                } else if (this.x > enemies[i].x && this.x - enemies[i].x < SPRITE) {
                    this.x += this.speed * rand
                }
                if (enemies[i].y > this.y && enemies[i].y - this.y < SPRITE) {
                    this.y -= this.speed * rand
                } else if (this.y > enemies[i].y && this.y - enemies[i].y < SPRITE) {
                    this.y += this.speed * rand
                }
            }
        }
        // follow player
        if (this.x > player.x && this.x - player.x > SPRITE) {
            this.x -= this.speed * rand
        } else if (this.x < player.x && player.x - this.x > SPRITE) {
            this.x += this.speed * rand
        }
        if (this.y > player.y && this.y - player.y > SPRITE) {
            this.y -= this.speed * rand
        } else if (this.y < player.y && player.y - this.y > SPRITE) {
            this.y += this.speed * rand
        }
    }
}

function makeWalls() {
    let arr = []
    let topLeftX = WIDTH / 2 - levelWidth
    let topLeftY = HEIGHT / 2 - levelHeight
    // top wall
    for (let i = 0; i < 32; i++) {
        arr.push(new Wall(topLeftX + (i * SPRITE), topLeftY, i))
    }
    // left wall
    for (let i = 0; i < 16; i++) {
        arr.push(new Wall(topLeftX, topLeftY + (i * SPRITE), i+32))
    }
    // right wall
    for (let i = 0; i < 16; i++) {
        arr.push(new Wall(WIDTH / 2 + levelWidth, topLeftY + (i * SPRITE), i+48))
    }
    // bottom wall
    for (let i = 0; i < 33; i++) {
        arr.push(new Wall(topLeftX + (i * SPRITE), HEIGHT / 2 + levelHeight, i+64))
    }
    return arr
}

function makeEnemies() {
    if (enemies.length < 4) {
        let num = Math.floor(Math.random() * 4)
        let x, y 
        switch(num) {
            case 0: x = WIDTH / 2 - levelWidth + SPRITE
                    y = HEIGHT / 2
                    break
            case 1: x = WIDTH / 2
                    y = HEIGHT / 2 - levelHeight + SPRITE
                    break
            case 2: x = WIDTH / 2 + levelWidth - SPRITE
                    y = HEIGHT / 2
                    break
            case 3: x = WIDTH / 2 
                    y = HEIGHT / 2 + levelHeight - SPRITE
                    break
            default: console.error('makeEnemies error')
        }
        enemies.push(new Enemy(x, y, enemyCounter))
        enemyCounter++
        console.log(enemies)
    }
}



// start game when window is loaded
window.onload = init;

function init(){
    // initialize canvas
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    // get viewport size
    getViewport()
    // make walls
    walls = makeWalls()
    // set player position
    player.x = WIDTH / 2
    player.y = HEIGHT / 2
    // start game loop
    window.requestAnimationFrame(gameLoop)
}
/*
* MAIN GAME LOOP
*/
function gameLoop(timeStamp){
    // draw and add elements
    draw()
    // continuously make enemies
    makeEnemies()
    // end and loop
    oldTimeStamp = timeStamp
    window.requestAnimationFrame(gameLoop)
}

function draw(){
    getViewport()
    // draw BG
    drawBG()
    // draw ground / walls
    drawWalls()
    // draw enemies
    drawEnemies()
    // draw character
    player.draw()
}

function drawWalls() {
    for (let i = 0; i < walls.length; i++) {
        walls[i].draw()
    }
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw()
    }
}

function drawBG() {
    if (loaded.background) {
        context.drawImage(sprite_background, 0, 0)
    }
}

// desktop/key controls
window.onkeydown = (e) => move(e)
window.onkeyup = (e) => move(e)

// movement
function move(e) {
    if ((e.key === 'w' || e.key === 'ArrowUp') && !player.collisionTop()) {
        if (player.y > 0) {
            player.y -= player.speed
        }
    } else if ((e.key === 'd' || e.key === 'ArrowRight') && !player.collisionRight()) {
        if (player.x < WIDTH) {
            player.x += player.speed
        }
    } else if ((e.key === 's' || e.key === 'ArrowDown') && !player.collisionBottom()) {
        if (player.y < HEIGHT) {
            player.y += player.speed
        }
    } else if ((e.key === 'a' || e.key === 'ArrowLeft') && !player.collisionLeft()) {
        if (player.x > 0) {
            player.x -= player.speed
        }
    }
}

function getViewport() {
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.height = HEIGHT + "px"
    canvas.style.width = WIDTH + "px"
}