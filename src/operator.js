/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
/* eslint getter-return: 0 */
/* eslint new-cap: 0 */
/* eslint no-prototype-builtins: 0 */

const X = 0;
const Y = 1;
const Z = 2;
const DEFAULT = 3;
const VECTOR_LENGTH = Symbol('vector length');

let inProgress = DEFAULT;
let inVector;
let last;

let resultCacheIndex = -1;
let handlingCache = false;
const resultCache = [];

function handleProgess(progess, alg, resVec) {
  inProgress = progess;
  resultCacheIndex = -1;
  return alg(resVec);
}

function getVectorLength(vec) {
  return vec[VECTOR_LENGTH] !== 2 ? 3 : 2;
}

function maxVector(v1, v2) {
  if (getVectorLength(v1) > getVectorLength(v2)) {
    return v1;
  }
  return v2;
}

/**
 * @param {() => number} alg
 * @param {{ x: number, y: number, z: number } | { x: number, y: number }=} result
 * @return {{ x: number, y: number, z: number } | { x: number, y: number } | number}
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
    const funRes = typeof result === 'function';
    const resVec = !funRes && !noRes ? result : undefined;
    const x = handleProgess(X, alg, resVec);

    if (noRes && typeof inVector === 'undefined') {
      return x;
    }

    let calcZ = false;
    if (inVector) {
      calcZ = getVectorLength(inVector) !== 2;
    } else {
      calcZ = result.length !== 2;
    }

    const y = handleProgess(Y, alg, resVec);

    if (!calcZ) {
      if (noRes) {
        return new inVector.constructor(x, y);
      }
      if (funRes) {
        return result(x, y);
      }

      result.x = x;
      result.y = y;
    } else {
      const z = handleProgess(Z, alg, resVec);

      if (noRes) {
        return new inVector.constructor(x, y, z);
      }
      if (funRes) {
        return result(x, y, z);
      }

      result.x = x;
      result.y = y;
      result.z = z;
    }
    return result;
  } finally {
    inProgress = DEFAULT;
    inVector = undefined;
    last = undefined;
  }
}

export function cachedValueOf(VectorClass) {
  const Vector = VectorClass.prototype;
  const name = 'valueOf';
  const org = Vector[name];

  Vector[name] = function () {
    if (inProgress === X) {
      inVector = inVector ? maxVector(inVector, this) : this;
      last = this;
      return this.x;
    }
    if (inProgress === Y) {
      return this.y;
    }
    if (inProgress === Z) {
      if (this[VECTOR_LENGTH] !== 2) {
        return this.z;
      }
      return 0;
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

export function defineVectorLength(VectorClass, value) {
  const Vector = VectorClass.prototype;

  Object.defineProperty(Vector, VECTOR_LENGTH, { value });
}

export function cachedApplier(MatClass, name, TargetClass) {
  const Mat = MatClass.prototype;
  const org = Mat[name];
  Mat[name] = bindCache(org);

  if (TargetClass) {
    // TODO: magic happens here
  }
}

export function fallbackValueOf(MatClass) {
  const Mat = MatClass.prototype;
  const name = 'valueOf';
  const org = Mat[name];

  Mat[name] = function () {
    if (inProgress === DEFAULT) {
      return org.call(this);
    }

    if (last) {
      console.log('here is something', last);

      // TODO: magic happens here
      try {
        const fromCache = bindCache(Mat.applyVector).call(this, last);
        // const fromCache = this.applyVector(last);
        last = this;

        console.log('->', fromCache);

        // if (inProgress === X) {
        //   return fromCache.toArray()[0];
        // }
        // if (inProgress === Y) {
        //   return fromCache.toArray()[1];
        // }
        // if (inProgress === Z) {
        //   if (last[VECTOR_LENGTH] !== 2) {
        //     return fromCache.toArray()[2];
        //   }
        //   return 0;
        // }
      } catch (e) {
        console.error('ERROR!', e);
      }
    }

    last = this;
    return 1;
  };
}
