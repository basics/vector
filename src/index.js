let inProgress = 'default';

const v3ValueOf = {
  x() {
    return this.x;
  },
  y() {
    return this.y;
  },
  z() {
    return this.z;
  },
  default() {
    return this.length;
  }
};

function innerCalc(alg, result) {
  if (typeof alg !== 'function') {
    throw new Error('no function assigned');
  }
  if (inProgress !== 'default') {
    throw new Error('something wrong');
  }
  try {
    const res = result;

    inProgress = 'x';
    res.x = alg();
    inProgress = 'y';
    res.y = alg();
    inProgress = 'z';
    res.z = alg();

    return res;
  } finally {
    inProgress = 'default';
  }
}

export default class Vector {
  constructor(x, y, z) {
    if (typeof x === 'function') {
      innerCalc(x, this);
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
  }

  valueOf() {
    return v3ValueOf[inProgress].call(this);
  }

  normalize() {
    const { length } = this;
    return new Vector(this.x / length, this.y / length, this.z / length);
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
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  crossNormalize(v) {
    const vec = this.cross(v);
    const { length } = vec;
    vec.x /= length;
    vec.y /= length;
    vec.z /= length;
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

  toArray() {
    return [this.x, this.y, this.z];
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  toString() {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }

  get length() {
    return Math.sqrt(this.dot(this));
  }

  get len() {
    return this.length;
  }
}

export function calc(alg) {
  return innerCalc(alg, new Vector());
}
