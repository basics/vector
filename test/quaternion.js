import { assert } from 'chai';
import { fromOrientation, IQuaternion, calc, iquaternion, victor, degree, LEFT, FORWARD, UP, RIGHT } from '../src';

describe('simple Quaternion tests.', () => {
  const LEFT90 = iquaternion(LEFT, degree(90));

  function fromOrientationSlow({ alpha, beta, gamma }, orientation) {
    const up = iquaternion(UP, degree(alpha));
    const right = iquaternion(RIGHT, degree(beta));
    const forward = iquaternion(FORWARD, degree(gamma));

    let rot = calc(() => up * right * forward * LEFT90);
    const dir = iquaternion(rot.dir, degree(orientation));
    rot = calc(() => dir * rot);

    return rot;

  }

  it('should work with fromOrientation', () => {
    const alpha = fromOrientation({ alpha: 90, beta: 0, gamma: 0 }, 90);
    assert.instanceOf(alpha, IQuaternion);
    assert.closeTo(alpha.x, -0.7071067811865475, 0.001);
    assert.closeTo(alpha.y, 0, 0.001);
    assert.closeTo(alpha.z, 0, 0.001);
    assert.closeTo(alpha.w, 0.7071067811865475, 0.001);

    const beta = fromOrientation({ alpha: 0, beta: 90, gamma: 0 }, 90);
    assert.closeTo(beta.x, 0, 0.001);
    assert.closeTo(beta.y, 0, 0.001);
    assert.closeTo(beta.z, -0.7071067811865475, 0.001);
    assert.closeTo(beta.w, 0.7071067811865475, 0.001);

    const gamma = fromOrientation({ alpha: 0, beta: 0, gamma: 90 }, 90);
    assert.closeTo(gamma.x, -0.7071067811865475, 0.001);
    assert.closeTo(gamma.y, 0, 0.001);
    assert.closeTo(gamma.z, -0.7071067811865476, 0.001);
    assert.closeTo(gamma.w, 0, 0.001);

    const test1 = fromOrientation({ alpha: 90, beta: 90, gamma: 90 }, 90);
    assert.closeTo(test1.x, -0.7071067811865475, 0.001);
    assert.closeTo(test1.y, 0.7071067811865475, 0.001);
    assert.closeTo(test1.z, 0, 0.001);
    assert.closeTo(test1.w, 0, 0.001);

    const test2 = fromOrientation({ alpha: -90, beta: -90, gamma: -90 }, 0);
    assert.closeTo(test2.x, -1, 0.001);
    assert.closeTo(test2.y, 0, 0.001);
    assert.closeTo(test2.z, 0, 0.001);
    assert.closeTo(test2.w, 0, 0.001);
  });

  it('should work with fromOrientation via calc', () => {
    const alpha = fromOrientationSlow({ alpha: 90, beta: 0, gamma: 0 }, 90);
    assert.instanceOf(alpha, IQuaternion);
    assert.closeTo(alpha.x, -0.7071067811865475, 0.001);
    assert.closeTo(alpha.y, 0, 0.001);
    assert.closeTo(alpha.z, 0, 0.001);
    assert.closeTo(alpha.w, 0.7071067811865475, 0.001);

    const beta = fromOrientationSlow({ alpha: 0, beta: 90, gamma: 0 }, 90);
    assert.closeTo(beta.x, 0, 0.001);
    assert.closeTo(beta.y, 0, 0.001);
    assert.closeTo(beta.z, -0.7071067811865475, 0.001);
    assert.closeTo(beta.w, 0.7071067811865475, 0.001);

    const gamma = fromOrientationSlow({ alpha: 0, beta: 0, gamma: 90 }, 90);
    assert.closeTo(gamma.x, -0.7071067811865475, 0.001);
    assert.closeTo(gamma.y, 0, 0.001);
    assert.closeTo(gamma.z, -0.7071067811865476, 0.001);
    assert.closeTo(gamma.w, 0, 0.001);

    const test1 = fromOrientationSlow({ alpha: 90, beta: 90, gamma: 90 }, 90);
    assert.closeTo(test1.x, -0.7071067811865475, 0.001);
    assert.closeTo(test1.y, 0.7071067811865475, 0.001);
    assert.closeTo(test1.z, 0, 0.001);
    assert.closeTo(test1.w, 0, 0.001);

    const test2 = fromOrientationSlow({ alpha: -90, beta: -90, gamma: -90 }, 0);
    assert.closeTo(test2.x, -1, 0.001);
    assert.closeTo(test2.y, 0, 0.001);
    assert.closeTo(test2.z, 0, 0.001);
    assert.closeTo(test2.w, 0, 0.001);
  });

  it('should work with algebraic multiply', () => {
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

  it('should work throw error when using algebraic multiply wrong', () => {
    const v1 = victor(0, 1, 0);
    const q1 = iquaternion(-0.7071067811865475, 0.7071067811865475, 0, 0);

    assert.throws(() => (calc(() => v1 * q1 + 5)));
    assert.throws(() => (calc(() => q1 * 0)));
    assert.throws(() => (calc(() => q1 ** q1)));
    assert.throws(() => (calc(() => q1 * q1 + v1)));
  });
});
