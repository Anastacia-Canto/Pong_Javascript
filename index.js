
// Getting canvas context
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let animation;

// Getting elements references on DOM
let startBtn = document.querySelector('#start-btn');
let pauseBtn = document.querySelector('#pause-btn');
let restartBtn = document.querySelector('#restart-btn');
let closeMOdalBtn = document.querySelector('#message-modal-close');

// Defining elements on canva
let leftPlayer = "ansilva-";
let rightPlayer = "tpereira";

let ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let paddleHeight = 100;
let paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let paddleSpeed = 10;

let leftPlayerScore = 0;
let rightPlayerScore = 0;
let maxScore = 5;

// controlling game
let isGameOn = false;
let isGamePaused = false;


// Listening events on buttons
startBtn.addEventListener("click", (event) => {
	start();
});

pauseBtn.addEventListener("click", function() {
	if (isGameOn && !isGamePaused) {
		isGamePaused = true;
		pauseBtn.innerHTML = "Continue";
		cancelAnimationFrame(animation);
	} else if (isGamePaused) {
		pauseBtn.innerHTML = "Pause";
		isGameOn = false;
		isGamePaused = false;
		start();
	}
});

restartBtn.addEventListener("click", function() {
	restart();
});

closeMOdalBtn.addEventListener("click", function() {
	restart();
});

function start() {
	if(!isGameOn) {
		isGameOn = true;
		loop();
	}
};

function restart() {
	cancelAnimationFrame(animation);
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	leftPaddleY = canvas.height / 2 - paddleHeight / 2;
	rightPaddleY = canvas.height / 2 - paddleHeight / 2;
	leftPlayerScore = 0;
	rightPlayerScore = 0;
	isGameOn = false;
	isGamePaused = false;
	draw();
}

function reset() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX = -ballSpeedX;
	ballSpeedY = Math.random() * 10 -5;
}

// Initial load
addEventListener("load", (event) => {
	draw();
});


// Listening for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
	e.preventDefault();
	if (e.key === "ArrowUp") {
		upPressed = true;
	} else if (e.key === "ArrowDown") {
		downPressed = true;
	} else if (e.key === "w") {
		wPressed = true;
	} else if (e.key === "s") {
		sPressed = true;
	}
}

function keyUpHandler(e) {
	e.preventDefault();
	if (e.key === "ArrowUp") {
		upPressed = false;
	} else if (e.key === "ArrowDown") {
		downPressed = false;
	} else if (e.key === "w") {
		wPressed = false;
	} else if (e.key === "s") {
		sPressed = false;
	}
}

function update() {
	// move left paddle
	if (wPressed && leftPaddleY > 0) {
		leftPaddleY -= paddleSpeed;
	} else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
		leftPaddleY += paddleSpeed;
	}

	// move right paddle
	if (upPressed && rightPaddleY > 0) {
		rightPaddleY -= paddleSpeed;
	} else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
		rightPaddleY += paddleSpeed;
	}

	// move ball
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// collision with top and bottom
	if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	// collision with left paddle
	if (ballX - ballRadius / 2 < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	} 

	// collision with right paddle
	if (ballX + ballRadius / 2 > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}

	// check pontuation
	if (ballX < 0 && (ballY < leftPaddleY  || ballY > leftPaddleY + paddleHeight)) {
		rightPlayerScore++;
		reset();
	} else if (ballX > canvas.width && (ballY < rightPaddleY  || ballY > rightPaddleY + paddleHeight)) {
		leftPlayerScore++;
		reset();
	}

	if (rightPlayerScore == maxScore) {
		endGame(rightPlayer);
	} else if (leftPlayerScore == maxScore) {
		endGame(leftPlayer);
	}

}

function endGame(winner) {
	let message = "Congratulations! " + winner + " wins!";
	$('#message').text(message);
	$('#message-modal').modal('show');
	reset();
}

function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFF";

	//paddles
	ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

	// central line
	for (let i = 0; i < 40; i++) {
		ctx.fillRect(canvas.width / 2, 0 + (i * 10), 2, 5);
	}

	// ball
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fill();

	// info	
	ctx.font = "14px helvetica";
	ctx.fillText(leftPlayer + " - " + leftPlayerScore, 120, 20);
	ctx.fillText(rightPlayerScore + " - " + rightPlayer, 420, 20); 
}


function loop() {
	update();
	draw();
	animation = requestAnimationFrame(loop);
}



