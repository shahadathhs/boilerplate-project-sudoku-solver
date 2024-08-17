class SudokuSolver {
  validate(puzzleString) {
    //Check if puzzleString is 81 characters long
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    //Check if each character is a digit from 1 to 9 or a period
    if (!/^[1-9.]*$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.convertPuzzleToGrid(puzzleString);
    const rowIndex = row.charCodeAt(0) - 65;

    for (let col = 0; col < 9; col++) {
      if (grid[rowIndex][col] === value && col !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.convertPuzzleToGrid(puzzleString);
    const colIndex = column - 1;

    for (let ro = 0; ro < 9; ro++) {
      if (grid[ro][colIndex] === value && ro !== row.charCodeAt(0) - 65) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.convertPuzzleToGrid(puzzleString);
    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = column - 1;
    const regionStartRow = Math.floor(rowIndex / 3) * 3;
    const regionStartCol = Math.floor(colIndex / 3) * 3;

    for (let ro = 0; ro < 3; ro++) {
      for (let col = 0; col < 3; col++) {
        if (
          grid[regionStartRow + ro][regionStartCol + col] === value &&
          (regionStartRow + ro !== rowIndex ||
            regionStartCol + col !== colIndex)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let grid = this.convertPuzzleToGrid(puzzleString);
    if (!this.solveSudoku(grid)) {
      return { error: "Puzzle cannot be solved" };
    }
    return this.convertGridToPuzzle(grid);
  }

  // helper function to convert a puzzle string into grid (2D array)
  convertPuzzleToGrid(puzzleString) {
    let grid = [];

    for (let i = 0; i < 81; i += 9) {
      grid.push(puzzleString.slice(i, i + 9));
    }

    return grid;
  }

  // helper function to convert a grid (2D array) into a puzzle string
  convertGridToPuzzle(grid) {
    return grid.map((row) => row.join("")).join("");
  }

  // recursive function to solve the puzzle
  solveSudoku(grid) {
    // Loop through each cell in the 9x9 grid
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // Check if the current cell is empty (represented by '.')
        if (grid[row][col] === ".") {
          // Try each number from 1 to 9
          for (let num = 1; num <= 9; num++) {
            // Check if placing 'num' in the current cell is valid
            if (
              this.checkRowPlacement(grid, row, col, num) &&
              this.checkColPlacement(grid, row, col, num) &&
              this.checkRegionPlacement(grid, row, col, num)
            ) {
              // If valid, place 'num' in the current cell
              grid[row][col] = num;

              // Recursively attempt to solve the rest of the grid
              if (this.solveSudoku(grid)) {
                // If the recursive call returns true, the grid is solved
                return true;
              }

              // If the recursive call returns false, backtrack by removing 'num'
              grid[row][col] = ".";
            }
          }
          // If no number from 1 to 9 is valid, return false to backtrack
          return false;
        }
      }
    }
    // If all cells are filled correctly, return true indicating the grid is solved
    return true;
  }
}

module.exports = SudokuSolver;
