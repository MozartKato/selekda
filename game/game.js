document.addEventListener('DOMContentLoaded', () => {
    // Retrieve username from localStorage
    const username = localStorage.getItem('username');

    if (!username) {
        // If username is not found, redirect back to welcome page
        window.location.href = 'welcome.html';
    }

    const playerCharacter = document.getElementById('player-character');
    const computerCharacter = document.getElementById('computer-character');
    const ball = document.getElementById('ball');
    const playerScoreElem = document.getElementById('player-score');
    const computerScoreElem = document.getElementById('computer-score');
    const timerElem = document.getElementById('timer');
    const itemsContainer = document.getElementById('items');
    const gameOverScreen = document.getElementById('game-over');
    const pauseBtn = document.getElementById('pause-btn');
    let playerScore = 0;
    let computerScore = 0;
    let gameTime = 30;
    let timerInterval;
    let ballMovementInterval;
    let itemDropInterval;

    // Initialize the game
    function startGame() {
        setTimer('easy');
        setBallMovement();
        setItemDrops();
        document.addEventListener('keydown', handlePlayerControls);
        document.addEventListener('keydown', handlePause);
    }

    function setTimer(level) {
        switch (level) {
            case 'easy':
                gameTime = 30;
                break;
            case 'medium':
                gameTime = 20;
                break;
            case 'hard':
                gameTime = 15;
                break;
        }
        timerElem.textContent = gameTime;
        timerInterval = setInterval(() => {
            gameTime--;
            timerElem.textContent = gameTime;
            if (gameTime <= 0) {
                endGame();
            }
        }, 1000);
    }

    function setBallMovement() {
        const gameboardRect = document.getElementById('gameboard').getBoundingClientRect();
        let ballXSpeed = 2;
        let ballYSpeed = 2;
        ball.style.left = '50%';
        ball.style.top = '50%';
    
        ballMovementInterval = setInterval(() => {
            let ballRect = ball.getBoundingClientRect();
            
            // Move ball
            let newBallLeft = ballRect.left + ballXSpeed - gameboardRect.left;
            let newBallTop = ballRect.top + ballYSpeed - gameboardRect.top;
    
            // Check for collision with gameboard edges
            if (newBallLeft < 0 || newBallLeft + ballRect.width > gameboardRect.width) {
                ballXSpeed *= -1; // Reverse direction
            }
            if (newBallTop < 0 || newBallTop + ballRect.height > gameboardRect.height) {
                ballYSpeed *= -1; // Reverse direction
            }
    
            ball.style.left = `${Math.min(Math.max(newBallLeft, 0), gameboardRect.width - ballRect.width)}px`;
            ball.style.top = `${Math.min(Math.max(newBallTop, 0), gameboardRect.height - ballRect.height)}px`;
    
            // Check collision with player
            let playerRect = playerCharacter.getBoundingClientRect();
            if (ballRect.top < playerRect.bottom && ballRect.bottom > playerRect.top &&
                ballRect.left < playerRect.right && ballRect.right > playerRect.left) {
                ballXSpeed *= -1; // Reverse direction
                playerScore++;
                playerScoreElem.textContent = playerScore;
                ball.style.left = '50%'; // Reset ball position
                ball.style.top = '50%'; // Reset ball position
            }
    
            // Check collision with computer
            let computerRect = computerCharacter.getBoundingClientRect();
            if (ballRect.top < computerRect.bottom && ballRect.bottom > computerRect.top &&
                ballRect.left < computerRect.right && ballRect.right > computerRect.left) {
                ballXSpeed *= -1; // Reverse direction
                computerScore++;
                computerScoreElem.textContent = computerScore;
                ball.style.left = '50%'; // Reset ball position
                ball.style.top = '50%'; // Reset ball position
            }
        }, 20);
    }

    function setItemDrops() {
        itemDropInterval = setInterval(() => {
            let itemType = ['increase', 'decrease', 'freeze'][Math.floor(Math.random() * 3)];
            let item = document.createElement('div');
            item.className = `item ${itemType}`;
            item.style.left = `${Math.random() * 100}%`;
            item.style.top = '0';
            itemsContainer.appendChild(item);

            setTimeout(() => {
                itemsContainer.removeChild(item);
            }, 5000);

            // Handle item collision with ball
            item.addEventListener('click', () => {
                switch (itemType) {
                    case 'increase':
                        ball.style.width = `${ball.offsetWidth * 1.5}px`;
                        ball.style.height = `${ball.offsetHeight * 1.5}px`;
                        break;
                    case 'decrease':
                        ball.style.width = `${ball.offsetWidth * 0.5}px`;
                        ball.style.height = `${ball.offsetHeight * 0.5}px`;
                        break;
                    case 'freeze':
                        // Freeze ball
                        break;
                }
                itemsContainer.removeChild(item);
            });
        }, 5000);
    }

    function handlePlayerControls(event) {
        const step = 10; // Jarak langkah per gerakan
        let playerRect = playerCharacter.getBoundingClientRect();
    
        switch (event.code) {
            case 'KeyA': // Gerak ke kiri
                playerCharacter.style.left = `${Math.max(parseInt(playerCharacter.style.left) - step, 0)}px`;
                break;
            case 'KeyD': // Gerak ke kanan
                playerCharacter.style.left = `${Math.min(parseInt(playerCharacter.style.left) + step, window.innerWidth - playerRect.width)}px`;
                break;
            case 'KeyW': // Lompat (gerak ke atas)
                playerCharacter.style.top = `${Math.max(parseInt(playerCharacter.style.top) - step, 0)}px`;
                break;
            case 'Space': // Kick (perlu implementasi tambahan)
                // Implementasi logika kick di sini
                break;
        }
    
        // Memastikan posisi akhir tidak melewati batas layar
        playerRect = playerCharacter.getBoundingClientRect();
        playerCharacter.style.left = `${Math.max(Math.min(parseInt(playerCharacter.style.left), window.innerWidth - playerRect.width), 0)}px`;
        playerCharacter.style.top = `${Math.max(Math.min(parseInt(playerCharacter.style.top), window.innerHeight - playerRect.height), 0)}px`;
    }

    function handlePause(event) {
        if (event.code === 'Escape') {
            if (document.getElementById('game-screen').classList.contains('hidden')) {
                document.getElementById('game-screen').classList.remove('hidden');
                document.getElementById('pause-overlay').remove();
            } else {
                pauseGame();
            }
        }
    }

    function pauseGame() {
        clearInterval(timerInterval);
        clearInterval(ballMovementInterval);
        clearInterval(itemDropInterval);
        // Display pause screen logic here, such as showing a modal or overlay
        document.getElementById('game-screen').classList.add('hidden');
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.innerHTML = `
            <div id="pause-popup">
                <h2>Game Paused</h2>
                <button id="continue-btn">Continue</button>
            </div>
        `;
        document.body.appendChild(pauseOverlay);

        document.getElementById('continue-btn').addEventListener('click', () => {
            document.body.removeChild(pauseOverlay);
            document.getElementById('game-screen').classList.remove('hidden');
            startGame(); // Restart game functions
        });
    }

    function endGame() {
        clearInterval(timerInterval);
        clearInterval(ballMovementInterval);
        clearInterval(itemDropInterval);
        document.getElementById('game-screen').classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        document.getElementById('final-score').textContent = `Score: ${playerScore}`;

        // Save match history and restart buttons
        document.getElementById('save-history').addEventListener('click', () => {
            // Save match history logic
            saveMatchHistory(username, playerScore, computerScore);
        });

        document.getElementById('restart-game').addEventListener('click', () => {
            // Restart game
            window.location.href = 'welcome.html';
        });

        document.getElementById('view-history').addEventListener('click', () => {
            // Show match history logic
            viewMatchHistory();
        });
    }

    function saveMatchHistory(username, playerScore, computerScore) {
        // Implement saving logic here
        // This could involve sending data to a server or saving to local storage
        console.log('Saving match history...', { username, playerScore, computerScore });
    }

    function viewMatchHistory() {
        // Implement viewing logic here
        // This could involve displaying saved match history from local storage or a server
        console.log('Viewing match history...');
    }

    // Start game when page loads
    startGame();
});
