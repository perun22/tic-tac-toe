// create a board

function Gameboard() {
  const board = [];

  for (let i = 0; i <= 2; i++) {
    board[i] = [];
    for (let j = 0; j <= 2; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMark = (row, col, token) => {
    if (board[row][col].getValue()) {
      return false;
    } else {
      board[row][col].addMark(token);
      return true;
    }
  };

  const printBoard = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };

  const resetBoard = () => {
    for (let i = 0; i <= 2; i++) {
      board[i].forEach((cell) => {
        cell.resetCell();
      });
    }
  };

  return { getBoard, placeMark, printBoard, resetBoard };
}

function Cell() {
  let value = "";

  const addMark = (player) => {
    value = player;
  };

  const resetCell = () => {
    value = "";
  };

  const getValue = () => value;

  return { addMark, getValue, resetCell };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const setNames = (name1, name2) => {
    players[0].name = name1 || "Player One";
    players[1].name = name2 || "Player Two";
  };

  const checkWinner = (row, col) => {
    const cells = board.printBoard();

    if (
      cells[row][col] === cells[0][0] &&
      cells[row][col] === cells[1][1] &&
      cells[row][col] === cells[2][2]
    ) {
      return true;
    }

    if (
      cells[row][col] === cells[0][2] &&
      cells[row][col] === cells[1][1] &&
      cells[row][col] === cells[2][0]
    ) {
      return true;
    }

    if (cells[row].every((value) => value === activePlayer.token)) {
      return true;
    }

    const columns = [cells[0][col], cells[1][col], cells[2][col]];
    if (columns.every((value) => value === activePlayer.token)) {
      return true;
    }
    return false;
  };

  const checkDraw = () => {
    const currentBoard = board.getBoard();

    return currentBoard.every((row) =>
      row.every((cell) => cell.getValue() !== ""),
    );
  };

  const printNewRound = () => {
    board.printBoard();
  };

  let gameOver = false;
  let gameUpdates = `It's ${activePlayer.name}'s turn`;

  const getGameOver = () => gameOver;
  const getGameUpdates = () => gameUpdates;

  const playRound = (row, col) => {
    if (gameOver) return;

    const nextMove = board.placeMark(row, col, getActivePlayer().token);

    if (!nextMove) {
      return false;
    } else if (checkWinner(row, col)) {
      gameOver = true;
      gameUpdates = `${activePlayer.name} wins!`;
      return true;
    } else if (checkDraw()) {
      gameOver = true;
      gameUpdates = `It's a tie!`;
      return true;
    } else {
      switchPlayerTurn();
      gameUpdates = `It's ${activePlayer.name}'s turn`;
    }
  };

  printNewRound();

  const resetGame = () => {
    board.resetBoard();
    gameOver = false;
    activePlayer = players[0];
    gameUpdates = `It's ${activePlayer.name}'s turn`;
  };

  return {
    playRound,
    setNames,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWinner,
    checkDraw,
    getGameOver,
    getGameUpdates,
    resetGame,
  };
}

function ScreenController() {
  const playerTurnDiv = document.querySelector(".message");
  const boardDiv = document.querySelector(".board");

  const game = GameController();

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();

    playerTurnDiv.textContent = game.getGameUpdates();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickBoard);

  const startBtn = document.getElementById("start-btn");

  const playerOne = document.getElementById("player-one");
  const playerTwo = document.getElementById("player-two");
  startBtn.addEventListener("click", () => {
    game.setNames(playerOne.value, playerTwo.value);
    game.getGameUpdates;
    game.resetGame();
    updateScreen();
  });
  const resetInputs = () => {
    playerOne.value = "";
    playerTwo.value = "";
  };
  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => {
    game.resetGame();
    resetInputs();
    updateScreen();
  });

  updateScreen();
}

ScreenController();
