document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-game');
    const usernameInput = document.getElementById('username');

    // Disable Play Game button if username is empty
    usernameInput.addEventListener('input', () => {
        playButton.disabled = usernameInput.value.trim() === '';
    });

    // Start game on clicking Play Game button
    playButton.addEventListener('click', () => {
        // Store username in localStorage to access in game.html
        localStorage.setItem('username', usernameInput.value.trim());
        // Redirect to game page
        window.location.href = 'game.html';
    });

    // Show instructions
    const instructions = document.getElementById('instructions');
    const instructionsBtn = document.getElementById('instructions-btn');
    const closeInstructionsBtn = document.getElementById('close-instructions');

    instructionsBtn.addEventListener('click', () => {
        instructions.classList.remove('hidden');
    });

    closeInstructionsBtn.addEventListener('click', () => {
        instructions.classList.add('hidden');
    });
});
