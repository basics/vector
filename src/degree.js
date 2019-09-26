// @ts-nocheck
const ANGLE = Symbol('angle-rad');
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
   * @param {number | Degree | IDegree} angle
   */
  set(angle) {
    if (angle instanceof ADegree) {
      this[ANGLE] = angle[ANGLE];
    } else {
      this[ANGLE] = degToRad(angle);
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

/**
 * @typedef {(angle: number) => DegreeType} DegreeNum
 * @typedef {(angle: Degree | IDegree) => DegreeType} DegreeDeg
 * @typedef {DegreeNum & DegreeDeg}
 *
 * @param {number | Degree | IDegree} angle
 * @returns {DegreeType}
 * @hidden
 */
export function degree(angle) {
  return new Degree(angle);
}

/**
 * @typedef {(angle: number) => IDegreeType} IDegreeNum
 * @typedef {(angle: Degree | IDegree) => IDegreeType} IDegreeDeg
 * @typedef {IDegreeNum & IDegreeDeg}
 *
 * @param {number | Degree | IDegree} angle
 * @returns {IDegreeType}
 * @hidden
 */
export function idegree(angle) {
  if (angle instanceof IDegree) {
    return angle;
  }
  return new IDegree(angle);
}

export const Export = {
  /**
   * @param {number | Degree | IDegree} angle
   * @returns {IDegreeType}
   */
  idegree: angle => idegree(angle),

  /**
   * @param {number | Degree | IDegree} angle
   * @returns {DegreeType}
   */
  degree: angle => degree(angle),
};
