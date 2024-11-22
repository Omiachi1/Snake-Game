// define HTML elements 

const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById('highScore');

// define game variable 
const gridSize = 20;
let snake = [{x:10, y:10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// draw game map, sake, food
function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake 

function drawSnake() {
     snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement);
     } )
}

// create a snake or food cube/div 

function createGameElement (tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element
}

// set the positoin of the snake or the food 

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
// testing draw funton
// draw();


// draw food function 
function drawFood () {
    if (gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
    
}

//generate food
function generateFood () {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// moving the snake 
function move() {
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    // snake.pop();

    if (head.x == food.x && head.y == food.y) {
        food = generateFood();
        increaseSpeed()
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval (() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop()
    }
}


// text moving 

// setInterv al (() =>{
//     move(); // move firstn
//     draw(); //then  draw again new position 
// }, 200);


//start game funtion 
function startGame() {
    gameStarted = true; // keep track of the running game
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval (() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

//keypress event listener 

function handleKeyPress(event) {
    if(
        (!gameStarted && event.code === "space") || 
        (!gameStarted && event.key === " ")
    
    ){
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
                        
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -=5;
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -=3
    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -=3
    } else if (gameSpeedDelay > 25){
        gameSpeedDelay -=3
    }
}



function checkCollision() {
    const head = snake[0];
    
    // Check for wall collision
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      updateHighScore();
      resetGame();
    }
    
    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        updateHighScore();
        resetGame();
      }
    }
  }
  

//reset game function
function resetGame() {
    snake = [{x:10, y: 10}];
    food = generateFood();
    direction= "right";
    gameSpeedDelay = 200;
    updateScore();
    updateHighScore();
    // instructionText.style.display = 'block';
    // logo.style.display = 'block';
    // highScoreText.style.display = 'none';

}

//upadate score function
function updateScore() {
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0');
}


//stopgame

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

//update highscore
function updateHighScore() {
    const currentScore = snake.length -1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}