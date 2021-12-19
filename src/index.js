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
export { radians, degrees } from './angles';

export function calc (alg) {
  return operatorCalc(alg);
}


export default Vector;
