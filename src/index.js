import { Vector } from './vector';

export { operatorCalc as calc } from './operator';
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

export default Vector;
