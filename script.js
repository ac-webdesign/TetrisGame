

const board = document.getElementById('game-board');
const numRows = 20;
const numCols = 10;
let grid = Array.from({ length: numRows }, () => Array(numCols).fill(0));
let scoreGame=0;


function drawBoard() {
  let html = '';
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === 1) {
        html += '<div class="block"></div>';
      } else {
        html += '<div class="empty"></div>';
      }
    }
  }
  board.innerHTML = html;
}

const tetrominoes = [
    // I Tetromino
     [
       [1, 1, 1, 1]
       
     ],
    // T Tetromino
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    // L Tetromino
    [
      [1, 0, 0],
      [1, 1, 1]
    ],
    // J Tetromino
    [
      [0, 0, 1],
      [1, 1, 1]
    ],
    // O Tetromino
    [
      [1, 1],
      [1, 1]
    ],
    // S Tetromino
    [
      [0, 1, 1],
      [1, 1, 0]
    ],
    // Z Tetromino
    [
      [1, 1, 0],
      [0, 1, 1]
    ]
  ];
  
function getRandomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  }
  
  let currentTetromino = getRandomTetromino();
  let currentRow = 0;
  let currentCol = Math.floor(numCols / 2) - 1;
  let intervalId;


function drawTetromino() {
    // Calculate the top-left corner position of the tetromino on the grid
    const startRow = Math.max(0, currentRow);
    const startCol = Math.max(0, currentCol);
    clearFullLines();
    currentTetromino.forEach((row, i) => {
      console.log(`row = ${row}`)
      row.forEach((cell, j) => {
        if (cell === 1) {
          grid[startRow + i][startCol + j] = 1;
        }
        
      });
    });
    
  }

function removeTetromino() {
  currentTetromino.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        grid[currentRow + i][currentCol + j] = 0;
      }
    });
  });
}
document.getElementById("startButton").addEventListener("click", function(){
  document.getElementById("startButton").style.display="none";
  document.getElementById("stop-btn").style.display="block";
  drawTetromino();
  drawBoard();
  intervalId = setInterval(moveTetrominoDown, 1000);
  
})

// Update the board after drawing the tetromino

function checkCollision(tetromino, row, col) {
  console.log(tetromino);
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {

      if (tetromino[i][j] === 1) {
        const nextRow = row + i;
        const nextCol = col + j;
        // Check if the next position is beyond the left or right boundary of the grid
        if (nextCol < 0 || nextCol >= 10) {
          console.log('xtypise tixo')
          return true;
        }

        // Check if there's already a block at the next position
        if (nextRow < 0 || nextRow >= numRows || grid[nextRow][nextCol] === 1) {
          return true;
        }
      }
    }
  }

  return false;
}

function moveTetrominoLeft() {
    if (checkCollision(currentTetromino, currentRow, currentCol - 1)) {
      
      if(currentCol>0){
        removeTetromino();
        console.log(currentCol);
        currentCol--;
        drawTetromino();
        drawBoard();

      }
       // Update the board after moving the tetromino
    }
    else if(!(checkCollision(currentTetromino, currentRow, currentCol - 1))){
      if(currentCol>0){
        removeTetromino();
        console.log(currentCol);
        currentCol--;
        drawTetromino();
        drawBoard();

      }
    }
   
  }
  
function moveTetrominoRight() {
    // Check if moving right would cause a collision
    if ((checkCollision(currentTetromino, currentRow, currentCol + 1))) {
        // If moving right does not cause a collision and the current column is less than 8
        // (to prevent the tetromino from moving beyond the right boundary)
        if (currentCol < numCols - currentTetromino[0].length) {
            // Remove the tetromino from its current position
            removeTetromino();
            
            // Update the current column to move right
            currentCol++;
            console.log(currentCol);
            
            // Draw the tetromino at its new position
            drawTetromino();
            
            // Redraw the board to reflect the changes
            drawBoard();
        }
      }
        else if(!(checkCollision(currentTetromino, currentRow, currentCol + 1))){
          if (currentCol < numCols - currentTetromino[0].length) {
            // Remove the tetromino from its current position
            removeTetromino();
            
            // Update the current column to move right
            currentCol++;
            console.log(currentCol);
            
            // Draw the tetromino at its new position
            drawTetromino();
            
            // Redraw the board to reflect the changes
            drawBoard();
        }
    }
}

