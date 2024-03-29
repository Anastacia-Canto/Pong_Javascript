import { User } from "./User.js";

export default class Game {
	constructor(id, player1, player2) {
		this.id = id;
		// Getting canvas context
		this.canvas = document.querySelector("#canvas");
		this.ctx = this.canvas.getContext("2d");
		this.leftPlayer = new User(player1);
		this.rightPlayer = new User(player2);
		this.animation;

		// Getting elements references on DOM
		this.startBtn = document.querySelector('#start-btn');
		this.pauseBtn = document.querySelector('#pause-btn');
		this.restartBtn = document.querySelector('#restart-btn');
		this.closeMOdalBtn = document.querySelector('#message-modal-close');

		this.ballRadius = 8;
		this.ballX = canvas.width / 2;
		this.ballY = canvas.height / 2;
		this.ballSpeedX = 5;
		this.ballSpeedY = 5;

		this.paddleHeight = 100;
		this.paddleWidth = 10;
		this.leftPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.paddleSpeed = 10;

		// Initial load
		addEventListener("load", (event) => {
			this.draw();
		});

		this.maxScore = 5;
		
		// controlling game
		this.isGameOn = false;
		this.isGamePaused = false;


		// Listening events on buttons
		this.startBtn.addEventListener("click", (event) => {
			this.start();
		});

		this.pauseBtn.addEventListener("click", function() {
			if (this.isGameOn && !this.isGamePaused) {
				this.isGamePaused = true;
				this.pauseBtn.innerHTML = "Continue";
				cancelAnimationFrame(this.animation);
			} else if (this.isGamePaused) {
				this.pauseBtn.innerHTML = "Pause";
				this.isGameOn = false;
				this.isGamePaused = false;
				this.start();
			}
		});

		this.restartBtn.addEventListener("click", function() {
			this.restart();
		});
		
		this.closeMOdalBtn.addEventListener("click", function() {
			this.restart();
		});

		// Listening for keyboard events
		document.addEventListener("keydown", this.keyDownHandler);
		document.addEventListener("keyup", this.keyUpHandler);

		this.upPressed = false;
		this.downPressed = false;
		this.wPressed = false;
		this.sPressed = false;
		
	}

	start() {
		if(!this.isGameOn) {
			this.isGameOn = true;
			this.loop();
		}
	};

	restart() {
		cancelAnimationFrame(this.animation);
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.leftPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.rightPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
		this.leftPlayer.score = 0;
		this.rightPlayer.score = 0;
		this.isGameOn = false;
		this.isGamePaused = false;
		this.draw();
	}

	reset() {
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.ballSpeedX = -this.ballSpeedX;
		this.ballSpeedY = Math.random() * 10 -5;
	}

	keyDownHandler(e) {
		e.preventDefault();
		if (e.key === "ArrowUp") {
			this.upPressed = true;
		} else if (e.key === "ArrowDown") {
			this.downPressed = true;
		} else if (e.key === "w") {
			this.wPressed = true;
		} else if (e.key === "s") {
			this.sPressed = true;
		}
	}

	keyUpHandler(e) {
		e.preventDefault();
		if (e.key === "ArrowUp") {
			this.upPressed = false;
		} else if (e.key === "ArrowDown") {
			this.downPressed = false;
		} else if (e.key === "w") {
			this.wPressed = false;
		} else if (e.key === "s") {
			this.sPressed = false;
		}
	}

	update() {
		// move left paddle
		if (this.wPressed && this.leftPaddleY > 0) {
			this.leftPaddleY -= this.paddleSpeed;
		} else if (this.sPressed && this.leftPaddleY + this.paddleHeight < this.canvas.height) {
			this.leftPaddleY += this.paddleSpeed;
		}
	
		// move right paddle
		if (this.upPressed && this.rightPaddleY > 0) {
			this.rightPaddleY -= this.paddleSpeed;
		} else if (this.downPressed && this.rightPaddleY + this.paddleHeight < this.canvas.height) {
			this.rightPaddleY += this.paddleSpeed;
		}
	
		// move ball
		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;
	
		// collision with top and bottom
		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}
	
		// collision with left paddle
		if (this.ballX - this.ballRadius / 2 < this.paddleWidth && this.ballY > this.leftPaddleY && this.ballY < this.leftPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		} 
	
		// collision with right paddle
		if (this.ballX + this.ballRadius / 2 > this.canvas.width - this.paddleWidth && this.ballY > this.rightPaddleY && this.ballY < this.rightPaddleY + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}
	
		// check pontuation
		if (this.ballX < 0 && (this.ballY < this.leftPaddleY  || this.ballY > this.leftPaddleY + this.paddleHeight)) {
			this.rightPlayer.score++;
			this.reset();
		} else if (this.ballX > this.canvas.width && (this.ballY < this.rightPaddleY  || this.ballY > this.rightPaddleY + this.paddleHeight)) {
			this.leftPlayer.score++;
			this.reset();
		}
	
		if (this.rightPlayer.score == this.maxScore) {
			this.storeresult(this.rightPlayer, this.leftPlayer);
			this.endGame(this.rightPlayer.username);
		} else if (this.leftPlayer.score == this.maxScore) {
			this.storeresult(this.leftPlayer, this.rightPlayer);
			this.endGame(this.leftPlayer.username);
		}
	
	}

	storeresult(winner, looser) {
		winner.storeGames(this.id, "win", looser.username);
		looser.storeGames(this.id, "loose", winner.username);
	}

	endGame(winner) {
		let message = "Congratulations! " + winner + " wins!";
		$('#message').text(message);
		$('#message-modal').modal('show');
		this.reset();
	}

	draw() {

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#FFF";
	
		//paddles
		this.ctx.fillRect(0, this.leftPaddleY, this.paddleWidth, this.paddleHeight);
		this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.rightPaddleY, this.paddleWidth, this.paddleHeight);
	
		// central line
		for (let i = 0; i < 40; i++) {
			this.ctx.fillRect(this.canvas.width / 2, 0 + (i * 10), 2, 5);
		}
	
		// ball
		this.ctx.beginPath();
		this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
		this.ctx.fill();
	
		// info	
		this.ctx.font = "14px helvetica";
		this.ctx.fillText(this.leftPlayer.username + " - " + this.leftPlayer.score, 120, 20);
		this.ctx.fillText(this.rightPlayer.score + " - " + this.rightPlayer.username, 420, 20); 
	}

	loop() {
		this.update();
		this.draw();
		this.animation = requestAnimationFrame(this.loop);
	}

}