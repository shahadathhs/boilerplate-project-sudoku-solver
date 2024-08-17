const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { suite, test } = require('mocha');
let solver;

suite('Unit Tests', () => {
  // Initialize the solver instance
  beforeEach(() => {
    solver = new Solver();
  });

  // #1
  test('Logic handles a valid puzzle string of 81 characters', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.validate(puzzle);
    assert.equal(outPut.valid, true);
  })

  // #2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.AB.';
    const outPut = solver.validate(puzzle);
    assert.equal(outPut.error, 'Invalid characters in puzzle');
  })

  // #3
  test('Logic handles a puzzle string that is not 81 characters long', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.8';
    const outPut = solver.validate(puzzle);
    assert.equal(outPut.error, 'Expected puzzle to be 81 characters long');
  })

  // #4
  test('Logic handles a valid row placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkRowPlacement(puzzle, 'A', 1, 3);
    assert.equal(outPut, true);
  })

  // #5
  test('Logic handles an invalid row placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkRowPlacement(puzzle, 'A', 1, 5);
    assert.equal(outPut, false);
  })

  // #6
  test('Logic handles a valid column placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkColPlacement(puzzle, 'A', 1, 5);
    assert.equal(outPut, true);
  })

  // #7
  test('Logic handles an invalid column placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkColPlacement(puzzle, 'A', 1, 3);
    assert.equal(outPut, false);
  })

  // #8
  test('Logic handles a valid region (3x3 grid) placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkRegionPlacement(puzzle, 'A', 1, 3);
    assert.equal(outPut, true);
  })

  // #9
  test('Logic handles an invalid region (3x3 grid) placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const outPut = solver.checkRegionPlacement(puzzle, 'A', 1, 5);
    assert.equal(outPut, false);
  })

  // #10
  test('Valid puzzle strings pass the solver', function() {
    const puzzle = '534678912672195348198342567859761423426853791713429564961537284287419635346286179';
    const outPut = solver.solve(puzzle);
    // This puzzle is fully solved; it should return itself or the same solution
    assert.deepEqual(outPut, puzzle);
  });

  // #11
  test('Invalid puzzle strings fail the solver', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    const outPut = solver.solve(puzzle);
    assert.equal(outPut.error, ('Puzzle cannot be solved or invalid'));
  })

  // #12
  test('Solver returns the expected solution for an incomplete puzzle', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const outPut = solver.solve(puzzle);
    assert.deepEqual(outPut, expectedSolution);
  });
});
