import { operatorCalc } from './operator';

import { Vector, Victor } from './vector3';

export { Vector, Victor };

/**
 * @param {() => number} alg
 * @return {Vector | Victor | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
