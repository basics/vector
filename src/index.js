import { operatorCalc } from './operator';
import { Vector, Victor } from './vector';
import { Point, IPoint } from './point';

export {
  Vector, Victor, Victor as IVector, vector, victor, victor as ivector, FORWARD, LEFT, UP
} from './vector';
export {
  Point, IPoint, point, ipoint
} from './point';
export {
  Quaternion, IQuaternion, IDENTITY, quaternion, iquaternion
} from './quaternion';
export {
  Degree, IDegree, degree, idegree
} from './degree';
export {
  Color, IColor, color, icolor
} from './color';

/**
 * @typedef {Vector & number} IndexVectorType
 * @typedef {Victor & number} IndexVictorType
 * @typedef {Point & number} IndexPointType
 * @typedef {IPoint & number} IndexIPointType
 */

/**
 * @param {() => number} alg
 * @return {IndexVectorType | IndexVictorType | IndexPointType | IndexIPointType | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
