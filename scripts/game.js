// data members
let canvas
let context
let WIDTH, HEIGHT
let oldTimeStamp = 0

// keep track of what sprites are ready
let loaded = {
    background: false
}

// background sprite
let sprite_background = new Image()
sprite_background.src = '../images/moro.jpg'
sprite_background.onload = () => loaded.background = true


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
    // draw enemies
    // draw character
}

function getViewport() {
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth
    canvas.style.height = HEIGHT + "px"
    canvas.style.width = WIDTH + "px"
}

function drawBG() {
    if (loaded.background) {
        context.drawImage(sprite_background, 0, 0)
        console.log(sprite_background.src)
    }
}