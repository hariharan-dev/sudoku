import { Sudoku } from "./sudoku";
import { Cell } from "./cell";
import { SUDOKU_PAIRS } from "./input";
import { of, Observable } from "rxjs";

export class Game {
  completedSudoku: Sudoku; // an helper sudoku to quickly compare and also useful for hinting
  playerSudoku: Sudoku;
  selectedKey: number;
  selectedCell: Cell;
  showErrors = true;
  eraseMode = false;
  hintMode = false;
  timer: number = 0;
  isPaused = false;
  timerRef;

  constructor() {
    let random = Math.floor(Math.random() * (4 - 0 + 1) + 0); // generates a random number between 0 to 4
    this.completedSudoku = new Sudoku(SUDOKU_PAIRS[random][0]);
    this.playerSudoku = new Sudoku(SUDOKU_PAIRS[random][1]);
    this.startTimer();
  }

  startTimer() {
    this.timerRef = setInterval(() => this.timer++, 1000);
    this.isPaused = false;
  }

  restartGameIfPaused() {
    if (this.isPaused) {
      this.startTimer();
    }
  }

  pauseTimer() {
    this.isPaused = true;
    clearInterval(this.timerRef);
  }

  setSelectedKey(key) {
    this.selectedKey = Number(key);
  }

  toggleEraseMode() {
    this.eraseMode = !this.eraseMode;
    this.hintMode = false;
    this.restartGameIfPaused();
  }

  toggleHintMode() {
    this.hintMode = !this.hintMode;
    this.eraseMode = false;
    this.restartGameIfPaused();
  }

  toggleShowErrors() {
    this.showErrors = !this.showErrors;
    this.restartGameIfPaused();
  }

  get gameTime(): Observable<String> {
    let sec = this.timer % 60;
    let min = Math.floor(this.timer / 60);
    if (min < 1) {
      return of(`${sec} s`);
    }
    return of(`${min} min ${sec} s`);
  }
}