function moveTetrominoDown() {

        const tetrominoHeight = currentTetromino.length;
        if (currentRow + tetrominoHeight < numRows) { // Check if there's space below
                removeTetromino(); // Remove tetromino from current position
                currentRow++; // Move tetromino down
                if (!checkCollision(currentTetromino, currentRow, currentCol)) { // Check for collision
                        drawTetromino(); // Draw tetromino in new position
                        drawBoard(); // Update the board
                } 
                else {
                  

                        clearInterval(intervalId); // Stop the current interval
                        intervalId = null;
                        console.log('Collapsed');
                        updateGrid(); // Update the grid with the collapsed tetromino
                        currentTetromino = getRandomTetromino(); // Spawn a new tetromino
                        currentRow = 0; // Reset currentRow
                        currentCol = Math.floor(numCols / 2) - 1; // Reset currentCol
                        checkGameOver(); // Check if the game is over

                        drawTetromino();

                        drawBoard();
                        intervalId = setInterval(moveTetrominoDown, 1000); // Start a new interval for the new tetromino
                        }
                } 
          else {

                clearInterval(intervalId); // Clear the interval
                intervalId = null;
                currentTetromino = getRandomTetromino(); // Spawn a new tetromino
                currentRow = 0; // Reset currentRow
                currentCol = Math.floor(numCols / 2) - 1; // Reset currentCol
                drawTetromino();
                drawBoard();
                intervalId = setInterval(moveTetrominoDown, 1000); // Start a new interval
              }
}

let score=0;

function clearFullLines() {
  let linesCleared = 0; // Counter to keep track of the number of lines cleared

  for (let i = 0; i < numRows; i++) {
    // Check if all cells in the current row are filled
    if (grid[i].every(cell => cell === 1)) {
      // Remove the current row from the grid
      grid.splice(i, 1);

      // Add a new empty row at the top of the grid
      grid.unshift(Array(numCols).fill(0));

      linesCleared++; // Increment the lines cleared counter
      i--; // Decrement i to recheck the new row at the same index
    }
  }

  if (linesCleared === 1) {
    score += 3;
    updateScore(); 
    console.log('mia grammoula');// Increment by 3 points for single line cleared
} else if (linesCleared === 2) {
    score += 8;
    updateScore();
     // Increment by 8 points for double lines cleared
}else if (linesCleared === 3) {
  score += 14;
  updateScore();
}
else if (linesCleared === 4) {
    score += 20;
    updateScore();
  }
}

function updateGrid() {
  let stopRow = currentRow - 1; // Previous row before the collision
  currentTetromino.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        const gridRow = stopRow + i;
        const gridCol = currentCol + j;
        if (gridRow >= 0 && gridRow < numRows && gridCol >= 0 && gridCol < numCols) {
          grid[gridRow][gridCol] = 1;
        }
      }
    });
  });
}

function rotateTetromino() {
    const rotatedTetromino = currentTetromino[0].map((_, colIndex) =>
      currentTetromino.map(row => row[colIndex]).reverse()
    );
    if (checkCollision(rotatedTetromino, currentRow, currentCol)) {
      removeTetromino();
      currentTetromino = rotatedTetromino;
      drawTetromino();
      drawBoard(); // Update the board after rotating the tetromino
    }
  }
  
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowLeft':
        moveTetrominoLeft();
        break;
      case 'ArrowRight':
        moveTetrominoRight();
        break;
      case 'ArrowDown':
        moveTetrominoDown();
        break;
      case 'ArrowUp':
        rotateTetromino();
        break;
    }
  });
  
function stop() {
    // Your termination action goes here
    clearInterval(intervalId); // Example: Clear an interval
}


function updateScore() {
  // Update the score display
  // Replace 'score-display' with the id of the element where you want to display the score
  document.getElementById('score-display').innerText = `Score: ${score}`;

}


function checkGameOver() {
  console.log('Checking for game over..');

  // Create a copy of the current tetromino
  const tempTetromino = currentTetromino.slice();

  // Calculate the top-left corner position of the tetromino on the grid
  const startRow = 0; // Tetromino starts at the top
  const startCol = Math.floor(numCols / 2) - 1; // Tetromino starts at the middle column

  // Check for collision at the initial position
  if (checkCollision(tempTetromino, startRow, startCol)) {
      // Game over
      alert('Game Over');
      clearInterval(intervalId); // Stop the game loop
      intervalId = null;
      return;
      
      // Optionally, you can display a message or perform other game over actions here
  }
}
  // PROBLEMS MUST SOLVE
  // LEFT - RIGHT BOUNDARIES ok!
  // LINE TETROMINO SEPERATE IF STATEMENT
  // CLEAR LINE ok!
  // GAMEOVER ok!
  // SCORE ok!
  // DESIGN  ok!

