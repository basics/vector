import { isArray, normRad, isNumber } from './utils/math';
import {
  cachedFunction,
  cachedGetter,
  cachedMethod,
  cachedValueOf,
  defineVectorLength,
  operatorCalc
} from './operator';
import { convertToCSSVars } from './utils/css';

const X = 0;
const Y = 1;
const AXES = Symbol('axes');

function angleOverGround(y1, x1, y2, x2) {
  const atanOne = Math.atan2(y1, x1);
  const atanTwo = Math.atan2(y2, x2);

  return normRad(atanOne - atanTwo);
}

function square(val) {
  return val * val;
}

class APoint {
  constructor(...args) {
    if (typeof args[0] === 'function') {
      operatorCalc(args[0], (nx, ny) => {
        this[AXES] = [nx, ny];
      });
    } else if (isArray(args[0])) {
      this[AXES] = [...args[0]];
    } else if (args[0] && isNumber(args[0].x)) {
      this[AXES] = [args[0].x || 0, args[0].y || 0];
    } else {
      this[AXES] = [args[0] || 0, args[1] || 0];
    }
  }

  valueOf() {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  }

  /**
   * @returns {this}
   */
  normalize() {
    const { length } = this;
    return new this.constructor(this.x / length, this.y / length);
  }

  /**
   * @returns {this}
   */
  norm() {
    return this.normalize();
  }

  // methods ispired by
  // https://evanw.github.io/lightgl.js/docs/point.html

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  getRad() {
    return normRad(Math.atan2(this.y, this.x));
  }

  /**
   * @param {APoint} v
   */
  angleTo(v) {
    return angleOverGround(this.y, this.x, v.y, v.x);
  }

  /**
   * @param {number} angle
   * @returns {this}
   */
  rotate(angle) {
    const sa = Math.sin(angle);
    const ca = Math.cos(angle);

    const x = this.x * ca - this.y * sa;
    const y = this.x * sa + this.y * ca;

    return new this.constructor(x, y);
  }

  /**
   * @param {APoint} v
   */
  distance(v) {
    return Math.sqrt(square(this.x - v.x) + square(this.y - v.y));
  }

  /**
   * @param {APoint} v
   */
  dist(v) {
    return this.distance(v);
  }

  /**
   * @returns {[number, number]}
   */
  toArray() {
    return [this.x, this.y];
  }

  // eslint-disable-next-line no-unused-vars
  calc(alg) {
    throw new Error('calc() not implemented');
  }

  clone() {
    throw new Error('clone() not implemented');
  }

  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toCSSVars(name, target = {}) {
    return convertToCSSVars(name, this.toJSON(), target);
  }

  get lengthSq() {
    return this.dot(this);
  }

  get length() {
    return Math.sqrt(this.lengthSq);
  }

  get lensq() {
    return this.lengthSq;
  }

  get len() {
    return this.length;
  }

  get x() {
    return this[AXES][X];
  }

  set x(_) {
    throw new Error('set x() not implemented');
  }

  get y() {
    return this[AXES][Y];
  }

  set y(_) {
    throw new Error('set y() not implemented');
  }

  get z() {
    throw new Error('get z() not implemented');
  }

  set z(_) {
    throw new Error('set z() not implemented');
  }

  [Symbol.iterator]() {
    return this[AXES].values();
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
  set x(x) {
    this[AXES][X] = x;
  }

  set y(y) {
    this[AXES][Y] = y;
  }

  get x() {
    return this[AXES][X];
  }

  get y() {
    return this[AXES][Y];
  }

  calc(alg) {
    return operatorCalc(alg, this);
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

export class IPoint extends APoint {
  /**
   * @returns {Point & number}
   */
  toPoint() {
    return new Point(this.x, this.y);
  }
}

export function calc(alg) {
  return operatorCalc(alg);
}

const pointFactory = cachedFunction((x, y) => new Point(x, y));

/**
 * @param {number | () => number} x
 * @param {number} [y]
 * @returns {Point & number}
 */
export const point = (x, y) => pointFactory(x, y);

const ipointFactory = cachedFunction((x, y) => new IPoint(x, y));

/**
 * @param {number | () => number} x
 * @param {number} [y]
 * @returns {IPoint & number}
 */
export const ipoint = (x, y) => ipointFactory(x, y);

export const ZERO = ipoint(0, 0);
export const FORWARD = ipoint(0, -1);
export const LEFT = ipoint(-1, 0);
