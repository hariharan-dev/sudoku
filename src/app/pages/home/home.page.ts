import { Component, ViewEncapsulation } from "@angular/core";
import { Game } from "src/app/models/game";
import { Cell } from "src/app/models/cell";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  game: Game = new Game();
  oldSelectedRow: number;
  oldSelectedCol: number;

  constructor() {}

  get playerSudokuRows() {
    return Object.keys(this.game.playerSudoku.rows);
  }

  keyListener(event) {
    const targetId: string = event.target.id;
    if (!targetId.startsWith("key")) {
      return;
    }
    let keypad = targetId.split("-")[1];
    this.game.setSelectedKey(keypad);
  }

  cellListener(event) {
    const targetId: string = event.target.id;
    if (!targetId.startsWith("cell")) {
      return;
    }
    let [, row, col] = targetId.split("-");
    this.handleCellClick(Number(row), Number(col));
  }

  /**
   * Meta cell click event handler.
   * Highlights necessary cells whenever a cell is clicked.
   * After that,
   * 1. If the clicked cell is prepopulated one, then ignores the does nothing.
   * If the clicked cell is not prepopulated one, then
   * 1. If erase mode is turned on then erases the cell.
   * 2. If hint more is turned on then adds correct value for that cell and checks whether game is solved.
   * 3. Adds the selected key as value for that cell and checks whether game is solved.
   * @param row
   * @param col
   */
  handleCellClick(row: number, col: number) {
    let sudokuCell: Cell = this.game.playerSudoku.rows[row].cols[col];
    this.highlightCells(row, col);
    if (sudokuCell.isPredefined) {
      return;
    }
    if (this.game.eraseMode) {
      this.game.playerSudoku.eraseValue(row, col);
      return;
    }
    if (this.game.hintMode) {
      this.game.playerSudoku.updateValue(
        row,
        col,
        this.game.completedSudoku.rows[row].cols[col].value,
        this.game.completedSudoku
      );
      this.isGameSolved();
      return;
    }
    this.setPlayerSelectedValue(row, col);
  }

  setPlayerSelectedValue(row: number, col: number) {
    if (!this.game.selectedKey) {
      alert("Select a key from keypad");
      return;
    }
    this.game.playerSudoku.updateValue(
      row,
      col,
      this.game.selectedKey,
      this.game.completedSudoku
    );
    this.isGameSolved();
  }

  isGameSolved() {
    setTimeout(() => {
      if (this.game.playerSudoku.validateSudoku()) {
        this.game.gameTime.subscribe(data => {
          alert("Wohoo! You solved it in " + data);
          this.newGame();
        });
      }
    });
  }

  newGame() {
    this.game = new Game();
  }

  /**
   * Removes old highlights and add news highlights
   * @param row
   * @param col
   */
  highlightCells(row: number, col: number) {
    if (this.oldSelectedRow !== undefined) {
      this.colorifyBlock(
        this.findSquares(this.oldSelectedRow),
        this.findSquares(this.oldSelectedCol),
        "white"
      );
      this.colorifyRow(this.oldSelectedRow, "white");
      this.colorifyCol(this.oldSelectedCol, "white");
      this.colorifyCell(row, col, "white");
    }
    this.colorifyBlock(this.findSquares(row), this.findSquares(col), "#e2e7ed");
    this.colorifyRow(row, "#e2e7ed");
    this.colorifyCol(col, "#e2e7ed");
    this.colorifyCell(row, col, "#bbdefb");
    this.oldSelectedRow = row;
    this.oldSelectedCol = col;
  }

  /**
   * Finds position for coloring blocks
   * @param position
   */
  findSquares(position) {
    if (0 <= position && position <= 2) {
      return [0, 1, 2];
    }
    if (3 <= position && position <= 5) {
      return [3, 4, 5];
    }
    return [6, 7, 8];
  }

  /**
   * colors selected cell`s 3 * 3 matrix
   * @param rows
   * @param cols
   * @param color
   */
  colorifyBlock(rows: number[], cols: number[], color) {
    rows.forEach(selectedRow => {
      cols.forEach(selectedCol => {
        this.colorifyCell(selectedRow, selectedCol, color);
      });
    });
  }

  /**
   * Colors selected cells entire row
   * @param selectedRow
   * @param color
   */
  colorifyRow(selectedRow, color) {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(selectedCol => {
      this.colorifyCell(selectedRow, selectedCol, color);
    });
  }

  /**
   * Colors selected cells entire cpl
   * @param selectedRow
   * @param color
   */
  colorifyCol(selectedCol, color) {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(selectedRow => {
      this.colorifyCell(selectedRow, selectedCol, color);
    });
  }

  colorifyCell(row, col, color) {
    let elColor = document.getElementById(`cell-${row}-${col}`).style
      .backgroundColor;
    if (elColor === color) {
      // ignores repainting the same
      return;
    }
    document.getElementById(`cell-${row}-${col}`).style.backgroundColor = color;
  }
}
