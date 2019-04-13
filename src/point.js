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
const AXES = Symbol('axes');

const deg180 = Math.PI;
const deg360 = Math.PI * 2;
// const deg90 = Math.PI * 0.5;

function atan2(y, x) {
  let res = Math.atan2(y, x);
  if (res < 0) {
    res = deg360 + res;
  }
  return res;
}

function angleOverGround(y1, x1, y2, x2) {
  const atanOne = atan2(y1, x1);
  const atanTwo = atan2(y2, x2);

  let res = atanOne - atanTwo;
  if (res > deg180) {
    res -= deg360;
  } else if (res < -deg180) {
    res += deg360;
  }
  return res;
}

function square(val) {
  return val * val;
}

/**
 * @extends {number}
 */
class APoint {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny) => {
        this[AXES] = [nx, ny];
      });
    } else {
      this[AXES] = [x || 0, y || 0];
    }
  }

  /**
   * @returns {number}
   */
  valueOf() {
    return this.length;
  }

  /**
   * @returns {APoint}
   */
  normalize() {
    const { length } = this;
    return new this.constructor(this.x / length, this.y / length);
  }

  /**
   * @returns {APoint}
   */
  norm() {
    return this.normalize();
  }

  // methods ispired by
  // https://evanw.github.io/lightgl.js/docs/point.html

  /**
   *
   * @param {APoint} v
   * @returns {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   *
   * @returns {number}
   */
  getRad() {
    return atan2(this.y, this.x);
  }

  /**
   *
   * @param {APoint} v
   * @returns {number}
   */
  angleTo(v) {
    return angleOverGround(this.y, this.x, v.y, v.x);
  }

  /**
   *
   * @param {APoint} v
   * @returns {number}
   */
  distance(v) {
    return Math.sqrt(square(this.x - v.x) + square(this.y - v.y));
  }

  /**
   *
   * @param {APoint} v
   * @returns {number}
   */
  dist(v) {
    return this.distance(v);
  }

  /**
   *
   * @returns {[number, number]}
   */
  toArray() {
    return [this.x, this.y];
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
   * @param {APoint} v
   * @returns {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `{ x: ${formatNumber(this.x)}, y: ${formatNumber(this.y)} }`;
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
   * @throws GetNotImplementedError
   */
  get z() {
    throw new Error('get z() not implemented');
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set z(_) {
    throw new Error('set z() not implemented');
  }
}

cachedValueOf(APoint);
defineVectorLength(APoint, 2);
cachedMethod(APoint, 'dot');
cachedMethod(APoint, 'angleTo');
cachedMethod(APoint, 'distance');
cachedMethod(APoint, 'toArray');
cachedMethod(APoint, 'getRad');
cachedGetter(APoint, 'length');
cachedGetter(APoint, 'lengthSq');

export class Point extends APoint {
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
   * @param {() => number} alg
   * @returns {this}
   */
  calc(alg) {
    return operatorCalc(alg, this);
  }

  /**
   *
   * @returns {Point}
   */
  clone() {
    return new Point(this.x, this.y);
  }
}

export class IPoint extends APoint {
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

  toPoint() {
    return new Point(this.x, this.y);
  }
}

/**
 * @param {() => number} alg
 * @return {Point | IPoint | number}
 */
export function calc(alg) {
  return operatorCalc(alg);
}
