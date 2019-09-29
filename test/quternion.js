import { assert } from 'chai';
import { fromOrientation, IQuaternion } from '../src/quaternion';

describe('simple Quaternino tests.', () => {
  it('should work with fromOrientation', () => {
    const alpha = fromOrientation({ alpha: 90, beta: 0, gamma: 0 }, 90);
    assert.instanceOf(alpha, IQuaternion);
    console.log(`alpha ${alpha}`);
    assert.closeTo(alpha.x, -0.7071067811865475, 0.001);
    assert.closeTo(alpha.y, 0, 0.001);
    assert.closeTo(alpha.z, 0, 0.001);
    assert.closeTo(alpha.w, 0.7071067811865475, 0.001);

    const beta = fromOrientation({ alpha: 0, beta: 90, gamma: 0 }, 90);
    console.log(`beta ${beta}`);
    assert.closeTo(beta.x, 0, 0.001);
    assert.closeTo(beta.y, 0, 0.001);
    assert.closeTo(beta.z, -0.7071067811865475, 0.001);
    assert.closeTo(beta.w, 0.7071067811865475, 0.001);

    const gamma = fromOrientation({ alpha: 0, beta: 0, gamma: 90 }, 90);
    console.log(`gamma ${gamma}`);
    assert.closeTo(gamma.x, -0.7071067811865475, 0.001);
    assert.closeTo(gamma.y, 0, 0.001);
    assert.closeTo(gamma.z, -0.7071067811865476, 0.001);
    assert.closeTo(gamma.w, 0, 0.001);
  });
});
