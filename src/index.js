import { operatorCalc } from './operator';

import {
  Vector, Victor, Victor as IVector, vector, victor, victor as ivector
} from './vector';
import {
  Point, IPoint, point, ipoint
} from './point';

export {
  Vector, Victor, IVector, vector, victor, ivector
};
export {
  Point, IPoint, point, ipoint
};

/**
 * @param {() => number} alg
 * @return {(Vector | Victor | IVector | Point | IPoint) & number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
