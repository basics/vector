import { assert } from 'chai';
import { Victor, calc, debugCalc } from '../src/vector';
import { Quaternion } from '../src/quaternion';

describe('Quaternion tests.', () => {
  it('should work vector * quat', () => {
    const pos = new Victor(5, 6, 7);
    // const way = new Victor(1, -1, 0);
    const quat = new Quaternion(0, 1, 0, 1);

    const vec = calc(() => pos * quat);

    const vecOld = quat.apply(pos);

    assert.instanceOf(vec, Victor);

    assert.equal(vec.x, vecOld.x);
    assert.equal(vec.y, vecOld.y);
    assert.equal(vec.z, vecOld.z);
  });

  it('should work quat * vector', () => {
    const pos = new Victor(5, 6, 7);
    // const way = new Victor(1, -1, 0);
    const quat = new Quaternion(0, 1, 0, 1);

    const vec = calc(() => quat * pos);

    const vecOld = quat.apply(pos);

    assert.instanceOf(vec, Victor);

    assert.equal(vec.x, vecOld.x);
    assert.equal(vec.y, vecOld.y);
    assert.equal(vec.z, vecOld.z);
  });
});
