import {
  cachedMethod, cachedGetter, cachedValueOf, operatorCalc
} from './operator';
import formatNumber from './formatter';

/* eslint class-methods-use-this: 0 */

const X = 0;
const Y = 1;
const Z = 2;
const AXES = Symbol.for('axes');

function square(val) {
  return val * val;
}
class AVector {
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (...args) => {
        this[AXES] = args;
      });
    } else {
      this[AXES] = [x || 0, y || 0, z || 0];
    }
  }

  valueOf() {
    return this.length;
  }

  normalize() {
    const { length } = this;
    return new this.constructor(this.x / length, this.y / length, this.z / length);
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
      this.x * v.y - this.y * v.x
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
      phi: Math.asin(this.y / this.length)
    };
  }

  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length * a.length));
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
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

  distance(v) {
    return Math.sqrt(square(this.x - v.x) + square(this.y - v.y) + square(this.z - v.z));
  }

  dist(v) {
    return this.distance(v);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  clone() {
    throw new Error('clone() not implemented');
  }

  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  toString() {
    return `{ x: ${formatNumber(this.x)}, y: ${formatNumber(this.y)}, z: ${formatNumber(this.z)} }`;
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
}

cachedValueOf(AVector);
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

  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

export class Victor extends AVector {
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

  toVector() {
    return new Vector(this.x, this.y, this.z);
  }
}

export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
