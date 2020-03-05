export class Cell {
  value: number;
  isPredefined: boolean;
  constructor(input) {
    this.value = input.value;
    this.isPredefined = input.isPredefined ? input.isPredefined : false;
  }

  get isFilled() {
    if (this.value) {
      return true;
    }
    return false;
  }

  eraseValue() {
    if (this.isPredefined) {
      return;
    }
    this.value = undefined;
  }

  updateValue(value) {
    if (this.isPredefined) {
      return;
    }
    this.value = value;
  }
}
