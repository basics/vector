
const X = 0;
const Y = 1;
const Z = 2;
const DEFAULT = undefined;
const VECTOR_LENGTH = Symbol('vector length');

let inProgress = DEFAULT;
let inVector;

let resultCacheIndex = -1;
let handlingCache = false;
const resultCache = [];

function handleProgess(progess, alg, resVec) {
  inProgress = progess;
  resultCacheIndex = -1;
  const res = alg(resVec);
  if (typeof res !== 'number' && res) {
    return res.valueOf();
  }
  return res;
}

function getVectorLength(vec) {
  if (typeof vec === 'number') {
    return 1;
  }
  if (Array.isArray(vec)) {
    return vec.length;
  }
  return vec[VECTOR_LENGTH] !== 2 ? 3 : 2;
}

function getVectorValue(vec, index) {
  if (index >= getVectorLength(vec)) {
    return 0;
  }
  if (Array.isArray(vec)) {
    return vec[index];
  }
  if (index === X) {
    return vec.x;
  }
  if (index === Y) {
    return vec.y;
  }
  if (index === Z) {
    return vec.z;
  }
  // really?
  return undefined;
}

function setVectorValue(vec, index, value) {
  if (Array.isArray(vec)) {
    vec[index] = value;
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
}

function maxVector(v1, v2) {
  if (getVectorLength(v1) > getVectorLength(v2)) {
    return v1;
  }
  return v2;
}

export function operatorCalc(alg, result) {
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
    const x = handleProgess(0, alg, resVec);

    if (noRes && typeof inVector === 'undefined') {
      return x;
    }

    const inLen = inVector ? getVectorLength(inVector) : 0;
    const len = funRes ? result.length : inLen;
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

export function cachedValueOf(VectorClass) {
  const Vector = VectorClass.prototype;
  const name = 'valueOf';
  const org = Vector[name];

  Vector[name] = function () {
    if (inProgress === X) {
      inVector = inVector ? maxVector(inVector, this) : this;
    }
    if (inProgress === DEFAULT) {
      return org.call(this);
    }
    return getVectorValue(this, inProgress);
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

export function cachedFactory(VectorClass) {
  return bindCache((...args) => new VectorClass(...args));
}
