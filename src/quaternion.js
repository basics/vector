import { operatorCalc, defineVectorLength, fallbackValueOf } from './operator';
import formatNumber from './formatter';
import { Vector } from './vector';

/* eslint class-methods-use-this: 0 */

const AXES = Symbol('axes');
const QuaternionMultVa = new Vector(0, 0, 0);
const QuaternionMultVb = new Vector(0, 0, 0);

/**
 * @extends {number}
 */
export class Quaternion {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  constructor(x, y, z, w) {
    if (typeof x === 'function') {
      operatorCalc(x, (nx, ny, nz, nw) => {
        this[AXES] = [nx, ny, nz, nw];
      });
    } else {
      this[AXES] = [x || 0, y || 0, z || 0, w || 0];
    }
  }

  apply(other) {
    if (other instanceof Quaternion) {
      return this.applyQuaternion(other);
    }
    return this.applyVector(other);
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
  /**
   *
   * @param {{ x: number, y: number, z: number }} vec
   * @returns {{ x: number, y: number, z: number }}
   */
  applyVector(vec) {
    const { x, y, z } = vec;
    const [qx, qy, qz, qw] = this[AXES];

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    return new vec.constructor(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
  }

  // http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
  applyQuaternion(quat) {
    const [x, y, z, w] = this[AXES];
    const va = QuaternionMultVa;
    const vb = QuaternionMultVb;

    va.set(x, y, z);
    vb.set(quat.x, quat.y, quat.z);
    const qw = w * quat.w - va.dot(vb);
    const vaxvb = va.crossNormalize(vb);

    const qx = w * vb.x + qw * va.x + vaxvb.x;
    const qy = w * vb.y + qw * va.y + vaxvb.y;
    const qz = w * vb.z + qw * va.z + vaxvb.z;

    return new this.constructor(qx, qy, qz, qw);
  }

  /**
   *
   * @returns {[number, number, number, number]}
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
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
   * @param {AVector} v
   * @returns {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `{ x: ${formatNumber(this.x)}, y: ${formatNumber(this.y)}, z: ${formatNumber(
      this.z
    )}, w: ${formatNumber(this.w)} }`;
  }
}

defineVectorLength(Quaternion, 1);
fallbackValueOf(Quaternion, 'apply');

export default Quaternion;
