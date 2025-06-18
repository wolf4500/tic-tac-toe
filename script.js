// Creating the gameboard for tic-tac-toe
function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (i = 0; i < rows; i++) {
        board[i] = []
        for (j = 0; j < columns; j++) {
            board[i].push("");
        }
    }

    // Insert current player's symbol into the selected cell (row, column)
    const insert = (row, column, symbol) => {
        board[row][column] = symbol;
    }

    const getBoard = () => board;
    return {getBoard, insert};
}

// Controls the flow of the game.
function gameController (playerOneName = "Player One", playerTwoName = "Player Two") {
    // Create a gameBoard() instance
    const board = gameBoard();

    // object to store player 1 and player 2 info
    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
            symbol: "O"
        }
    ];

    // Sets default player to player 1
    let currentPlayer = players[0];

    // Select message so text content can be added
    const message = document.querySelector(".message");

    // Switches the player 
    const switchPlayer = () => {
        if (currentPlayer == players[0]) {
            currentPlayer = players[1];
            message.textContent = `${currentPlayer.name}'s Turn`;
        }
        else {
            currentPlayer = players[0];
            message.textContent = `${currentPlayer.name}'s Turn`;
        }
    }

    // Reset game if yes, close modal and take no action if no
    const modal = document.querySelector(".modal");
    const modalYes = document.querySelector(".modal-yes");
    const modalNo = document.querySelector(".modal-no")
    modalYes.addEventListener("click", () => {
        reset();
        modal.close();
    })

    modalNo.addEventListener("click", () => {
        modal.close();
    })

    // Checks if current player has won the game.
    // If game is won, set message display to win message and open modal.
    const winCheck = () => {
        const actualBoard = board.getBoard();
        const winMessage = `${currentPlayer.name} Has Won!`;

        // Check rows
        for (let i = 0; i < 3; i++) {
            if (actualBoard[i][0] == currentPlayer.symbol 
                && actualBoard[i][1] == currentPlayer.symbol 
                && actualBoard[i][2] == currentPlayer.symbol) {
                message.textContent = winMessage;
                modal.showModal();
                return true;
            }
        }

        // Check columns
        for (let j = 0; j < 3; j++) {
            if (actualBoard[0][j] == currentPlayer.symbol 
                && actualBoard[1][j] == currentPlayer.symbol 
                && actualBoard[2][j] == currentPlayer.symbol) {
                message.textContent = winMessage;
                modal.showModal();
                return true;
            }
        }

        // check diagonals
        if ((actualBoard[0][0] == currentPlayer.symbol 
            && actualBoard[1][1] == currentPlayer.symbol
            && actualBoard[2][2] == currentPlayer.symbol) ||
            (actualBoard[0][2] == currentPlayer.symbol
            && actualBoard[1][1] == currentPlayer.symbol
            && actualBoard[2][0] == currentPlayer.symbol)) {
                message.textContent = winMessage;
                modal.showModal();
                return true;
            }
        return false;
    }

    // Fills a selected cell with the current player's symbol
    const fillSquare = (row, column) => {
        board.insert(row, column, currentPlayer.symbol);
    }

    const grid = document.querySelector(".grid");

    // Flag to indicate if the game has been won
    let gameOver = false;

    // Plays a single round and switches the player 
    const playRound = (row, column) => {
        // Insert symbol into selected cell
        fillSquare(row, column);

        // If the current round ends in a win, halt game.
        if (winCheck()) {
            gameOver = true;
            grid.style.cursor = "default";
            return;
        }

        switchPlayer();
    }

    const cells = document.querySelectorAll(".cell");
    const reset = () => {
        // Resets text content for each cell
        cells.forEach(cell => 
        {
            cell.style.cursor = "pointer";
            cell.textContent = "";
        })

        // Resets the gameboard array
        const boardArray = board.getBoard();
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                boardArray[i][j] = "";
            }
        }

        // Set current player to player 1
        currentPlayer = players[0];

        // Reset message display
        message.textContent = `${currentPlayer.name}'s Turn`;

        // Sets game status to ongoing
        gameOver = false;

    }

    const getPlayer = () => currentPlayer;
    const gameStatus = () => gameOver;

    return {playRound, getPlayer, gameStatus, reset};
}

const game = gameController();
const board = document.querySelector(".grid");

// Event delegation on the board element to play a round 
// based on the clicked cell. Only execute if cell
// is empty and game is ongoing.
board.addEventListener("mousedown", (event) => {
    cell = event.target;
    if (cell.classList.contains("cell") 
        && cell.textContent.length < 1 
        && game.gameStatus() == false) {
        cell.style.cursor = "default";
        row = Number(cell.dataset.row);
        column = Number(cell.dataset.column);

        if (game.getPlayer().symbol == "X") {
            cell.textContent = "X";
            cell.style.color = "blue";
        }

        if (game.getPlayer().symbol == "O"){
            cell.textContent = "O";
            cell.style.color = "red";
        }

        game.playRound(row, column);
    }
})

const reset = document.querySelector(".reset");

reset.addEventListener("click", () => {
    game.reset();
})