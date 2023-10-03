let currentPlayer = "X"; // Người chơi hiện tại, bắt đầu là X
let isGameOver = false;
let board;
let currentDisplay;
let numRow;
let newCol;
let selectedMode = "2Players";
let selectedLevel = "Easy";
let SCORE_BOT;
let SCORE_PLAYER;
let lineWin;

document.addEventListener("DOMContentLoaded", function () {
  board = document.getElementById("caro-board");

  currentDisplay = document.getElementById("current-player");

  document.getElementById("playerMode").addEventListener("change", function () {
    selectedMode = document.getElementById("playerMode").value;

    if (selectedMode === "2Players") {
      document.getElementsByClassName("level-container")[0].style.visibility =
        "hidden";
    } else {
      document.getElementsByClassName("level-container")[0].style.visibility =
        "visible";
      document.getElementById("level").selectedIndex = 0;
      selectedLevel = "Easy";
    }

    resetBoard();
  });

  document.getElementById("level").addEventListener("change", function () {
    selectedLevel = document.getElementById("level").value;
    resetBoard();
  });
});

function generateBoard(rows, cols) {
  board.innerHTML = "";
  board.style.setProperty(
    "grid-template-columns",
    "repeat(" + cols + ", 40px)"
  );
  isGameOver = false;
  currentPlayer = "X";

  currentDisplay.textContent = "Người chơi: X";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.classList.add("cell");
      cell.classList.add("empty");
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);
    }
  }
  board.style.visibility = "visible";
  currentDisplay.style.visibility = "visible";
  document.getElementById("log").style.visibility = "visible";
  document.getElementById("log").innerHTML = "";
}
function handleCellClick(event) {
  if (isGameOver) {
    return; // Không cho phép đánh khi trò chơi kết thúc
  }

  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (cell.textContent === "") {
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "red" : "blue";
    cell.classList.remove("empty");
    logLine(row, col);
    checkResult(row, col);
    if (!isGameOver && selectedMode === "vsComputer" && currentPlayer === "X") {
      currentPlayer = "O";
      let point = getPointsComputer();
      let c = getCellByRowCol(point[0], point[1]);
      c.textContent = "O";
      c.style.color = "blue";
      c.classList.remove("empty");
      logLine(point[0], point[1]);
      checkResult(point[0], point[1]);
      currentPlayer = "X";
    } else {
      togglePlayer();
    }
  }
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById(
    "current-player"
  ).textContent = `Người chơi: ${currentPlayer}`;
}

function clickCreate() {
  numRow = parseInt(document.getElementById("rows").value);
  numCol = parseInt(document.getElementById("cols").value);

  if (isNaN(numRow) || isNaN(numCol) || numRow < 1 || numCol < 1) {
    alert("Vui lòng nhập kích thước hợp lệ.");
    return;
  }

  generateBoard(numRow, numCol);
}

function resetBoard() {
  // Clear all moves on the board
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("empty");
    cell.classList.add("empty");
  });

  // Reset game variables
  currentPlayer = "X";
  currentDisplay.textContent = "Người chơi: X";
  isGameOver = false;
  document.getElementById("log").innerHTML = "";
}

function getHorizontal(x, y, player) {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (y + i < numCol && getCellByRowCol(x, y + i).textContent === player) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      y - i >= 0 &&
      y - i < numCol &&
      getCellByRowCol(x, y - i).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getVertical(x, y, player) {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (x + i < numRow && getCellByRowCol(x + i, y).textContent === player) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < numRow &&
      getCellByRowCol(x - i, y).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getRightDiagonal(x, y, player) {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < numRow &&
      y + i < numCol &&
      getCellByRowCol(x - i, y + i).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x + i < numRow &&
      y - i >= 0 &&
      y - i < numCol &&
      getCellByRowCol(x + i, y - i).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function getLeftDiagonal(x, y, player) {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < numRow &&
      y - i >= 0 &&
      y - i < numCol &&
      getCellByRowCol(x - i, y - i).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x + i < numRow &&
      y + i < numCol &&
      getCellByRowCol(x + i, y + i).textContent === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function checkWin(x, y, player) {
  lineWin = "";
  if (getHorizontal(x, y, player) >= 5) {
    lineWin = "Horizontal";
  } else if (getVertical(x, y, player) >= 5) {
    lineWin = "Vertical";
  } else if (getRightDiagonal(x, y, player) >= 5) {
    lineWin = "RightDiagonal";
  } else if (getLeftDiagonal(x, y, player) >= 5) {
    lineWin = "LeftDiagonal";
  }
  return (
    getHorizontal(x, y, player) >= 5 ||
    getVertical(x, y, player) >= 5 ||
    getRightDiagonal(x, y, player) >= 5 ||
    getLeftDiagonal(x, y, player) >= 5
  );
}

function checkDraw() {
  let cells = getEmptyCells();
  if (cells.length == 0) {
    return true;
  }
  return false;
}

function checkResult(row, col) {
  if (checkWin(row, col, currentPlayer)) {
    alert(`Người chơi ${currentPlayer} chiến thắng!`);
    isGameOver = true;
  }

  if (checkDraw()) {
    alert("Trò chơi hòa!");
    isGameOver = true;
  }
}

function getCellByRowCol(row, col) {
  return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function getEmptyCells() {
  return document.querySelectorAll(".cell.empty");
}

function getPointsComputer() {
  setScoreMap();
  let maxScore = -Infinity;
  let pointsComputer = [];
  let listScorePoint = [];
  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numCol; j++) {
      if (getCellByRowCol(i, j).textContent === "") {
        let score =
          SCORE_BOT.get(
            Math.max(
              getHorizontal(i, j, "O"),
              getVertical(i, j, "O"),
              getRightDiagonal(i, j, "O"),
              getLeftDiagonal(i, j, "O")
            )
          ) +
          SCORE_PLAYER.get(
            Math.max(
              getHorizontal(i, j, "X"),
              getVertical(i, j, "X"),
              getRightDiagonal(i, j, "X"),
              getLeftDiagonal(i, j, "X")
            ) - 1
          );
        if (maxScore <= score) {
          maxScore = score;
          listScorePoint.push({
            score: score,
            point: [i, j],
          });
        }
      }
    }
  }

  // get list max score
  for (const element of listScorePoint) {
    if (element.score === maxScore) {
      pointsComputer.push(element.point);
    }
  }
  return pointsComputer[Math.floor(Math.random() * pointsComputer.length)];
}

function setScoreMap() {
  if (selectedLevel === "Easy") {
    SCORE_BOT = SCORE_BOT_EASY;
    SCORE_PLAYER = SCORE_PLAYER_EASY;
  } else if (selectedLevel === "Medium") {
    SCORE_BOT = SCORE_BOT_MEDIUM;
    SCORE_PLAYER = SCORE_PLAYER_MEDIUM;
  } else {
    SCORE_BOT = SCORE_BOT_HARD;
    SCORE_PLAYER = SCORE_PLAYER_HARD;
  }
}
function logLine(row, col) {
  const line = document.createElement("div");
  line.textContent = `${currentPlayer}:       ${row} - ${col}`;
  document.getElementById("log").append(line);
  console.log(line);
}
