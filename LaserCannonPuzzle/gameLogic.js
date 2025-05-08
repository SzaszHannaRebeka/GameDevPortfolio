class PuzzleState {
    constructor() {
        this.position = { row: 1, col: 1 }; // Player's starting position
        this.goal = { row: 15, col: 15 };  // Goal position
        this.blockedSquares = [
            { row: 13, col: 13 },
            { row: 14, col: 6 }
        ]; // Squares the player cannot step on
        this.currentTurn = 0; // Number of moves made
        this.oddCannonColumns=[2, 5, 9, 11, 13];
        this.evenCannonColumns=[3, 8];
        this.oddCannonRows=[3, 7, 9, 11, 13];
        this.evenCannonRows=[2, 5, 8, 12];
        this.modalIsShowing=false;
    }

    // Move the player in the specified direction
    makeMove(direction) {
        if(!game.modalIsShowing){
            const { row, col } = this.position;
            let positionChanged = false;

            if (direction === "UP" && row > 1) {
                this.position.row--;
                positionChanged = true;
            }
            if (direction === "DOWN" && row < 15) {
                this.position.row++;
                positionChanged = true;
            }
            if (direction === "LEFT" && col > 1) {
                this.position.col--;
                positionChanged = true;
            }
            if (direction === "RIGHT" && col < 15) {
                this.position.col++;
                positionChanged = true;
            }

            if (positionChanged) {
                this.currentTurn++;
            }
        }
    }

    // Check if the game has ended
    gameEnd() {
        return this.won() || this.isBlocked() || this.isCanon();
    }

    // Check if the player has won
    won() {
        return this.position.row === this.goal.row && this.position.col === this.goal.col;
    }

    // Check if the player is on a blocked square
    isBlocked() {
        return this.blockedSquares.some(
            (square) => square.row === this.position.row-1 && square.col === this.position.col-1
        );
    }

    isCanon(){
        if(game.currentTurn%2 === 0) {
            if (game.evenCannonColumns.includes(game.position.col) || game.evenCannonRows.includes(game.position.row)) {
                return true;
            }
        }
        else{
            if (game.oddCannonColumns.includes(game.position.col) || game.oddCannonRows.includes(game.position.row)) {
                return true;
            }
        }
        return false;
    }
}

// Initialize the game state
const game = new PuzzleState();

// Handle player movement
function showModal(message) {
    game.modalIsShowing=true;
    const modal = document.getElementById("gameModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeModal = document.getElementById("closeModal");

    modalMessage.textContent = message;
    modal.style.display = "block";

    closeModal.onclick = () => {
        modal.style.display = "none";
        game.modalIsShowing=false;
        resetGame();
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            game.modalIsShowing=false;
            resetGame();
        }
    };
}

function play(direction) {
    game.makeMove(direction);
    console.log("Player moved", direction, "to", game.position.col, " ", game.position.row);
    console.log("Current turn:", game.currentTurn);

    updateBoard();

    if (game.gameEnd()) {
        if (game.won()) {
            showModal("‧͙⁺˚*･༓☾  You won  ☽༓･*˚⁺‧͙");
        } else {
            showModal("*✧･ﾟ:*  You lost  *:･ﾟ✧*");
        }
    }
}

// Reset the game
function resetGame() {
    game.position = { row: 1, col: 1 };
    game.currentTurn = 0;
    updateBoard();
}

// Update the board UI
function updateBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear the board

    console.log("Updating board... Current turn:", game.currentTurn);

    for (let i = 0; i < 16; i++) {
        if(i===0){
            for (let j=0; j<16; j++){
                const square = document.createElement("div");
                square.className = "square";

                square.style.backgroundColor = "black";
                square.style.border="0px";

                if(j!==0){
                    if (game.currentTurn%2 === 0) {
                        if (game.evenCannonColumns.includes(j)) {
                            square.textContent = "▼";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                        else if (game.oddCannonColumns.includes(j)) {
                            square.textContent = "△";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                    }
                    else {
                        if (game.oddCannonColumns.includes(j)) {
                            square.textContent = "▼";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                        else if (game.evenCannonColumns.includes(j)) {
                            square.textContent = "△";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                    }
                }
                board.appendChild(square);
            }
        }
        else{
            for (let j = 0; j < 16; j++) {
                const square = document.createElement("div");
                square.className = "square";

                square.style.backgroundColor = "black";

                if(j===0){
                    square.style.backgroundColor = "black";
                    square.style.border="0px";

                    if (game.currentTurn%2 === 0) {
                        if (game.evenCannonRows.includes(i)) {
                            square.textContent = "▶";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                        else if (game.oddCannonRows.includes(i)) {
                            square.textContent = "◁";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                    }
                    else {
                        if (game.oddCannonRows.includes(i)) {
                            square.textContent = "▶";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                        else if (game.evenCannonRows.includes(i)) {
                            square.textContent = "◁";
                            square.style.color = "white";
                            square.style.textAlign = "center";
                        }
                    }
                }
    
                else{
                    // Add player
                    if (i === game.position.row && j === game.position.col) {
                        square.textContent = "⊛";
                        square.style.color = "cyan";
                        square.style.textAlign = "center";
                        square.style.display = "flex"; // Enable flexbox
                        square.style.justifyContent = "center"; // Center horizontally
                        square.style.alignItems = "center"; // Center vertically
                    }
        
                    // Add blocked squares
                    if (game.blockedSquares.some((sq) => sq.row+1 === i && sq.col+1 === j)) {
                        square.style.backgroundColor = "white";
                    }
        
                    // Add goal
                    if (i === game.goal.row && j === game.goal.col) {
                        square.style.backgroundColor = "cyan";
                    }
                }
    
                board.appendChild(square);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded, initializing board...");
    updateBoard(); // Render the initial board
});

document.addEventListener("keydown", (event) => {
    let direction = null;

    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            direction = "UP";
            break;
        case "ArrowDown":
        case "s":
        case "S":
            direction = "DOWN";
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            direction = "LEFT";
            break;
        case "ArrowRight":
        case "d":
        case "D":
            direction = "RIGHT";
            break;
    }

    if (direction) {
        play(direction);
    }
});