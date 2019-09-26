import { operatorCalc } from './operator';
import { Vector } from './vector';

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

/**
 * @typedef {Vector & number} VectorType
 * @typedef {import('./vector').Victor & number} VictorType
 * @typedef {import('./point').Point & number} PointType
 * @typedef {import('./point').IPoint & number} IPointType
 */

/**
 * @param {() => number} alg
 * @return {VectorType | VictorType | PointType | IPointType | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
