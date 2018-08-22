/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
/* eslint getter-return: 0 */

const X = 'x';
const Y = 'y';
const Z = 'z';
const DEFAULT = Symbol.for('default');

let inProgress = DEFAULT;
let inVector;

const v3ValueOf = new Map();
v3ValueOf[X] = function () {
  if (!inVector) {
    inVector = this;
  }
  return this[inProgress];
};
v3ValueOf[Y] = function () {
  return this[inProgress];
};
v3ValueOf[Z] = v3ValueOf[Y];
v3ValueOf[DEFAULT] = function (org) {
  return org.call(this);
};

let resultCacheIndex = -1;
const resultCache = [];
const v3resultCache = new Map();
v3resultCache[X] = function (org, args) {
  resultCacheIndex += 1;
  const res = org.apply(this, args);
  resultCache[resultCacheIndex] = res;
  return res;
};
v3resultCache[Y] = function () {
  resultCacheIndex += 1;
  return resultCache[resultCacheIndex];
};
v3resultCache[Z] = v3resultCache[Y];
v3resultCache[DEFAULT] = function (org, args) {
  return org.apply(this, args);
};

function createVector(source, x, y, z) {
  return source.createVector(x, y, z);
}

export function operatorCalc(alg, result) {
  if (typeof alg !== 'function') {
    throw new Error('no function assigned');
  }
  if (inProgress !== DEFAULT) {
    throw new Error('something wrong');
  }
  try {
    inProgress = X;
    resultCacheIndex = -1;
    const x = alg();

    if (!result && !inVector) {
      return x;
    }
    inProgress = Y;
    resultCacheIndex = -1;
    const y = alg();
    inProgress = Z;
    resultCacheIndex = -1;
    const z = alg();

    if (!result) {
      return createVector(inVector, x, y, z);
    }
    if (typeof result === 'function') {
      return result(x, y, z);
    }

    result[X] = x;
    result[Y] = y;
    result[Z] = z;
    return result;
  } finally {
    inProgress = DEFAULT;
    inVector = undefined;
    resultCacheIndex = -1;
  }
}

export function cachedValueOf(Vector) {
  const name = 'valueOf';
  const org = Vector.prototype[name];
  Vector.prototype[name] = function () {
    return v3ValueOf[inProgress].call(this, org);
  };
}

export function cachedMethod(Vector, name) {
  const org = Vector.prototype[name];
  Vector.prototype[name] = function (...args) {
    return v3resultCache[inProgress].call(this, org, args);
  };
}

export function cachedGetter(Vector, name) {
  const desc = Object.getOwnPropertyDescriptor(Vector.prototype, name);
  const org = function () {
    return desc.get.call(this);
  };

  Object.defineProperty(Vector.prototype, name, {
    get() {
      return v3resultCache[inProgress].call(this, org);
    }
  });
}
