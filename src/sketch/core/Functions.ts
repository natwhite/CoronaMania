export class Functions {
  public static getFloatBetween = (start: number, end: number) => {
    return Math.random() * (end - start) + start;
  };

  public static getNumberBetween = (start: number, end: number) => {
    return Math.floor(Functions.getFloatBetween(start, end));
  };

  public static getRandomColor() {
    return [
      Functions.getNumberBetween(0, 255),
      Functions.getNumberBetween(0, 255),
      Functions.getNumberBetween(0, 255)
    ];
  }

  public static lerp(start: number, stop: number, amt: number) {
    return (stop - start) * amt + start;
  }

  public static constrain(num: number, min: number, max: number) {
    const large = Math.max(min, max);
    const small = Math.min(min, max);
    return num < small ? small : num > large ? large : num;
  }

  public static sigmoid(x, amp = 1, center = 0, strength = 1) {
    // console.log(`Sigmoid recieved : ${x},: ${amp},: ${center},: ${strength},`);
    return amp / (1 + Math.exp(strength * (-x))) + center - amp / 2;
  }
}
