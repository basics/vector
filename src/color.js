// @ts-nocheck
import { isArray, isNumber } from './utils/math';
import {
  cachedFunction, cachedMethod, cachedValueOf, defineVectorLength, operatorCalc
} from './operator';
import { convertToCSSVars } from './utils/css';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;
const AXES = Symbol('axes');

/**
 * @typedef {IColor & number} IColorType
 * @typedef {Color & number} ColorType
 * @typedef {() => number} Alg
 * @typedef {AColor & number} AColorType
 */
/**
 * @abstract
 */
class AColor {
  constructor(x, y, z, w) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz, nw) => {
        this[AXES] = [nx, ny, nz, nw];
      });
    } else if (isArray(x)) {
      this[AXES] = [...x];
    } else if (x && isNumber(x.x)) {
      this[AXES] = [x.x || 0, x.y || 0, x.z || 0, x.w || 0];
    } else {
      this[AXES] = [x || 0, y || 0, z || 0, w || 0];
    }
  }

  /**
   * @throws NotImplementedError
   */
  valueOf() {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  }

  /**
   *
   * @returns {[number, number]}
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * @param {(color: AColorType) => number} alg
   * @returns {this}
   * @throws NotImplementedError ⚠
   */
  calc(alg) {
    throw new Error('calc() not implemented');
  }

  /**
   * @throws NotImplementedError ⚠
   * @returns {AColor}
   */
  clone() {
    throw new Error('clone() not implemented');
  }

  /**
   *
   * @param {AColor} v
   * @returns {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  }

  /**
   *
   * @returns {object}
   */
  toJSON() {
    return {
      x: this.x, y: this.y, z: this.z, w: this.w
    };
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }

  /**
   *
   * @returns {object}
   */
  toCSSVars(name, target) {
    return convertToCSSVars(name, this.toJSON(), target);
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
   *
   * @returns {number}
   */
  get w() {
    return this[AXES][W];
  }

  /**
   *
   * @throws SetNotImplementedError
   */
  set w(_) {
    throw new Error('set w() not implemented');
  }

  [Symbol.iterator]() {
    return this[AXES].values();
  }
}

cachedValueOf(AColor);
defineVectorLength(AColor, 4);
cachedMethod(AColor, 'toArray');

export class Color extends AColor {
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
   * @param {number} w
   */
  set w(w) {
    this[AXES][W] = w;
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
   *
   * @returns {number}
   */
  get w() {
    return this[AXES][W];
  }

  /**
   * @param {(color: ColorType) => number} alg
   * @returns {this}
   */
  calc(alg) {
    return operatorCalc(alg, this);
  }

  /**
   * @returns {AColor}
   */
  clone() {
    return new Color(this.x, this.y);
  }
}

export class IColor extends AColor {
  /**
   * @returns {ColorType}
   */
  toColor() {
    return new Color(this.x, this.y, this.z, this.w);
  }
}

/**
 * @param {Alg} alg
 * @return {ColorType | IColorType}
 */
export function calc(alg) {
  return operatorCalc(alg);
}

/**
 * @template P
 * @typedef {() => P} PZero
 */
/**
 * @template P
 * @typedef {(alg: Alg) => P} PAlg
 */
/**
 * @template P
 * @typedef {(x: number, y: number, z: number, w: number) => P} PCon
 */
/**
 * @template P
 * @typedef {(data: [number, number, number, number]) => P} PArr
 */
/**
 * @template P
 * @typedef {(vec: { x: number, y: number, z: number, w: number }) => P} PObj
 */
/**
 * @template P
 * @typedef {PZero<P> & PAlg<P> & PCon<P> & PArr<P> & PObj<P>} Po
 */

const colorFactory = cachedFunction((x, y, z, w) => new Color(x, y, z, w));

/**
 * @type {Po<ColorType>}
 */
export const color = (x, y, z, w) => colorFactory(x, y, z, w);

const icolorFactory = cachedFunction((x, y, z, w) => new IColor(x, y, z, w));

/**
 * @type {Po<IColorType>}
 */
export const icolor = (x, y, z, w) => icolorFactory(x, y, z, w);
