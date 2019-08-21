import { operatorCalc } from './operator';

import {
  Vector, Victor, Victor as IVector, vector, victor, victor as ivector
} from './vector';
import {
  Point, IPoint, point, ipoint
} from './point';

export {
  Vector, Victor, Victor as IVector, vector, victor, victor as ivector
} from './vector';
export {
  Point, IPoint, point, ipoint
} from './point';

/**
 * @param {() => number} alg
 * @return {(Vector | Victor | IVector | Point | IPoint) & number | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;

export const Export = {
  Vector, Victor, IVector, Point, IPoint, vector, victor, ivector, point, ipoint
};
