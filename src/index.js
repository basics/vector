import {
  cachedMethod, cachedGetter, cachedValueOf, operatorCalc
} from './operator';

/* eslint class-methods-use-this: 0 */

const X = Symbol.for('x');
const Y = Symbol.for('y');
const Z = Symbol.for('z');

function cross(one, two) {
  return one.createVector(
    one.y * two.z - one.z * two.y,
    one.z * two.x - one.x * two.z,
    one.x * two.y - one.y * two.x
  );
}

function dot(one, two) {
  return one.x * two.x + one.y * two.y + one.z * two.z;
}

class AVector {
  constructor(x, y, z) {
    if (typeof x === 'function') {
      operatorCalc(x, (ix, iy, iz) => {
        this[X] = ix;
        this[Y] = iy;
        this[Z] = iz;
      });
    } else {
      this[X] = x || 0;
      this[Y] = y || 0;
      this[Z] = z || 0;
    }
  }

  valueOf() {
    return this.length;
  }

  normalize() {
    const { length } = this;
    return this.createVector(this.x / length, this.y / length, this.z / length);
  }

  norm() {
    return this.normalize();
  }

  // methods ispired by
  // https://evanw.github.io/lightgl.js/docs/vector.html

  dot(v) {
    return dot(this, v);
  }

  cross(v) {
    return cross(this, v);
  }

  crossNormalize(v) {
    const vec = cross(this, v);
    const { length } = vec;
    vec[X] /= length;
    vec[Y] /= length;
    vec[Z] /= length;
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
    return Math.acos(dot(this, a) / (this.length * a.length));
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
  rotate(quat) {
    const { x, y, z } = this;

    const {
      x: qx, y: qy, z: qz, w: qw
    } = quat;

    // q*v
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    return this.createVector(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
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
    return `{ x: ${this.x}, y: ${this.y}, z: ${this.z} }`;
  }

  get length() {
    return Math.sqrt(dot(this, this));
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
cachedMethod(AVector, 'toArray');
cachedGetter(AVector, 'length');

export class Vector extends AVector {
  set x(x) {
    this[X] = x;
  }

  set y(y) {
    this[Y] = y;
  }

  set z(z) {
    this[Z] = z;
  }

  get x() {
    return this[X];
  }

  get y() {
    return this[Y];
  }

  get z() {
    return this[Z];
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  createVector(x, y, z) {
    return new Vector(x, y, z);
  }
}

export class Victor extends AVector {
  get x() {
    return this[X];
  }

  set x(_) {
    throw new Error('set x() not implemented');
  }

  get y() {
    return this[Y];
  }

  set y(_) {
    throw new Error('set y() not implemented');
  }

  get z() {
    return this[Z];
  }

  set z(_) {
    throw new Error('set z() not implemented');
  }

  toVector() {
    return new Vector(this.x, this.y, this.z);
  }

  createVector(x, y, z) {
    return new Victor(x, y, z);
  }
}

export function calc(alg) {
  return operatorCalc(alg);
}

export default Vector;
