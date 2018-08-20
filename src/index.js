/* eslint class-methods-use-this: 0 */
/* eslint no-param-reassign: 0 */

const X = Symbol.for('x');
const Y = Symbol.for('y');
const Z = Symbol.for('z');
const DEFAULT = Symbol.for('default');

let inProgress = DEFAULT;
let inVector;

const v3ValueOf = new Map();
v3ValueOf[X] = function getValueOf() {
  if (!inVector) {
    inVector = this;
  }
  return this[inProgress];
};
v3ValueOf[Y] = v3ValueOf[X];
v3ValueOf[Z] = v3ValueOf[X];
v3ValueOf[DEFAULT] = function getDefault() {
  return this.length;
};

function innerCalc(alg, result) {
  if (typeof alg !== 'function') {
    throw new Error('no function assigned');
  }
  if (inProgress !== DEFAULT) {
    throw new Error('something wrong');
  }
  try {
    inProgress = X;
    const x = alg();

    if (!result && !inVector) {
      return x;
    }
    inProgress = Y;
    const y = alg();
    inProgress = Z;
    const z = alg();

    if (!result) {
      return inVector.createVector(x, y, z);
    }
    result[X] = x;
    result[Y] = y;
    result[Z] = z;
    return result;
  } finally {
    inProgress = DEFAULT;
    inVector = undefined;
  }
}

class AVector {
  constructor(x, y, z) {
    if (typeof x === 'function') {
      innerCalc(x, this);
    } else {
      this[X] = x || 0;
      this[Y] = y || 0;
      this[Z] = z || 0;
    }
  }

  valueOf() {
    return v3ValueOf[inProgress].call(this);
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
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return this.createVector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  crossNormalize(v) {
    const vec = this.cross(v);
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
    return Math.acos(this.dot(a) / (this.length * a.length));
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
    return Math.sqrt(this.dot(this));
  }

  get len() {
    return this.length;
  }
}

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
  return innerCalc(alg);
}

export default Vector;
