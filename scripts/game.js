// data members
let canvas
let context
let WIDTH, HEIGHT
let oldTimeStamp = 0

// keep track of what sprites are ready
let loaded = {
    background: false,
    player: false
}

// background sprite
let sprite_background = new Image()
sprite_background.src = '../images/moro.jpg'
sprite_background.onload = () => loaded.background = true

// player 
let player = {
    x: 0,
    y: 0,
    hp: 10,
    speed: 8,
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

// start game when window is loaded
window.onload = init;


function init(){
    // initialize canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    // start game loop
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){
    // draw and add elements
    draw()
    // end and loop
    oldTimeStamp = timeStamp
    window.requestAnimationFrame(gameLoop)
}

function draw(){
    getViewport()
    // draw BG
    drawBG()
    // draw ground / walls
    new Wall(200, 200, 1).draw()
    // draw enemies
    // draw character
    player.draw()
}

function getViewport() {
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.height = HEIGHT + "px"
    canvas.style.width = WIDTH + "px"
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
    if (e.key === 'w' || e.key === 'ArrowUp') {
        if (player.y > 0) {
            player.y -= player.speed
        }
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        if (player.x < WIDTH) {
            player.x += player.speed
        }
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        if (player.y < HEIGHT) {
            player.y += player.speed
        }
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        if (player.x > 0) {
            player.x -= player.speed
        }
    }
}