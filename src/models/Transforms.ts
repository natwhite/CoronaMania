export interface ITransform<T = number> {
  state: T;

  nextState(): T;
}
