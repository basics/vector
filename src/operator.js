import { isNumber } from './utils/math';
import { hijackDOMPoint } from "./dom.js";

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;
const CHECK_SUM = 9999999999999;

const DEFAULT = undefined;
const VECTOR_LENGTH = Symbol('vector length');
const GET_SOURCE = Symbol('get source');
const CHECKED = Symbol('checked');

let inProgress = DEFAULT;
let inVector;
let elCount;
const allChecks = [0, 1, 2, 6, 24, 120, 720, 5760, 51840, 518400, 5702400, 68428800, 889574400, 12454041600, 186810624000];
const collect = [];

let resultCacheIndex = -1;
let handlingCache = false;
const resultCache = [];

function handleProgess (progess, alg, resVec) {
  inProgress = progess;
  resultCacheIndex = -1;
  elCount = 1;

  const res = alg(resVec);

  if (!isNumber(res)) {
    throw new Error(`
      your assigned progress did not not return a primitive!
      calc() does not support logical operators (|| && ==) directly

      instead of calc(() => v1 || v2);
      use        calc(() => +v1 || +v2);

      instead of calc(() => v1);
      use        calc(v1);
      `);
  }
  return res;
}

function getVectorLength (vec) {
  const getSource = vec[GET_SOURCE];
  if (getSource) {
    return getSource(vec).length;
  }
  return vec[VECTOR_LENGTH] || 3;
}

function maxVector (v1, v2) {
  if (getVectorLength(v1) > getVectorLength(v2)) {
    return v1;
  }
  return v2;
}

function getVectorValue (vec, index) {
  elCount += 1;

  if (index === CHECK_SUM) {
    return elCount;
  }

  if (index >= getVectorLength(vec)) {
    return 0;
  }

  const getSource = vec[GET_SOURCE];
  if (getSource) {
    return 1.0 * getSource(vec)[index];
  }
  if (index === X) {
    return 1.0 * vec.x;
  }
  if (index === Y) {
    return 1.0 * vec.y;
  }
  if (index === Z) {
    return 1.0 * vec.z;
  }
  if (index === W) {
    return 1.0 * vec.w;
  }
  // really?
  return undefined;
}

function setVectorValue (vec, index, value) {
  const getSource = vec[GET_SOURCE];
  if (getSource) {
    getSource(vec)[index] = value;
    return;
  }
  if (index === X) {
    vec.x = value;
    return;
  }
  if (index === Y) {
    vec.y = value;
    return;
  }
  if (index === Z) {
    vec.z = value;
  }
  if (index === W) {
    vec.w = value;
  }
}

export function operatorCalc (alg, result) {
  if (typeof alg !== 'function') {
    throw new Error('no function assigned');
  }
  if (inProgress !== DEFAULT) {
    throw new Error('something wrong, do you use calc() inside calc?');
  }
  try {
    const noRes = typeof result === 'undefined';
    const funRes = typeof result === 'function';
    const resVec = !funRes && !noRes ? result : undefined;
    const x = handleProgess(X, alg, resVec);

    if (noRes && typeof inVector === 'undefined') {
      return x;
    }

    const inLen = inVector ? getVectorLength(inVector) : 0;
    if (inLen === CHECK_SUM) {
      if (!alg[CHECKED]) {
        const checkSum = handleProgess(CHECK_SUM, alg);

        const sum = allChecks[elCount];
        if (Math.abs(checkSum - sum) > Number.EPSILON) {
          throw new Error(`
            algebraic multiplication works only in calls with *

            calc(() => v * m);
            calc(() => m * v);
            calc(() => m * m);
            calc(() => m * m * v);

            `);
        }
        alg[CHECKED] = true;
      }

      let last = collect[0];
      for (let i = 1; i < elCount - 1; i += 1) {
        const current = collect[i];
        if (!last.multiply) {
          throw new Error(`cannot find method multiply() on ${last}`);
        }
        last = last.multiply(current);
      }
      return last;
    }
    let len = funRes ? result.length : inLen;
    if (!len) {
      len = inLen;
    }
    if (len < inLen) {
      throw new Error('Your assigned result Vector cant use higher space Operands than it has');
    }
    const target = new Array(len);
    target[0] = x;
    if (resVec) {
      setVectorValue(resVec, inProgress, target[0]);
    }
    for (let i = 1; i < len; i += 1) {
      const val = handleProgess(i, alg, resVec);
      target[i] = val;
      if (resVec) {
        setVectorValue(resVec, inProgress, val);
      }
    }

    if (noRes) {
      return new inVector.constructor(...target);
    }
    if (funRes) {
      return result(...target);
    }
    return resVec;
  } finally {
    inProgress = DEFAULT;
    inVector = undefined;
  }
}

export function cachedValueOf (VectorClass, getSource) {
  const Vector = VectorClass.prototype;
  Vector[GET_SOURCE] = getSource;
  const org = Vector[Symbol.toPrimitive] || function (hint) {
    if (hint === 'string') {
      return this.toString();
    }
    return this.valueOf();
  };

  Vector[Symbol.toPrimitive] = function (hint) {
    if (inProgress === X) {
      inVector = inVector ? maxVector(inVector, this) : this;
      collect[elCount - 1] = this;
    }
    if (inProgress === DEFAULT) {
      return org.call(this, hint);
    }
    return getVectorValue(this, inProgress);
  };
}

function bindCache (org) {
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
    if (inProgress === W) {
      resultCacheIndex += 1;
      return resultCache[resultCacheIndex];
    }
    return org.apply(this, args);
  };
}

export function cachedMethod (VectorClass, name) {
  const Vector = VectorClass.prototype;
  const org = Vector[name];
  Vector[name] = bindCache(org);
}

export function cachedGetter (VectorClass, name) {
  const Vector = VectorClass.prototype;
  const desc = Object.getOwnPropertyDescriptor(Vector, name);
  const org = function () {
    return desc.get.call(this);
  };

  Object.defineProperty(Vector, name, {
    get: bindCache(org),
  });
}

export function defineVectorLength (VectorClass, value) {
  const Vector = VectorClass.prototype;

  Object.defineProperty(Vector, VECTOR_LENGTH, { value });
}

export function defineMatrixLength (MatrixClass) {
  defineVectorLength(MatrixClass, CHECK_SUM);
}

export function cachedFactory (VectorClass) {
  return bindCache((...args) => new VectorClass(...args));
}

export function cachedFunction (fun) {
  return bindCache(fun);
}

if (typeof DOMPoint !== 'undefined' ) {
  // eslint-disable-next-line no-undef
  hijackDOMPoint(DOMPoint);
}
