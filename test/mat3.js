import { assert } from 'chai';
import { calc, iquaternion, victor, IMat3 } from '../src';
import { describe, it } from 'vitest';

describe('simple Mat3 tests.', function () {
  it('should work with algebraic multiply', function () {
    const v1 = victor(0, 1, 0);
    const v2 = victor(4, 5, 6);
    const q1 = iquaternion(-0.7071067811865475, 0.7071067811865475, 0, 0);
    const q2 = iquaternion(-0.7071067811865475, 0, 0, 0.7071067811865475);

    const vv = calc(() => v1 * v2);
    assert.closeTo(vv.x, 0, 0.001);
    assert.closeTo(vv.y, 5, 0.001);
    assert.closeTo(vv.z, 0, 0.001);

    const q12 = calc(() => q1 * q2);
    assert.closeTo(q12.x, -0.5, 0.001);
    assert.closeTo(q12.y, 0.5, 0.001);
    assert.closeTo(q12.z, 0.5, 0.001);
    assert.closeTo(q12.w, -0.5, 0.001);

    const q21 = calc(() => q2 * q1);
    assert.closeTo(q21.x, -0.5, 0.001);
    assert.closeTo(q21.y, 0.5, 0.001);
    assert.closeTo(q21.z, -0.5, 0.001);
    assert.closeTo(q21.w, -0.5, 0.001);

    const vq = calc(() => v1 * q1);
    assert.closeTo(vq.x, -1, 0.001);
    assert.closeTo(vq.y, 0, 0.001);
    assert.closeTo(vq.z, 0, 0.001);
  });

  it('should lead to different results when changing order', function () {
    const v1 = victor(1, 2, 3);
    const v2 = victor(4, 5, 6);

    // const q1 = new IMat3(victor(0.5, 0, 0), victor(0, 1, 0), victor(0, 0, 1));
    // const q2 = new IMat3(victor(1, 0, 0), victor(0, 0, 0.5), victor(0, 1, 0));
    const q3 = new IMat3(victor(0, -1, 0), victor(-0.5, 0, 0), victor(0, 0, -1));

    const one = calc(() => v1 * q3);
    const two = calc(() => q3 * v1);

    assert.closeTo(one.x, -2, 0.001);
    assert.closeTo(one.y, -0.5, 0.001);
    assert.closeTo(one.z, -3, 0.001);

    assert.closeTo(two.x, -1, 0.001);
    assert.closeTo(two.y, -1, 0.001);
    assert.closeTo(two.z, -3, 0.001);

    const three = calc(() => v1 * q3 * v2);
    const four = calc(() => v1 * (q3 * v2));

    assert.closeTo(three.x, -8, 0.001);
    assert.closeTo(three.y, -2.5, 0.001);
    assert.closeTo(three.z, -18, 0.001);

    assert.closeTo(four.x, -2.5, 0.001);
    assert.closeTo(four.y, -8, 0.001);
    assert.closeTo(four.z, -18, 0.001);
  });
});
