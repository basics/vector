import {
  acos, isArray, multQuatVec, normRad, multiplyVecMat3, isNumber
} from './utils/math';
import {
  cachedFunction, cachedGetter, cachedMethod, cachedValueOf, defineVectorLength, operatorCalc
} from './operator';
import { IPoint } from './point';
import { convertToCSSVars } from './utils/css';

const X = 0;
const Y = 1;
const Z = 2;
const AXES = Symbol('axes');

function square(val) {
  return val * val;
}

class AVector {
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz) => {
        this[AXES] = [nx, ny, nz];
      });
    } else if (isArray(x)) {
      this[AXES] = [...x];
    } else if (x && isNumber(x.x)) {
      this[AXES] = [x.x || 0, x.y || 0, x.z || 0];
    } else {
      this[AXES] = [x || 0, y || 0, z || 0];
    }
  }

  valueOf() {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  }

  normalize() {
    const { length } = this;
    return new this.constructor(
      this.x / length,
      this.y / length,
      this.z / length,
    );
  }

  norm() {
    return this.normalize();
  }

  // methods ispired by
  // https://evanw.github.io/lightgl.js/docs/vector.html

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new this.constructor(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  crossNormalize(v) {
    const vec = this.cross(v);
    const { length } = vec;
    vec[AXES][X] /= length;
    vec[AXES][Y] /= length;
    vec[AXES][Z] /= length;
    return vec;
  }

  cn(v) {
    return this.crossNormalize(v);
  }

  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length),
    };
  }

  angleTo(v) {
    return normRad(acos(this.dot(v) / (this.length * v.length)));
  }

  multiply(quat) {
    if (quat.x === undefined) {
      return this.multiplyMat3(quat);
    }
    if (quat.w === undefined) {
      return this.multiplyVec3(quat);
    }
    return multQuatVec(quat, this);
  }

  multiplyMat3(other) {
    return multiplyVecMat3(this, other);
  }

  multiplyVec3({ x, y, z }) {
    return new this.constructor(
      this.x * x,
      this.y * y,
      this.z * z
    );
  }

  distance(v) {
    return Math.sqrt(
      square(this.x - v.x) + square(this.y - v.y) + square(this.z - v.z),
    );
  }

  dist(v) {
    return this.distance(v);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  swizzle(target) {
    const data = target.split('')
      .map(t => this[t]);
    if (data.length === 2) {
      return new IPoint(data[0], data[1]);
    }
    return new this.constructor(data[0], data[1], data[2]);
  }

  calc(arg) {
    throw new Error('calc() not implemented');
  }

  clone() {
    throw new Error('clone() not implemented');
  }

  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  toJSON() {
    return { x: this.x, y: this.y, z: this.z };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toCSSVars(name, target) {
    return convertToCSSVars(name, this.toJSON(), target);
  }

  get lengthSq() {
    return this.dot(this);
  }

  set lengthSq(_) {
    throw new Error('set lengthSq() not implemented');
  }

  get length() {
    return Math.sqrt(this.lengthSq);
  }

  set length(_) {
    throw new Error('set length() not implemented');
  }

  get lensq() {
    return this.lengthSq;
  }

  set lensq(_) {
    throw new Error('set lensq() not implemented');
  }

  get len() {
    return this.length;
  }

  set len(_) {
    throw new Error('set len() not implemented');
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
    return this[AXES][Z];
  }

  set z(_) {
    throw new Error('set z() not implemented');
  }

  get xy() {
    return new IPoint(this[AXES][X], this[AXES][Y]);
  }

  set xy(_) {
    throw new Error('set xz() not implemented');
  }

  get xz() {
    return new IPoint(this[AXES][X], this[AXES][Z]);
  }

  set xz(_) {
    throw new Error('set xz() not implemented');
  }

  get yz() {
    return new IPoint(this[AXES][Y], this[AXES][Z]);
  }

  set yz(_) {
    throw new Error('set yz() not implemented');
  }

  [Symbol.iterator]() {
    return this[AXES].values();
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
  set x(x) {
    this[AXES][X] = x;
  }

  set y(y) {
    this[AXES][Y] = y;
  }

  set z(z) {
    this[AXES][Z] = z;
  }

  get x() {
    return this[AXES][X];
  }

  get y() {
    return this[AXES][Y];
  }

  get z() {
    return this[AXES][Z];
  }

  calc(alg) {
    return operatorCalc(alg, this);
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

export class Victor extends AVector {
  toVector() {
    return new Vector(this.x, this.y, this.z);
  }

  clone() {
    return this;
  }
}

export function calc(alg) {
  return operatorCalc(alg);
}

const vectorFactory = cachedFunction((x, y, z) => new Vector(x, y, z));

export const vector = (x, y, z) => vectorFactory(x, y, z);

const victorFactory = cachedFunction((x, y, z) => new Victor(x, y, z));

export const victor = (x, y, z) => victorFactory(x, y, z);

export const ZERO = victor(0, 0, 0);
export const FORWARD = victor(0, 0, -1);
export const BACK = victor(0, 0, 1);
export const LEFT = victor(-1, 0, 0);
export const RIGHT = victor(1, 0, 0);
export const UP = victor(0, 1, 0);
export const BOTTOM = victor(0, -1, 0);
export const ONE = victor(1, 1, 1);
