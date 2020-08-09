import { assert } from 'chai';
import { fromOrientation, IQuaternion, calc, iquaternion, victor, degree, LEFT, FORWARD, UP, RIGHT, IMat3 } from '../src';

describe('simple Mat3 tests.', () => {

  it('should lead to different results when changing order', () => {
    const v1 = victor(1, 2, 3);
    const v2 = victor(4, 5, 6);

    const q1 = new IMat3(victor(0.5, 0, 0), victor(0, 1, 0), victor(0, 0, 1));
    const q2 = new IMat3(victor(1, 0, 0), victor(0, 0, 0.5), victor(0, 1, 0));
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
