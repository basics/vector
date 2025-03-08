import { assert } from 'chai';
import { hijackArray } from '../../src/adapter/array';
import { calc } from '../../src/index';
import { describe, it } from 'vitest';

describe('override valueOf of Array', function () {
  it('calculations with the arrays created by [] operator', function () {
    hijackArray(Array);

    const t1 = [3, 4, 5];
    const t2 = [6, 7, 8];
    const pos = calc(() => t1 + t2 * 2);

    assert.instanceOf(pos, Array);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });
});
