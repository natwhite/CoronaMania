import {EventEmitter} from 'events';

export interface ITransform<T = number> {
  state: T;

  onComplete: EventEmitter;

  nextState(): T;
}
