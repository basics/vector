import {
  operatorCalc, cachedValueOf, defineVectorLength, cachedFactory, cachedFunction, defineMatrixLength
} from '../operator';
import {
  multiplyMat3Vec, multiplyMat3Mat3, multiplyVecMat3, isNumber, multiplyVecMat4
} from '../utils/math';

export { hijackArray } from './array';

export function hijackPlayCanvas(pc) {
  const {
    Vec2, Vec3, Vec4, Quat, Mat3: AMat3, Mat4: AMat4, math
  } = pc;
  const {
    LEFT, FORWARD, UP, RIGHT, ZERO
  } = Vec3;
  const { RAD_TO_DEG, DEG_TO_RAD } = math;

  Vec2.prototype.valueOf = function () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  };

  Vec3.prototype.valueOf = function () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  };

  Vec3.prototype.multiply = function (other) {
    return multiplyVecMat3(this, other);
  };

  Vec4.prototype.valueOf = function () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  };

  Vec4.prototype.multiply = function (other) {
    return multiplyVecMat4(this, other);
  };

  AMat3.prototype.valueOf = function () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  };

  AMat4.prototype.valueOf = function () {
    throw new Error('valueOf() not implemented, looks like you try to calculate outside of calc');
  };

  cachedValueOf(Vec2);
  defineVectorLength(Vec2, 2);
  const vec2Factory = cachedFactory(Vec2);
  pc.vec2 = (x, y) => {
    if (typeof x === 'function') {
      return operatorCalc(x, new Vec2());
    }
    return vec2Factory(x, y);
  };

  cachedValueOf(Vec3);
  defineVectorLength(Vec3, 3);
  const vec3Factory = cachedFactory(Vec3);
  pc.vec3 = (x, y, z) => {
    if (typeof x === 'function') {
      return operatorCalc(x, new Vec3());
    }
    return vec3Factory(x, y, z);
  };

  cachedValueOf(Vec4);
  defineVectorLength(Vec4, 4);
  const vec4Factory = cachedFactory(Vec4);
  pc.vec4 = (x, y, z, w) => {
    if (typeof x === 'function') {
      return operatorCalc(x, new Vec4());
    }
    return vec4Factory(x, y, z, w);
  };

  pc.calc = operatorCalc;

  Object.defineProperty(Quat.prototype, 'left', {
    get() {
      return this.transformVector(LEFT, new Vec3());
    },
    set() {
      throw new Error('set left not allowed');
    }
  });
  Object.defineProperty(Quat.prototype, 'dir', {
    get() {
      return this.transformVector(FORWARD, new Vec3());
    },
    set() {
      throw new Error('set dir not allowed');
    }
  });
  Object.defineProperty(Quat.prototype, 'up', {
    get() {
      return this.transformVector(UP, new Vec3());
    },
    set() {
      throw new Error('set up not allowed');
    }
  });
  Object.defineProperty(Quat.prototype, 'inverse', {
    get() {
      return this.clone().invert();
    },
    set() {
      throw new Error('set inverse not allowed');
    }
  });
  pc.quat = cachedFunction((x, y, z, w) => {
    if (isNumber(x)) {
      return new Quat(x, y, z, w);
    }
    if (!x) {
      return new Quat();
    }
    if (isNumber(y)) {
      return new Quat().setFromAxisAngle(x, y * RAD_TO_DEG);
    }
    return new Quat().setFromMat4(new AMat4().setLookAt(ZERO, x, y || UP));
  });

  pc.cross = cachedFunction((a, b) => new Vec3().cross(a, b));

  pc.rotate = cachedFunction((q, axis, angle) => pc.quat(axis, angle).multiply(q));

  pc.deg = (degree) => degree * DEG_TO_RAD;

  Quat.prototype.multiplyQuaternion = function (other) {
    return this.clone().mul(other);
  };

  Quat.prototype.multiply = function (other, y, z, w) {
    if (other && (isNumber(other.w))) {
      return this.multiplyQuaternion(other);
    }
    return this.multiplyQuaternion(pc.quat(other, y, z, w));
  };

  cachedValueOf(Quat);
  defineMatrixLength(Quat);

  const LEFT90 = pc.quat(LEFT, 90);

  Quat.prototype.setFromOrientation = function ({ alpha, beta, gamma }, orientation) {
    let rot = pc.quat(UP, alpha * RAD_TO_DEG)
      .multiply(RIGHT, beta * RAD_TO_DEG)
      .multiply(FORWARD, gamma * RAD_TO_DEG)
      .multiply(LEFT90);

    if (orientation) {
      rot = pc.quat(rot.dir, orientation * RAD_TO_DEG)
        .multiply(rot);
    }
    this.copy(rot);
    return this;
  };

  Object.defineProperty(Vec3.prototype, 'len', {
    get() {
      return this.length();
    },
    set() {
      throw new Error('set len not allowed');
    }
  });

  Object.defineProperty(Vec2.prototype, 'len', {
    get() {
      return this.length();
    },
    set() {
      throw new Error('set len not allowed');
    }
  });

  Object.defineProperty(Vec4.prototype, 'len', {
    get() {
      return this.length();
    },
    set() {
      throw new Error('set len not allowed');
    }
  });

  AMat3.prototype.multiply = function (other) {
    if (other && (isNumber(other.z))) {
      return multiplyMat3Vec(other);
    }
    return multiplyMat3Mat3(this, other);
  };

  AMat3.prototype[Symbol.iterator] = function () {
    return [this[0], this[1], this[2]].values();
  };

  Object.defineProperty(AMat3.prototype, 0, {
    get() {
      const { data } = this;
      return new Vec3(data[0], data[1], data[2]);
    },
    set({ x, y, z }) {
      const { data } = this;
      data[0] = x;
      data[1] = y;
      data[2] = z;
    }
  });

  Object.defineProperty(AMat3.prototype, 1, {
    get() {
      const { data } = this;
      return new Vec3(data[3], data[4], data[5]);
    },
    set({ x, y, z }) {
      const { data } = this;
      data[3] = x;
      data[4] = y;
      data[5] = z;
    }
  });

  Object.defineProperty(AMat3.prototype, 2, {
    get() {
      const { data } = this;
      return new Vec3(data[6], data[7], data[8]);
    },
    set({ x, y, z }) {
      const { data } = this;
      data[6] = x;
      data[7] = y;
      data[8] = z;
    }
  });

  Object.defineProperty(AMat4.prototype, 0, {
    get() {
      const { data } = this;
      return new Vec4(data[0], data[1], data[2], data[3]);
    },
    set({
      x, y, z, w
    }) {
      const { data } = this;
      data[0] = x;
      data[1] = y;
      data[2] = z;
      data[3] = w;
    }
  });

  Object.defineProperty(AMat4.prototype, 1, {
    get() {
      const { data } = this;
      return new Vec4(data[4], data[5], data[6], data[7]);
    },
    set({
      x, y, z, w
    }) {
      const { data } = this;
      data[4] = x;
      data[5] = y;
      data[6] = z;
      data[7] = w;
    }
  });

  Object.defineProperty(AMat4.prototype, 2, {
    get() {
      const { data } = this;
      return new Vec4(data[8], data[9], data[10], data[11]);
    },
    set({
      x, y, z, w
    }) {
      const { data } = this;
      data[8] = x;
      data[9] = y;
      data[10] = z;
      data[11] = w;
    }
  });

  Object.defineProperty(AMat4.prototype, 3, {
    get() {
      const { data } = this;
      return new Vec4(data[12], data[13], data[14], data[15]);
    },
    set({
      x, y, z, w
    }) {
      const { data } = this;
      data[12] = x;
      data[13] = y;
      data[14] = z;
      data[15] = w;
    }
  });

  AMat4.prototype.multiply = function (other) {
    if (other && (isNumber(other.w))) {
      return this.transformVec4(other);
    }
    return AMat4().mul2(this, other);
  };

  AMat3.prototype[Symbol.iterator] = function () {
    return [this[0], this[1], this[2], this[2]].values();
  };

  cachedValueOf(AMat3);
  defineMatrixLength(AMat3);

  cachedValueOf(AMat4);
  defineMatrixLength(AMat4);

  class Mat3 extends AMat3 {
    constructor(...axes) {
      super();
      const [first] = axes;
      if (isNumber(first)) {
        for (let i = 0; i < 9; i += 1) {
          this.data[i] = first;
        }
      } else if (isNumber(first[0]?.w)) {
        [first[0], first[1], first[2]].forEach(({ x, y, z }, i) => { this[i] = new Vec3(x, y, z); });
      } else {
        axes.forEach((ax, i) => { this[i] = ax; });
      }
    }
  }

  class Mat4 extends AMat4 {
    constructor(...axes) {
      super();
      const [first] = axes;
      if (isNumber(first)) {
        for (let i = 0; i < 16; i += 1) {
          this.data[i] = first;
        }
      } else if (first[0] && isNumber(first[0].x) && !isNumber(first[0].w)) {
        [first[0], first[1], first[2]].forEach(({ x, y, z }, i) => { this[i] = new Vec4(x, y, z, 0.0); });
      } else {
        axes.forEach((ax, i) => { this[i] = ax; });
      }
    }
  }
  pc.Mat3 = Mat3;
  pc.Mat4 = Mat4;

  pc.mat3 = (...axes) => new Mat3(...axes);

  pc.mat4 = (...axes) => new Mat4(...axes);
}
