const board = document.getElementById("board");
const winScreen = document.getElementById("winScreen");
const finalMovesLabel = document.getElementById("finalMoves");
const starContainer = document.getElementById("stars");

let moves = 0;
let positions = []; // Current state of the board

// Helper: Correct background positions for 3x3 grid
const getBgPos = (val) => {
  const row = Math.floor((val - 1) / 3);
  const col = (val - 1) % 3;
  return `${-col * 100}% ${-row * 100}%`;
};

function initGame() {
  moves = 0;
  winScreen.style.display = "none";

  // Generate a solvable shuffle (Fisher-Yates + Inversion Check)
  let solvable = false;
  while (!solvable) {
    positions = [1, 2, 3, 4, 5, 6, 7, 8, null].sort(() => Math.random() - 0.5);
    solvable = isSolvable(positions);
  }
  render();
}

function isSolvable(arr) {
  let inversions = 0;
  const flat = arr.filter((n) => n !== null);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

function render() {
  board.innerHTML = "";
  positions.forEach((val, idx) => {
    const tile = document.createElement("div");
    if (val === null) {
      tile.className = "emtile";
    } else {
      tile.className = "tile";
      tile.innerText = val;
      tile.style.backgroundPosition = getBgPos(val);
      tile.onclick = () => moveTile(idx);
    }
    board.appendChild(tile);
  });
}

function moveTile(idx) {
  const emptyIdx = positions.indexOf(null);
  const neighbors = getNeighbors(emptyIdx);

  if (neighbors.includes(idx)) {
    moves++;
    [positions[idx], positions[emptyIdx]] = [
      positions[emptyIdx],
      positions[idx],
    ];
    render();
    checkWin();
  }
}

function getNeighbors(idx) {
  const neighbors = [];
  if (idx % 3 > 0) neighbors.push(idx - 1); // Left
  if (idx % 3 < 2) neighbors.push(idx + 1); // Right
  if (idx - 3 >= 0) neighbors.push(idx - 3); // Top
  if (idx + 3 < 9) neighbors.push(idx + 3); // Bottom
  return neighbors;
}

function checkWin() {
  const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
  if (positions.every((val, i) => val === winState[i])) {
    showWinScreen();
  }
}

function showWinScreen() {
  winScreen.style.display = "flex";
  finalMovesLabel.innerText = moves;

  let stars = 0;
  if (moves < 50) stars = 3;
  else if (moves < 100) stars = 2;
  else stars = 1;

  starContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const active = i < stars ? "active" : "";
    starContainer.innerHTML += `<svg class="${active}" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>`;
  }
}

initGame();
