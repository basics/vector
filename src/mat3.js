import { defineMatrixLength, cachedValueOf } from './operator';
import { multiplyMat3Mat3, multiplyMat3Vec } from './utils/math';

const AXES = Symbol('data');

class AMat3 {
  constructor(...columns) {
    this[AXES] = columns;
  }

  get [0]() {
    return this[AXES][0];
  }

  set [0](_) {
    throw new Error('set [0] not implemented');
  }

  get [1]() {
    return this[AXES][1];
  }

  set [1](_) {
    throw new Error('set [1] not implemented');
  }

  get [2]() {
    return this[AXES][2];
  }

  set [2](_) {
    throw new Error('set [2] not implemented');
  }

  multiplyMat(other) {
    return multiplyMat3Mat3(this, other);
  }

  multiplyVec(other) {
    return multiplyMat3Vec(this, other);
  }

  multiply(other) {
    if (other instanceof AMat3) {
      return this.multiplyMat(other);
    }
    const { x, y, z } = other;
    if (x === undefined || y === undefined || z === undefined) {
      throw new Error(`multiply only works with mat3 and vec3, not supported ${other}`);
    }
    return this.multiplyVec(other);
  }

  [Symbol.iterator]() {
    return this[AXES].values();
  }
}

cachedValueOf(AMat3);
defineMatrixLength(AMat3);

export class IMat3 extends AMat3 {

}
