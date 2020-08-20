// @ts-nocheck
import {
  operatorCalc, cachedValueOf, defineVectorLength, cachedFactory, cachedFunction, defineMatrixLength
} from '../operator';

function fallbackWindow() {
  return {
    addEventListener() { }
  };
}
export function hijackPlayCanvas(pc) {
  const {
    Vec2, Vec3, Vec4, Quat, Mat3, Mat4, math
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

  Vec4.prototype.valueOf = function () {
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

  pc.mat3 = (...axes) => {
    const mat = new Mat3();
    axes.forEach((ax, i) => { mat[i] = ax; });
    return mat;
  };

  pc.mat4 = (...axes) => {
    const mat = new Mat4();
    axes.forEach((ax, i) => { mat[i] = ax; });
    return mat;
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
    if (typeof x === 'number') {
      return new Quat(x, y, z, w);
    }
    if (!x) {
      return new Quat();
    }
    if (typeof y === 'number') {
      return new Quat().setFromAxisAngle(x, y * RAD_TO_DEG);
    }
    return new Quat().setFromMat4(new Mat4().setLookAt(ZERO, x, y || UP));
  });

  pc.cross = cachedFunction((a, b) => new Vec3().cross(a, b));

  pc.rotate = cachedFunction((q, axis, angle) => pc.quat(axis, angle).multiply(q));

  pc.deg = (degree) => degree * DEG_TO_RAD;

  Quat.prototype.multiplyQuaternion = function (other) {
    return this.clone().mul(other);
  };

  Quat.prototype.multiply = function (other, y, z, w) {
    if (other && typeof other.w === 'number') {
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

  Object.defineProperty(Mat3.prototype, 0, {
    get() {
      const { data } = this;
      return new Vec3(data[0], data[1], data[2]);
    },
    set({ x, y, z }) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
    }
  });

  Object.defineProperty(Mat3.prototype, 1, {
    get() {
      const { data } = this;
      return new Vec3(data[3], data[4], data[5]);
    },
    set({ x, y, z }) {
      this[3] = x;
      this[4] = y;
      this[5] = z;
    }
  });

  Object.defineProperty(Mat3.prototype, 2, {
    get() {
      const { data } = this;
      return new Vec3(data[6], data[7], data[8]);
    },
    set({ x, y, z }) {
      this[6] = x;
      this[7] = y;
      this[8] = z;
    }
  });

  Object.defineProperty(Mat4.prototype, 0, {
    get() {
      const { data } = this;
      return new Vec4(data[0], data[1], data[2], data[3]);
    },
    set({
      x, y, z, w
    }) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = w;
    }
  });

  Object.defineProperty(Mat4.prototype, 1, {
    get() {
      const { data } = this;
      return new Vec4(data[4], data[5], data[6], data[7]);
    },
    set({
      x, y, z, w
    }) {
      this[4] = x;
      this[5] = y;
      this[6] = z;
      this[7] = w;
    }
  });

  Object.defineProperty(Mat4.prototype, 2, {
    get() {
      const { data } = this;
      return new Vec4(data[8], data[9], data[10], data[11]);
    },
    set({
      x, y, z, w
    }) {
      this[8] = x;
      this[9] = y;
      this[10] = z;
      this[11] = w;
    }
  });

  Object.defineProperty(Mat4.prototype, 3, {
    get() {
      const { data } = this;
      return new Vec4(data[12], data[13], data[14], data[15]);
    },
    set({
      x, y, z, w
    }) {
      this[12] = x;
      this[13] = y;
      this[14] = z;
      this[15] = w;
    }
  });
}

// eslint-disable-next-line no-undef
const global = typeof window === 'undefined' ? fallbackWindow() : window;
global.addEventListener('load', () => {
  const { pc } = global;
  if (!pc) {
    console.warn('no playcanvas in global namespace found');
  } else {
    hijackPlayCanvas(pc);
  }
});
