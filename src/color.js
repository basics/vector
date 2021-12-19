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

class AColor {
  constructor (x, y, z, w) {
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

  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  valueOf () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  }

  toArray () {
    return [this.x, this.y, this.z, this.w];
  }

  calc (alg) {
    throw new Error('calc() not implemented');
  }

  clone () {
    throw new Error('clone() not implemented');
  }

  equals (v) {
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  }

  toJSON () {
    return {
      x: this.x, y: this.y, z: this.z, w: this.w
    };
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }

  toCSSVars (name, target) {
    return convertToCSSVars(name, this.toJSON(), target);
  }

  get x () {
    return this[AXES][X];
  }

  set x (_) {
    throw new Error('set x() not implemented');
  }

  get y () {
    return this[AXES][Y];
  }

  set y (_) {
    throw new Error('set y() not implemented');
  }

  get z () {
    return this[AXES][Z];
  }

  set z (_) {
    throw new Error('set z() not implemented');
  }

  get w () {
    return this[AXES][W];
  }

  set w (_) {
    throw new Error('set w() not implemented');
  }

  [Symbol.iterator] () {
    return this[AXES].values();
  }
}

cachedValueOf(AColor);
defineVectorLength(AColor, 4);
cachedMethod(AColor, 'toArray');

export class Color extends AColor {
  set x (x) {
    this[AXES][X] = x;
  }

  set y (y) {
    this[AXES][Y] = y;
  }

  set z (z) {
    this[AXES][Z] = z;
  }

  set w (w) {
    this[AXES][W] = w;
  }

  get x () {
    return this[AXES][X];
  }

  get y () {
    return this[AXES][Y];
  }

  get z () {
    return this[AXES][Z];
  }

  get w () {
    return this[AXES][W];
  }

  calc (alg) {
    return operatorCalc(alg, this);
  }

  clone () {
    return new Color(this.x, this.y);
  }
}

export class IColor extends AColor {
  toColor () {
    return new Color(this.x, this.y, this.z, this.w);
  }
}

export function calc (alg) {
  return operatorCalc(alg);
}

const colorFactory = cachedFunction((x, y, z, w) => new Color(x, y, z, w));

export const color = (x, y, z, w) => colorFactory(x, y, z, w);

const icolorFactory = cachedFunction((x, y, z, w) => new IColor(x, y, z, w));

export const icolor = (x, y, z, w) => icolorFactory(x, y, z, w);
