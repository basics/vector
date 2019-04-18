// @ts-nocheck
import {
  cachedMethod,
  cachedGetter,
  cachedValueOf,
  operatorCalc,
  defineVectorLength
} from './operator';
import formatNumber from './formatter';

/* eslint class-methods-use-this: 0 */

const X = 0;
const Y = 1;
const Z = 2;
const AXES = Symbol('axes');

function square(val) {
  return val * val;
}

/**
 * @typedef {AVector & number} AVectorType
 * @abstract
 */
class AVector {
  /**
   *
   * @param {number | (() => number)} x
   * @param {number} [y]
   * @param {number} [z]
   */
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz) => {
        this[AXES] = [nx, ny, nz];
      });
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
   * @param {AVector} v
   * @returns {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   *
   * @param {AVector} v
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
   *
   * @param {AVector} v
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
   *
   * @param {AVector} v
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
   * @param {AVector} v
   * @returns {number}
   */
  angleTo(v) {
    return Math.acos(this.dot(v) / (this.length * v.length));
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
  /**
   *
   * @param {{ x: number, y: number, z: number, w: number }} quat
   * @returns {AVector}
   */
  rotate(quat) {
    const { x, y, z } = this;

    const {
      x: qx, y: qy, z: qz, w: qw
    } = quat;

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    return new this.constructor(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
  }

  /**
   *
   * @param {AVector} v
   * @returns {number}
   */
  distance(v) {
    return Math.sqrt(square(this.x - v.x) + square(this.y - v.y) + square(this.z - v.z));
  }

  /**
   *
   * @param {AVector} v
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

  swizzle(target) {
    const data = target.split('').map(t => this[t]);
    return new this.constructor(data[0], data[1], data[2]);
  }

  /**
   *
   * @throws NotImplementedError
   */
  clone() {
    throw new Error('clone() not implemented');
  }

  /**
   *
   * @param {AVector} v
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
   * @returns {number}
   */
  get length() {
    return Math.sqrt(this.lengthSq);
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
   * @returns {number}
   */
  get len() {
    return this.length;
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
 * @typedef {Vector & number} VectorType
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
   * @param {(vector: VectorType) => number} alg
   * @returns {this}
   */
  calc(alg) {
    return operatorCalc(alg, this);
  }

  /**
   * @returns {Vector & number}
   */
  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

/**
 * @typedef {Victor & number} VictorType
 */
export class Victor extends AVector {
  /**
   * @returns {VectorType}
   */
  toVector() {
    return new Vector(this.x, this.y, this.z);
  }
}

/**
 * @param {() => number} alg
 * @return {VectorType | VictorType}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

/**
 * @typedef {(x: number, y: number, z: number) => VectorType} vector
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {VectorType}
 */
export function vector(x, y, z) {
  return new Vector(x, y, z);
}

/**
 * @typedef {(x: number, y: number, z: number) => VictorType} victor
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {VictorType}
 */
export function victor(x, y, z) {
  return new Victor(x, y, z);
}
