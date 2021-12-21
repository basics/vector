import {
  FORWARD, LEFT, RIGHT, UP
} from './vector';
import { isArray, multQuatVec, isNumber } from './utils/math';
import {
  cachedFunction, defineMatrixLength, cachedValueOf
} from './operator';
import { degree, isAngle } from './degree';
import { convertToCSSVars } from './utils/css';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;
const AXES = Symbol('axes');

const FORWARD_CACHE = Symbol('forward cache');
const LEFT_CACHE = Symbol('left cache');
const UP_CACHE = Symbol('up cache');
const INVERSE_CACHE = Symbol('inverse cache');

function length ([x, y, z, w]) {
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

function normalize (axes) {
  const len = length(axes);
  axes[X] /= len;
  axes[Y] /= len;
  axes[Z] /= len;
  axes[W] /= len;
}

function look (forward, up) {
  const vector = forward.normalize();
  const vector2 = up.crossNormalize(vector);
  const vector3 = vector.crossNormalize(vector2);
  const m00 = vector2.x;
  const m01 = vector2.y;
  const m02 = vector2.z;
  const m10 = vector3.x;
  const m11 = vector3.y;
  const m12 = vector3.z;
  const m20 = vector.x;
  const m21 = vector.y;
  const m22 = vector.z;

  const num8 = (m00 + m11) + m22;
  const quaternion = new Array(4);
  if (num8 > 0) {
    let num = Math.sqrt(num8 + 1);
    quaternion[W] = num * 0.5;
    num = 0.5 / num;
    quaternion[X] = (m12 - m21) * num;
    quaternion[Y] = (m20 - m02) * num;
    quaternion[Z] = (m01 - m10) * num;
    return quaternion;
  }
  if ((m00 >= m11) && (m00 >= m22)) {
    const num7 = Math.sqrt(((1 + m00) - m11) - m22);
    const num4 = 0.5 / num7;
    quaternion[X] = 0.5 * num7;
    quaternion[Y] = (m01 + m10) * num4;
    quaternion[Z] = (m02 + m20) * num4;
    quaternion[W] = (m12 - m21) * num4;
    return quaternion;
  }
  if (m11 > m22) {
    const num6 = Math.sqrt(((1 + m11) - m00) - m22);
    const num3 = 0.5 / num6;
    quaternion[X] = (m10 + m01) * num3;
    quaternion[Y] = 0.5 * num6;
    quaternion[Z] = (m21 + m12) * num3;
    quaternion[W] = (m20 - m02) * num3;
    return quaternion;
  }
  const num5 = Math.sqrt(((1 + m22) - m00) - m11);
  const num2 = 0.5 / num5;
  quaternion[X] = (m20 + m02) * num2;
  quaternion[Y] = (m21 + m12) * num2;
  quaternion[Z] = 0.5 * num5;
  quaternion[W] = (m01 - m10) * num2;
  return quaternion;
}

function axisAngle (axis, angle) {
  const quaternion = new Array(4);
  const a = angle * 0.5;
  const sa = Math.sin(a);
  const ca = Math.cos(a);
  quaternion[X] = sa * axis.x;
  quaternion[Y] = sa * axis.y;
  quaternion[Z] = sa * axis.z;
  quaternion[W] = ca;
  return quaternion;
}

function getQuat (x, y, z, w) {
  if (isNumber(x)) {
    return [x, y, z, w];
  }
  if (isArray(x)) {
    return [...x];
  }
  if (isAngle(y)) {
    return axisAngle(x, y);
  }
  if (x && y) {
    return look(x, y);
  }
  return undefined;
}

function from (x, y, z, w) {
  if (x && isNumber(x.w)) {
    return getQuat(x.x, x.y, x.z, x.w);
  }
  return getQuat(x, y, z, w) || [0, 0, 0, 1];
}

class AQuaternion {
  constructor (x, y, z, w) {
    this[AXES] = from(x, y, z, w);
    normalize(this[AXES]);
  }

  set (x, y, z, w) {
    throw new Error('set x() not implemented');
  }

  multiply (other, y, z, w) {
    if (isNumber(other.w)) {
      return this.multiplyQuaternion(other);
    }
    const o = getQuat(other, y, z, w);
    if (o) {
      return this.multiplyQuaternion(new this.constructor(o));
    }
    return this.multiplyVector(other);
  }

  multiplyVector (vec) {
    return multQuatVec(this, vec);
  }

  multiplyQuaternion (quat) {
    const q1x = this.x;
    const q1y = this.y;
    const q1z = this.z;
    const q1w = this.w;
    const q2x = quat.x;
    const q2y = quat.y;
    const q2z = quat.z;
    const q2w = quat.w;
    const x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
    const y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
    const z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
    const w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    return new this.constructor(x, y, z, w);
  }

  mul (other, y, z, w) {
    return this.multiply(other, y, z, w);
  }

  get inverse () {
    const {
      x, y, z, w,
    } = this;
    return this.constructor(x * -1, y * -1, z * -1, w);
  }

  get inv () {
    return this.inverse;
  }

  equals (v) {
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  }

  get left () {
    return this.multiplyVector(LEFT);
  }

  get dir () {
    return this.multiplyVector(FORWARD);
  }

  get up () {
    return this.multiplyVector(UP);
  }

  get [0] () {
    return this.left;
  }

  get [1] () {
    return this.dir;
  }

  get [2] () {
    return this.up;
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

  toJSON () {
    const {
      x, y, z, w
    } = this;

    return {
      x,
      y,
      z,
      w,
      a1: 1 - ((y * y) * 2) - ((z * z) * 2),
      a2: ((x * y) * 2) - ((z * w) * 2),
      a3: ((x * z) * 2) + ((y * w) * 2),
      b1: ((x * y) * 2) + ((z * w) * 2),
      b2: 1 - ((x * x) * 2) - ((z * z) * 2),
      b3: ((y * z) * 2) - ((x * w) * 2),
      c1: ((x * z) * 2) - ((y * w) * 2),
      c2: ((y * z) * 2) + ((x * w) * 2),
      c3: 1 - ((x * x) * 2) - ((y * y) * 2)
    };
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }

  toCSSVars (name, target) {
    return convertToCSSVars(name, this.toJSON(), target);
  }
}

cachedValueOf(AQuaternion);
defineMatrixLength(AQuaternion);

export class Quaternion extends AQuaternion {
  set (x, y, z, w) {
    if (x instanceof AQuaternion) {
      this[AXES] = [...x[AXES]];
    } else {
      this[AXES] = from(x, y, z, w);
      normalize(this[AXES]);
    }
  }

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
}

function fromCache (scope, key, fn) {
  let res = scope[key];
  if (!res) {
    res = fn();
    scope[key] = res;
  }
  return res;
}

export class IQuaternion extends AQuaternion {
  get left () {
    return fromCache(this, LEFT_CACHE, () => this.multiplyVector(LEFT));
  }

  get dir () {
    return fromCache(this, FORWARD_CACHE, () => this.multiplyVector(FORWARD));
  }

  get up () {
    return fromCache(this, UP_CACHE, () => this.multiplyVector(UP));
  }

  get inverse () {
    return fromCache(this, INVERSE_CACHE, () => {
      const {
        x, y, z, w,
      } = this;
      return this.constructor(x * -1, y * -1, z * -1, w);
    });
  }
}

const q = new Quaternion();

const quaternionFactory = cachedFunction((x, y, z, w) => new Quaternion(x, y, z, w));

export const quaternion = (x, y, z, w) => quaternionFactory(x, y, z, w);

const iquaternionFactory = cachedFunction((x, y, z, w) => new IQuaternion(x, y, z, w));

export const iquaternion = (x, y, z, w) => iquaternionFactory(x, y, z, w);

const LEFT90 = new IQuaternion(LEFT, degree(90));

export function fromOrientation ({ alpha, beta, gamma }, orientation) {
  let rot = iquaternion(UP, degree(alpha))
    .mul(RIGHT, degree(beta))
    .mul(FORWARD, degree(gamma))
    .mul(LEFT90);

  rot = iquaternion(rot.dir, degree(orientation))
    .mul(rot);

  return rot;
}

export const IDENTITY = iquaternion(0, 0, 0, 1);
