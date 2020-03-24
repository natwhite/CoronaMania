export function getNumberBetween(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start);
};

export function getRandomColor() {
  return [getNumberBetween(0, 255), getNumberBetween(0, 255), getNumberBetween(0, 255)];
};
