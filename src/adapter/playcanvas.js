// @ts-nocheck
import {
  operatorCalc, cachedValueOf, defineVectorLength, cachedFactory, cachedFunction
} from '../operator';

function fallbackWindow() {
  return {
    addEventListener() { }
  };
}
export function hijackPlayCanvas(pc) {
  const {
    Vec2, Vec3, Vec4, Quat, Mat4, math
  } = pc;
  const {
    LEFT, FORWARD, UP, RIGHT, ZERO
  } = Vec3;
  const { RAD_TO_DEG, DEG_TO_RAD } = math;

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
