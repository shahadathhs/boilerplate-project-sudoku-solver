'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  
  // route to check if puzzle is valid
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (typeof puzzle !== 'string' || typeof coordinate !== 'string' || typeof value !== 'string') {
        return res.json({error: 'Invalid input type'});
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (!/^[1-9.]*$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0];
      const col = parseInt(coordinate[1]);

      const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
      const colValid = solver.checkColPlacement(puzzle, row, col, value);
      const regValid = solver.checkRegionPlacement(puzzle, row, col, value);
      const valid = rowValid && colValid && regValid;

      let conflict = '';

      if (!rowValid) conflict += 'row ';
      if (!colValid) conflict += 'column ';
      if (!regValid) conflict += 'region ';

      return res.json({ valid, conflict });
    });
  
  // route to solve a puzzle
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (typeof puzzle !== 'string') {
        return res.json({ error: 'Invalid input type' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (!/^[1-9.]*$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const solution = solver.solve(puzzle);
      if(solution.error) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });
    });
};
