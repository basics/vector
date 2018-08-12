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

function square(val) { return val * val; }

export class Vector {
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

  toString() {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }

  get length() {
    return Math.sqrt(square(this.x) + square(this.y) + square(this.z));
  }

  get len() {
    return this.length;
  }
}

export function calc(alg) {
  return innerCalc(alg, new Vector());
}
