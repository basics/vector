import { assert } from 'chai';
import { operatorCalc } from '../src/operator';
import { vectorArray } from '../src/array';
import { describe, it } from 'vitest';

describe('standard Array test.', function () {
  it('should create x y z values', function () {
    const pos = vectorArray(5, 6, 7);
    assert.equal(pos[0], 5);
    assert.equal(pos[1], 6);
    assert.equal(pos[2], 7);
  });

  it('should create x y z values via array', function () {
    const pos = vectorArray([5, 6, 7]);
    assert.equal(pos[0], 5);
    assert.equal(pos[1], 6);
    assert.equal(pos[2], 7);
  });

  it('should be calculated by assigned statement', function () {
    const pos = vectorArray(5, 6);
    const dir = vectorArray(3, 0);
    const scale = operatorCalc(() => dir * pos);

    assert.equal(scale[0], 15);
    assert.equal(scale[1], 0);
  });

  it('should work with mixed 4d and 3d array', function () {
    const pos = vectorArray(5, 6, 7, 8);
    const dir = vectorArray(3, 0, 2);
    const scale = operatorCalc(() => dir * pos);

    assert.equal(scale[0], 15);
    assert.equal(scale[1], 0);
    assert.equal(scale[2], 14);
    assert.equal(scale[3], 0);
  });

  it('calling of calc should automatically detect assigned Vector types', function () {
    const pos = vectorArray(2, 2, 2);
    const vec = operatorCalc(() => 2 * pos + 3);

    assert.instanceOf(vec, Array);
    assert.equal(vec[0], 7);
    assert.equal(vec[1], 7);
    assert.equal(vec[2], 7);
  });
});
