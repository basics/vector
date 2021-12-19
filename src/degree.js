import { normRad, isNumber } from './utils/math';
import { convertToCSSVars } from './utils/css';

const ANGLE = Symbol('angle rad');
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

class ADegree {
  constructor (angle) {
    if (angle instanceof ADegree) {
      this[ANGLE] = angle[ANGLE];
    } else {
      this[ANGLE] = normRad(angle * DEG_TO_RAD);
    }
  }

  valueOf () {
    return this[ANGLE];
  }

  toJSON () {
    return { angle: this[ANGLE] };
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }

  toCSSVars (name, target) {
    return convertToCSSVars(name, this.toJSON(), target);
  }
}

export class Degree extends ADegree {
  set (angle) {
    if (angle instanceof ADegree) {
      this[ANGLE] = angle[ANGLE];
    } else {
      this[ANGLE] = normRad((angle || 0) * DEG_TO_RAD);
    }
  }
}

export class IDegree extends ADegree {
  toDegree () {
    return new Degree(this[ANGLE]);
  }
}

const ZERO = new IDegree(0);

export function degree (angle) {
  return new Degree(angle);
}

export function idegree (angle) {
  if (angle instanceof IDegree) {
    return angle;
  }
  if (!angle) {
    return ZERO;
  }
  return new IDegree(angle);
}

export function isAngle (angle) {
  return isNumber(angle) || angle instanceof ADegree;
}
