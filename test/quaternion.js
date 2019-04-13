import { assert } from 'chai';
import { Victor, calc } from '../src/vector';
import { Quaternion } from '../src/quaternion';

describe('normal Quaternion test.', () => {
  it('should work', () => {
    const pos = new Victor(5, 6, 7);
    // const way = new Victor(1, -1, 0);
    const quat = new Quaternion(0, 1, 0, 1);

    const vec = calc(() => pos * quat);
    console.log('wtf', vec);
    assert.instanceOf(vec, Victor);
  });
});
