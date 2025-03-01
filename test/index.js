import { assert } from 'chai';
import { calc, ipoint, point, vector, Victor, victor } from '../src';
import { cachedFunction, cachedValueOf, operatorCalc } from '../src/operator';
import { describe, it } from 'vitest';

describe('mixed 2D and 3D test.', function () {
  it('fetches higher order operand automatically in calc', function () {
    const pos = calc(() => ipoint(5, 6) + victor(1, 2, 3) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 7);
    assert.equal(pos.y, 10);
    assert.equal(pos.z, 6);
  });

  it('works from 2d to 3d', function () {
    const pos = victor(() => victor(0, 0, 0) + ipoint(5, 6) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 10);
    assert.equal(pos.y, 12);
    assert.equal(pos.z, 0);
  });

  it('works from 2d to 3d always', function () {
    const pos = victor(() => ipoint(5, 6) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 10);
    assert.equal(pos.y, 12);
    assert.equal(pos.z, 0);
  });

  it('should throw error from 3d to 2d', function () {
    assert.throws(() => ipoint(() => victor(5, 6, 7) * 2));
  });

  it('should work tranform manually from 3d to 2d', function () {
    const pos = point(() => vector(5, 6, 7).xz * 2);

    assert.equal(pos.x, 10);
    assert.equal(pos.y, 14);
  });
});

class Tuple {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

cachedValueOf(Tuple);
const tupleFactory = cachedFunction((x, y, z) => new Tuple(x, y, z));
const tuple = (x, y, z) => {
  if (typeof x === 'function') {
    return operatorCalc(x, new Tuple());
  }
  return tupleFactory(x, y, z);
};

describe('override valueOf of a new class', function () {
  it('alculations with the new class', function () {
    const t1 = tuple(3, 4, 5);
    const t2 = tuple(6, 7, 8);
    const pos = tuple(() => t1 + t2 * 2);

    assert.instanceOf(pos, Tuple);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });
});
