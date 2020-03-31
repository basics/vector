// @ts-nocheck
import { normRad } from './util';

const ANGLE = Symbol('angle rad');
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * @typedef {Degree & number} DegreeType
 * @typedef {IDegree & number} IDegreeType
 * @abstract
 */
class ADegree {
  /**
   *
   * @param {number | ADegree} angle
   */
  constructor(angle) {
    if (angle instanceof ADegree) {
      this[ANGLE] = angle[ANGLE];
    } else {
      this[ANGLE] = normRad(angle * DEG_TO_RAD);
    }
  }

  /**
   * @returns {number}
   */
  valueOf() {
    return this[ANGLE];
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this[ANGLE] * RAD_TO_DEG}deg`;
  }
}

export class Degree extends ADegree {
  /**
   *
   * @param {number | Degree | IDegree} [angle]
   */
  set(angle) {
    if (angle instanceof ADegree) {
      this[ANGLE] = angle[ANGLE];
    } else {
      this[ANGLE] = normRad((angle || 0) * DEG_TO_RAD);
    }
  }
}

export class IDegree extends ADegree {
  /**
     * @returns {Degree}
     */
  toDegree() {
    return new Degree(this[ANGLE]);
  }
}

const ZERO = new IDegree(0);

/**
 * @param {number | Degree | IDegree} angle
 * @returns {DegreeType}
 */
export function degree(angle) {
  return new Degree(angle);
}

/**
 * @param {number | Degree | IDegree} angle
 * @returns {IDegreeType}
 */
export function idegree(angle) {
  if (angle instanceof IDegree) {
    return angle;
  }
  if (!angle) {
    return ZERO;
  }
  return new IDegree(angle);
}

export function isAngle(angle) {
  return typeof angle === 'number' || angle instanceof ADegree;
}
