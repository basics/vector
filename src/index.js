import { operatorCalc } from './operator';

import { Vector, Victor, Victor as IVector } from './vector';
import { Point, IPoint } from './point';

export { Vector, Victor, IVector };
export { Point, IPoint };

/**
 * @param {() => number} alg
 * @return {Vector | Victor | IVector | Point | Ipoint | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
