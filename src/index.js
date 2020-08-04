import { operatorCalc } from './operator';
import { Vector, Victor } from './vector';
import { Point, IPoint } from './point';
import { Quaternion, IQuaternion } from './quaternion';
import { IMat3 } from './mat3';

export {
  Vector, Victor, Victor as IVector, vector, victor, victor as ivector, FORWARD, LEFT, UP, RIGHT
} from './vector';
export {
  Point, IPoint, point, ipoint
} from './point';
export {
  Quaternion, IQuaternion, IDENTITY, quaternion, iquaternion, fromOrientation
} from './quaternion';
export {
  Degree, IDegree, degree, idegree
} from './degree';
export {
  Color, IColor, color, icolor
} from './color';
export { IMat3 } from './mat3';

/**
 * @typedef {Vector & number} IndexVector
 * @typedef {Victor & number} IndexVictor
 * @typedef {Point & number} IndexPoint
 * @typedef {IPoint & number} IndexIPoint
 * @typedef {Quaternion & number} IndexQuaternion
 * @typedef {IQuaternion & number} IndexIQuaternion
 * @typedef {IMat3 & number} IndexIMat3
 */

/**
 * @param {() => number} alg
 * @return {IndexVector | IndexVictor | IndexPoint | IndexIPoint | IndexQuaternion | IndexIQuaternion | IndexIMat3 | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
