// @ts-nocheck
import { isArray } from './util';
import {
  cachedMethod,
  cachedGetter,
  cachedValueOf,
  operatorCalc,
  defineVectorLength,
  cachedFactory
} from './operator';
import formatNumber from './formatter';

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
 * @typedef {IPoint & number} IPointType
 * @typedef {Point & number} PointType
 * @typedef {() => number} Alg
 * @typedef {APoint & number} APointType
 * @abstract
 */
class APoint {
  /**
   * @param {number | [number, number, number] | Alg} x
   * @param {number} [y]
   * @hidden
   */
  constructor(x, y) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny) => {
        this[AXES] = [nx, ny];
      });
    } else if (isArray(x)) {
      this[AXES] = [...x];
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
   * @returns {APointType}
   */
  normalize() {
    const { length } = this;
    return new this.constructor(this.x / length, this.y / length);
  }

  /**
   * @returns {APointType}
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
 * @param {number} angle
 * @returns {APointType}
 */
  rotate(angle) {
    const sa = Math.sin(angle);
    const ca = Math.cos(angle);

    const x = (this.x * ca) - (this.y * sa);
    const y = (this.x * sa) + (this.y * ca);

    return this.constructor(x, y);
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
   * @param {(point: APointType) => number} alg
   * @returns {this}
   * @throws NotImplementedError ⚠
   */
  calc(alg) {
    throw new Error('calc() not implemented');
  }

  /**
   * @throws NotImplementedError ⚠
   * @returns {APoint}
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

/**
 * Point
 *
 * new Point(x: *number*, y: *number*): [[Point]]
 *
 * new Point(arr: *[number, number]*): [[Point]]
 *
 * new Point(alg: (*function*(): *number*)): [[Point]]
 *
 */
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
   * @param {(point: PointType) => number} alg
   * @returns {this}
   */
  calc(alg) {
    return operatorCalc(alg, this);
  }

  /**
   * @returns {APoint}
   */
  clone() {
    return new Point(this.x, this.y);
  }
}

/**
 * IPoint
 *
 * new IPoint(x: *number*, y: *number*): [[IPoint]]
 *
 * new IPoint(arr: *[number, number]*): [[IPoint]]
 *
 * new IPoint(alg: (*function*(): *number*)): [[IPoint]]
 *
 */
export class IPoint extends APoint {
  /**
   * @returns {PointType}
   */
  toPoint() {
    return new Point(this.x, this.y);
  }
}

/**
 * @param {Alg} alg
 * @return {PointType | IPointType}
 * @hidden
 */
export function calc(alg) {
  return operatorCalc(alg);
}

const pointFactory = cachedFactory(Point);

/**
 * @typedef {(alg: Alg) => PointType} PointAlg
 * @typedef {(x: number , y: number) => PointType} PointCon
 * @typedef {(data: [number, number]) => PointType} PointArr
 * @typedef {PointAlg & PointCon & PointArr} point
 *
 * @param {number | [number, number] | Alg} x
 * @param {number} [y]
 * @returns {PointType}
 * @hidden
 */
export const point = function point(x, y) {
  return pointFactory(x, y);
};

const ipointFactory = cachedFactory(IPoint);

/**
 * @typedef {(alg: Alg) => IPointType} IPointAlg
 * @typedef {(x: number , y: number) => IPointType} IPointCon
 * @typedef {(data: [number, number]) => IPointType} IPointArr
 * @typedef {IPointAlg & IPointCon & IPointArr}
 *
 * @param {number | [number, number] | Alg} x
 * @param {number} [y]
 * @returns {IPointType}
 * @hidden
 */
export function ipoint(x, y) {
  return ipointFactory(x, y);
}

export const Export = {
  /**
   * @param {Alg} alg
   * @return {PointType | IPointType}
   */
  calc: alg => operatorCalc(alg),

  /**
   * @type {PointAlg}
   */
  point: alg => pointFactory(alg),

  /**
   * @type {PointArr}
   */
  point: arr => pointFactory(arr),

  /**
   * @type {PointCon}
   */
  point: (x, y) => pointFactory(x, y),

  /**
   * @type {IPointAlg}
   */
  ipoint: alg => ipointFactory(alg),

  /**
   * @type {IPointArr}
   */
  ipoint: arr => ipointFactory(arr),

  /**
   * @type {IPointCon}
   */
  ipoint: (x, y) => ipointFactory(x, y)
};
