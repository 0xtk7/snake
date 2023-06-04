const canvas = document.getElementById('board');
const ctx = canvas.getContext("2d");

const tileCount = 20;
const tileSize = 18;

let gameOver = false;

// Snake
class Snake {
    constructor (x, y) {
        this.headX = Math.floor(Math.random() * tileCount);
        this.headY = Math.floor(Math.random() * tileCount);
        this.velX = 0;
        this.velY = 0;
        this.tailLength = 0;
        this.snakeParts = [];
        this.x = x;
        this.y = y;
        this.score = 0;
    }

    // Draw the score
    drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "10px verdana";
        ctx.fillText(`Score: ${this.score}`, canvas.clientWidth-50,10);
    }

    // Draw the snake head
    drawSnake() { 
        ctx.fillStyle = "lime";

        for (let i=0; i < this.snakeParts.length; i++) {
            let part = this.snakeParts[i];

            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
        }

        this.snakeParts.push(new Snake(this.headX ,this.headY));
        if (this.snakeParts.length > this.tailLength) this.snakeParts.shift();
    
        ctx.fillRect(this.headX *tileCount, this.headY *tileCount, tileSize, tileSize);
    }

    // Snake movement
    moveSnake() {
        document.body.addEventListener('keydown', (e) => { 
            switch (e.key) {
                case ('w'): // Up
                    if (this.velY == 1) return;
                    this.velY = -1;
                    this.velX = 0;    
                return;
                case ('s'): // Down
                    if (this.velY == -1) return;
                    this.velY = 1;
                    this.velX = 0; 
                return;
                case ('a'): // Left
                    if (this.velX == 1) return;
                    this.velY = 0;
                    this.velX = -1; 
                return;
                case ('d'): // Right
                    if (this.velX == -1) return;
                    this.velY = 0;
                    this.velX = 1; 
                return;
            }
        });
        
        this.headX += this.velX;
        this.headY += this.velY;

        console.log(this.headX, this.headY);
    }
}

// Food
class Food { 
    constructor() {
        this.foodX = Math.floor(Math.random() * tileCount);
        this.foodY = Math.floor(Math.random() * tileCount);
    }

    drawfood() {
        ctx.fillStyle = "#db4d4d";
        ctx.fillRect(this.foodX*tileCount, this.foodY*tileCount, tileSize, tileSize);
    }
}

let snake = new Snake();
let food = new Food();

function collision() {
    // food collision
    if (food.foodX == snake.headX && food.foodY == snake.headY) {
        food.foodX = Math.floor(Math.random() * tileCount); 
        food.foodY = Math.floor(Math.random() * tileCount); 
        snake.tailLength++;
        snake.score++;
    }
}

function checkGameOver() {
        
    if (snake.velY === 0 && snake.velX === 0) return false;

    if (snake.headX < 0 || snake.headX === tileCount || snake.headY < 0 || snake.headY === tileCount) gameOver = true;
    
    for (let i = 0; i < snake.snakeParts.length; i++){
        let part = snake.snakeParts[i];
        if(part.x === snake.headX && part.y === snake.headY){
            gameOver = true;
            break; 
        }
    }

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font= "50px verdana";
        ctx.fillText("Game Over! ", canvas.clientWidth/6.5, canvas.clientHeight/2);
    }

    return gameOver;
}

function update() {
    ctx.fillStyle = "#4db7db";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.drawSnake();
    snake.moveSnake();
    food.drawfood();
    snake.drawScore();
    collision();     
    let result = checkGameOver();
    
    if (result) {
        document.getElementById("restartGame").style.visibility = "visible"; 
        return;
    }
    
    document.getElementById("position").innerHTML = `X:${snake.headX}.Y:${snake.headY}\nFoodX:${food.foodX}.FoodY:${food.foodY}`

    setTimeout(update, 1000/9);
}

update();