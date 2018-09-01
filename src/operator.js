/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
/* eslint getter-return: 0 */

const X = 0;
const Y = 1;
const Z = 2;
const DEFAULT = 3;

let inProgress = DEFAULT;
let inVector;

let resultCacheIndex = -1;
let handlingCache = false;
const resultCache = [];

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
      return inVector.createVector(x, y, z);
    }
    if (typeof result === 'function') {
      return result(x, y, z);
    }

    result.x = x;
    result.y = y;
    result.z = z;
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
    if (inProgress === X) {
      if (!inVector) {
        inVector = this;
      }
      return this.x;
    }
    if (inProgress === Y) {
      return this.y;
    }
    if (inProgress === Z) {
      return this.z;
    }
    return org.call(this);
  };
}

function bindCache(org) {
  return function (...args) {
    if (inProgress === X) {
      if (handlingCache) {
        return org.apply(this, args);
      }
      try {
        handlingCache = true;

        resultCacheIndex += 1;
        const res = org.apply(this, args);
        resultCache[resultCacheIndex] = res;
        return res;
      } finally {
        handlingCache = false;
      }
    }
    if (inProgress === Y) {
      resultCacheIndex += 1;
      return resultCache[resultCacheIndex];
    }
    if (inProgress === Z) {
      resultCacheIndex += 1;
      return resultCache[resultCacheIndex];
    }
    return org.apply(this, args);
  };
}

export function cachedMethod(Vector, name) {
  const org = Vector.prototype[name];
  Vector.prototype[name] = bindCache(org);
}

export function cachedGetter(Vector, name) {
  const desc = Object.getOwnPropertyDescriptor(Vector.prototype, name);
  const org = function () {
    return desc.get.call(this);
  };

  Object.defineProperty(Vector.prototype, name, {
    get: bindCache(org)
  });
}
