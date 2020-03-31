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
import { IPoint } from './point';

const X = 0;
const Y = 1;
const Z = 2;
const AXES = Symbol('axes');

function square(val) {
  return val * val;
}

/**
 * @typedef {IPoint & number} VecIPointType
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
   * @param {number | [number, number, number] | {x: number, y: number, z: number}| Alg} [x]
   * @param {number} [y]
   * @param {number} [z]
   */
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz) => {
        this[AXES] = [nx, ny, nz];
      });
    } else if (isArray(x)) {
      this[AXES] = [...x];
    } else if (x && typeof x.x === 'number') {
      this[AXES] = [x.x || 0, x.y || 0, x.z || 0];
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
    return new this.constructor(
      this.x / length,
      this.y / length,
      this.z / length
    );
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
    return Math.sqrt(
      square(this.x - v.x) + square(this.y - v.y) + square(this.z - v.z)
    );
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
   * @returns {VectorType | VictorType | VecIPointType}
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
    return `{ "x": ${this.x}, "y": ${this.y}, "z": ${this.z} }`;
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
   * @returns {VecIPointType}
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
   * @returns {VecIPointType}
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
   * @returns {VecIPointType}
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
 */
export function calc(alg) {
  return operatorCalc(alg);
}

const vectorFactory = cachedFactory(Vector);

/**
 * @template V
 * @typedef {() => V} VecZero
 */
/**
 * @template V
 * @typedef {(alg: Alg) => V} VecAlg
 */
/**
 * @template V
 * @typedef {(x: number, y: number, z: number) => V} VecCon
 */
/**
 * @template V
 * @typedef {(data: [number, number, number]) => V} VecArr
 */
/**
 * @template V
 * @typedef {(vec: { x: number, y: number, z: number }) => V} VecObj
 */
/**
 * @template V
 * @typedef {VecZero<V> & VecAlg<V> & VecCon<V> & VecArr<V> & VecObj<V>} Vec
 */

/**
 * @type {Vec<VectorType>}
 */
export const vector = (...args) => vectorFactory(...args);

const victorFactory = cachedFactory(Victor);

/**
 * @type {Vec<VictorType>}
 */
export const victor = (...args) => victorFactory(...args);

export const ZERO = victor(0, 0, 0);
export const FORWARD = victor(0, 0, -1);
export const BACK = victor(0, 0, 1);
export const LEFT = victor(-1, 0, 0);
export const RIGHT = victor(1, 0, 0);
export const UP = victor(0, 1, 0);
export const BOTTOM = victor(0, -1, 0);
