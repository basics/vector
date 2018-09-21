/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
/* eslint getter-return: 0 */
/* eslint new-cap: 0 */

const X = 0;
const Y = 1;
const Z = 2;
const DEFAULT = 3;

let inProgress = DEFAULT;
let inVector;

let resultCacheIndex = -1;
let handlingCache = false;
const resultCache = [];

function handleProgess(progess, alg) {
  inProgress = progess;
  resultCacheIndex = -1;
  return alg();
}

/**
 * @param {() => number} alg
 * @param {{ x: number, y: number, z: number }=} result
 * @return {{ x: number, y: number, z: number } | number}
 */
export function operatorCalc(alg, result) {
  if (typeof alg !== 'function') {
    throw new Error('no function assigned');
  }
  if (inProgress !== DEFAULT) {
    throw new Error('something wrong');
  }
  try {
    const noRes = typeof result === 'undefined';
    const x = handleProgess(X, alg);

    if (noRes && typeof inVector === 'undefined') {
      return x;
    }

    const y = handleProgess(Y, alg);
    const z = handleProgess(Z, alg);

    if (noRes) {
      return new inVector.constructor(x, y, z);
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
  }
}

export function cachedValueOf(VectorClass) {
  const Vector = VectorClass.prototype;
  const name = 'valueOf';
  const org = Vector[name];

  Vector[name] = function () {
    if (inProgress === X) {
      inVector = this;
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

export function cachedMethod(VectorClass, name) {
  const Vector = VectorClass.prototype;
  const org = Vector[name];
  Vector[name] = bindCache(org);
}

export function cachedGetter(VectorClass, name) {
  const Vector = VectorClass.prototype;
  const desc = Object.getOwnPropertyDescriptor(Vector, name);
  const org = function () {
    return desc.get.call(this);
  };

  Object.defineProperty(Vector, name, {
    get: bindCache(org)
  });
}
