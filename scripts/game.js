let canvas;
let context;
let WIDTH, HEIGHT;

window.onload = init;

function init(){
    // initialize canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    // start game loop
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw(){
    getViewport()
    let randomColor = Math.random() > 0.5? '#ff8080' : '#0099b0';
    context.fillStyle = randomColor;
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function getViewport() {
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth
    canvas.style.height = HEIGHT + "px"
    canvas.style.width = WIDTH + "px"
}