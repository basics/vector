import { cachedValueOf } from '../operator';

export const hijackArray = (ArrayClass) => {
  const { prototype } = ArrayClass;

  Object.defineProperty(prototype, 'x', {
    get() {
      return this[0] || 0;
    },
    set(x) {
      this[0] = x;
    }
  });

  Object.defineProperty(prototype, 'y', {
    get() {
      return this[1] || 0;
    },
    set(y) {
      this[1] = y;
    }
  });

  Object.defineProperty(prototype, 'z', {
    get() {
      return this[2] || 0;
    },
    set(z) {
      this[2] = z;
    }
  });

  cachedValueOf(ArrayClass);

  Object.defineProperty(prototype, 'len', {
    get() {
      return Math.sqrt((this[0] ** 2) + (this[1] ** 2) + (this[2] ** 2)) ** (1 / 2);
    },
    set() {
      throw new Error('set len not allowed');
    }
  });
};
