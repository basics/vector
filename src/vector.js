// @ts-nocheck
import { isArray, multQuatVec, normRad } from './util';
import {
  cachedMethod,
  cachedGetter,
  cachedValueOf,
  operatorCalc,
  defineVectorLength,
  cachedFactory
} from './operator';
import { formatNumber } from './formatter';
import { IPoint } from './point';

const X = 0;
const Y = 1;
const Z = 2;
const AXES = Symbol('axes');

function square(val) {
  return val * val;
}

/**
 * @typedef {IPoint & number} IPointType
 */

/**
 * @typedef {Victor & number} VictorType
 * @typedef {Vector & number} VectorType
 * @typedef {() => number} Alg
 * @typedef {AVector & number} AVectorType
 * @abstract
 */
class AVector {
  /**
   * @param {number | [number, number, number] | Alg} [x]
   * @param {number} [y]
   * @param {number} [z]
   * @hidden
   */
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz) => {
        this[AXES] = [nx, ny, nz];
      });
    } else if (isArray(x)) {
      this[AXES] = [...x];
    } else {
      this[AXES] = [x || 0, y || 0, z || 0];
    }
  }


  /**
   * @returns {number}
   */
  valueOf() {
    return this.length;
  }

  /**
   * @returns {AVectorType}
   */
  normalize() {
    const { length } = this;
    return new this.constructor(this.x / length, this.y / length, this.z / length);
  }

  /**
   * @returns {AVectorType}
   */
  norm() {
    return this.normalize();
  }

  // methods ispired by
  // https://evanw.github.io/lightgl.js/docs/vector.html

  /**
   *
   * @param {AVectorType} v
   * @returns {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * @param {AVectorType} v
   * @returns {AVectorType}
   */
  cross(v) {
    return new this.constructor(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * @param {AVectorType} v
   * @returns {AVectorType}
   */
  crossNormalize(v) {
    const vec = this.cross(v);
    const { length } = vec;
    vec[AXES][X] /= length;
    vec[AXES][Y] /= length;
    vec[AXES][Z] /= length;
    return vec;
  }

  /**
   * @param {AVectorType} v
   * @returns {AVectorType}
   */
  cn(v) {
    return this.crossNormalize(v);
  }

  /**
   *
   * @returns {{ theta: number, phi: number }}
   */
  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length)
    };
  }

  /**
   *
   * @param {AVectorType} v
   * @returns {number}
   */
  angleTo(v) {
    return normRad(Math.acos(this.dot(v) / (this.length * v.length)));
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
  /**
   *
   * @param {{ x: number, y: number, z: number, w: number }} quat
   * @returns {AVectorType}
   */
  rotate(quat) {
    return multQuatVec(quat, this);
  }

  /**
   *
   * @param {AVectorType} v
   * @returns {number}
   */
  distance(v) {
    return Math.sqrt(square(this.x - v.x) + square(this.y - v.y) + square(this.z - v.z));
  }

  /**
   *
   * @param {AVectorType} v
   * @returns {number}
   */
  dist(v) {
    return this.distance(v);
  }

  /**
   *
   * @returns {[number, number, number]}
   */
  toArray() {
    return [this.x, this.y, this.z];
  }


  /**
  * @param {string} target
  * @returns {VectorType | VictorType | IPointType}
  */
  swizzle(target) {
    const data = target.split('').map(t => this[t]);
    if (data.length === 2) {
      return new IPoint(data[0], data[1]);
    }
    return new this.constructor(data[0], data[1], data[2]);
  }

  /**
   * @param {(vector: AVectorType) => number} arg
   * @returns {this}
   * @throws NotImplementedError ⚠
   */
  calc(arg) {
    throw new Error('calc() not implemented');
  }

  /**
   *
   * @throws NotImplementedError ⚠
   * @return {AVectorType}
   */
  clone() {
    throw new Error('clone() not implemented');
  }

  /**
   *
   * @param {AVectorType} v
   * @returns {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `{ x: ${formatNumber(this.x)}, y: ${formatNumber(this.y)}, z: ${formatNumber(this.z)} }`;
  }

  /**
   *
   * @returns {number}
   */
  get lengthSq() {
    return this.dot(this);
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set lengthSq(_) {
    throw new Error('set lengthSq() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get length() {
    return Math.sqrt(this.lengthSq);
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set length(_) {
    throw new Error('set length() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get lensq() {
    return this.lengthSq;
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set lensq(_) {
    throw new Error('set lensq() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get len() {
    return this.length;
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set len(_) {
    throw new Error('set len() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get x() {
    return this[AXES][X];
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set x(_) {
    throw new Error('set x() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get y() {
    return this[AXES][Y];
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set y(_) {
    throw new Error('set y() not implemented');
  }

  /**
   *
   * @returns {number}
   */
  get z() {
    return this[AXES][Z];
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set z(_) {
    throw new Error('set z() not implemented');
  }

  /**
   * @returns {IPointType}
   */
  get xy() {
    return new IPoint(this[AXES][X], this[AXES][Y]);
  }

  /**
   * @throws SetNotImplementedError
   */
  set xy(_) {
    throw new Error('set xz() not implemented');
  }

  /**
   * @returns {IPointType}
   */
  get xz() {
    return new IPoint(this[AXES][X], this[AXES][Z]);
  }

  /**
   * @throws SetNotImplementedError
   */
  set xz(_) {
    throw new Error('set xz() not implemented');
  }

  /**
   * @returns {IPointType}
   */
  get yz() {
    return new IPoint(this[AXES][Y], this[AXES][Z]);
  }

  /**
   * @throws SetNotImplementedError
   */
  set yz(_) {
    throw new Error('set yz() not implemented');
  }
}

cachedValueOf(AVector);
defineVectorLength(AVector, 3);
cachedMethod(AVector, 'dot');
cachedMethod(AVector, 'cross');
cachedMethod(AVector, 'crossNormalize');
cachedMethod(AVector, 'toAngles');
cachedMethod(AVector, 'angleTo');
cachedMethod(AVector, 'rotate');
cachedMethod(AVector, 'distance');
cachedMethod(AVector, 'toArray');
cachedGetter(AVector, 'length');
cachedGetter(AVector, 'lengthSq');

/**
 *
 * Vector
 *
 * new Vector(x: *number*, y: *number*, z: *number*): [[Vector]]
 *
 * new Vector(arr: *[number, number, number]*): [[Vector]]
 *
 * new Vector(alg: (*function*(): *number*)): [[Vector]]
 *
 */
export class Vector extends AVector {
  /**
   *
   * @param {number} x
   */
  set x(x) {
    this[AXES][X] = x;
  }

  /**
   *
   * @param {number} y
   */
  set y(y) {
    this[AXES][Y] = y;
  }

  /**
   *
   * @param {number} z
   */
  set z(z) {
    this[AXES][Z] = z;
  }

  /**
   *
   * @returns {number}
   */
  get x() {
    return this[AXES][X];
  }

  /**
   *
   * @returns {number}
   */
  get y() {
    return this[AXES][Y];
  }

  /**
   *
   * @returns {number}
   */
  get z() {
    return this[AXES][Z];
  }

  /**
   * @param {(vector: AVectorType) => number} alg
   * @returns {this}
   */
  calc(alg) {
    return operatorCalc(alg, this);
  }

  /**
   * @returns {AVectorType}
   */
  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

/**
 * Victor
 *
 * new Victor(x: *number*, y: *number*, z: *number*): [[Victor]]
 *
 * new Victor(arr: *[number, number, number]*): [[Victor]]
 *
 * new Victor(alg: (*function*(): *number*)): [[Victor]]
 *
 *
 */
export class Victor extends AVector {
  /**
   * @returns {VictorType}
   */
  toVector() {
    return new Vector(this.x, this.y, this.z);
  }

  /**
   * @returns {AVectorType}
   */
  clone() {
    return this;
  }
}

/**
 * @param {Alg} alg
 * @return {VectorType | VictorType}
 * @hidden
 */
export function calc(alg) {
  return operatorCalc(alg);
}

const vectorFactory = cachedFactory(Vector);

/**
 * @typedef {() => VectorType} VectorZero
 * @typedef {(alg: Alg) => VectorType} VectorAlg
 * @typedef {(x: number , y: number, z: number) => VectorType} VectorCon
 * @typedef {(data: [number, number, number]) => VectorType} VectorArr
 * @typedef {VectorAlg & VectorCon & VectorArr & VectorZero}
 *
 * @param {number | [number, number, number] | Alg} [x]
 * @param {number} [y]
 * @param {number} [z]
 * @returns {VectorType}
 * @hidden
 */
export function vector(x, y, z) {
  return vectorFactory(x, y, z);
}

const victorFactory = cachedFactory(Victor);

/**
 * @typedef {() => VictorType} VictorZero
 * @typedef {(alg: Alg) => VictorType} VictorAlg
 * @typedef {(x: number , y: number, z: number) => VictorType} VictorCon
 * @typedef {(data: [number, number, number]) => VictorType} VictorArr
 * @typedef {VictorAlg & VictorCon & VictorArr & VictorZero}
 *
 * @param {number | [number, number, number] | Alg} [x]
 * @param {number} [y]
 * @param {number} [z]
 * @returns {VictorType}
 * @hidden
 */
export function victor(x, y, z) {
  return victorFactory(x, y, z);
}

export const Export = {

  /**
   * @param {Alg} alg
   * @return {VectorType | VictorType}
   */
  calc: alg => operatorCalc(alg),

  /**
   * @type {VectorZero}
   */
  vector: () => vectorFactory(),

  /**
   * @type {VectorAlg}
   */
  vector: alg => vectorFactory(alg),

  /**
   * @type {VectorArr}
   */
  vector: arr => vectorFactory(arr),

  /**
   * @type {VectorCon}
   */
  vector: (x, y, z) => vectorFactory(x, y, z),

  /**
  * @type {VictorZero}
  */
  victor: () => victorFactory(),

  /**
   * @type {VictorAlg}
   */
  victor: alg => victorFactory(alg),

  /**
  * @type {VictorArr}
  */
  victor: arr => victorFactory(arr),

  /**
   * @type {VictorCon}
   */
  victor: (x, y, z) => victorFactory(x, y, z)
};

export const ZERO = victor(0, 0, 0);
export const FORWARD = victor(0, 0, -1);
export const BACK = victor(0, 0, 1);
export const LEFT = victor(-1, 0, 0);
export const RIGHT = victor(1, 0, 0);
export const UP = victor(0, 1, 0);
export const BOTTOM = victor(0, -1, 0);
