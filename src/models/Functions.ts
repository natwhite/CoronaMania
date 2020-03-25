export class Functions {
  public static getNumberBetween = (start: number, end: number) => {
    return Math.floor(Math.random() * (end - start) + start);
  };

  public static getRandomColor() {
    return [
      Functions.getNumberBetween(0, 255),
      Functions.getNumberBetween(0, 255),
      Functions.getNumberBetween(0, 255)
    ];
  }
}
