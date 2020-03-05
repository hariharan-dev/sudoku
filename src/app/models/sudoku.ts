import { Cell } from "./cell";

export class Sudoku {
  rows: {
    isSatisfied: boolean;
    cols: Cell[];
  }[] = [];
  constructor(inputSudoku) {
    // builds up sudoku from  input
    for (let key in inputSudoku) {
      this.rows[key] = {
        isSatisfied: false, // no row is completely filled for any sudoku in beginning
        cols: []
      };
      inputSudoku[key].forEach(eachCell => {
        this.rows[key].cols.push(new Cell(eachCell));
      });
    }
  }

  eraseValue(row: number, col: number) {
    this.rows[row].cols[col].eraseValue();
    // makes row`s status dissatisfied when an input is erased
    this.rows[row].isSatisfied = false;
  }

  /**
   * Whenever a value is updated we check that row`s validity and
   * update it`s status
   * @param row
   * @param col
   * @param value
   * @param completedSudoku
   */
  updateValue(
    row: number,
    col: number,
    value: number,
    completedSudoku: Sudoku
  ) {
    this.rows[row].cols[col].updateValue(value);
    // updates row`s status everytime an input is given to it
    this.rows[row].isSatisfied = true;
    for (let colIndex in completedSudoku.rows[row].cols) {
      if (this.rows[row].cols[colIndex].isPredefined) {
        // skips the check if the cell is predefined one
        continue;
      }
      if (
        this.rows[row].cols[colIndex].value !==
        completedSudoku.rows[row].cols[colIndex].value
      ) {
        this.rows[row].isSatisfied = false;
        break;
      }
    }
  }

  /**
   * Checks whether all rows are valid
   */
  validateSudoku() {
    for (let row in this.rows) {
      if (!this.rows[row].isSatisfied) {
        return false;
      }
    }
    return true;
  }
}
