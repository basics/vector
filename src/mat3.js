import { defineMatrixLength, cachedValueOf } from './operator';

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

  multiplyMat([mat0, mat1, mat2]) {
    const [column0, column1, column2] = this[AXES];
    return new this.constructor(
      new column0.constructor(
        column0.x * mat0.x + column1.x * mat0.y + column2.x * mat0.z,
        column0.y * mat0.x + column1.y * mat0.y + column2.y * mat0.z,
        column0.z * mat0.x + column1.z * mat0.y + column2.z * mat0.z
      ),
      new column0.constructor(
        column0.x * mat1.x + column1.x * mat1.y + column2.x * mat1.z,
        column0.y * mat1.x + column1.y * mat1.y + column2.y * mat1.z,
        column0.z * mat1.x + column1.z * mat1.y + column2.z * mat1.z
      ),
      new column0.constructor(
        column0.x * mat2.x + column1.x * mat2.y + column2.x * mat2.z,
        column0.y * mat2.x + column1.y * mat2.y + column2.y * mat2.z,
        column0.z * mat2.x + column1.z * mat2.y + column2.z * mat2.z
      )
    );
  }

  // https://www.khronos.org/registry/OpenGL/specs/es/2.0/GLSL_ES_Specification_1.00.pdf page 50 & 51
  // https://stackoverflow.com/questions/24593939/matrix-multiplication-with-vector-in-glsl#answer-24594497
  multiplyVec({ x, y, z }) {
    const [column0, column1, column2] = this[AXES];
    return new column0.constructor(
      column0.x * x + column1.x * y + column2.x * z,
      column0.y * x + column1.y * y + column2.y * z,
      column0.z * x + column1.z * y + column2.z * z
    );
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
