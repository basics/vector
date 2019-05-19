import { assert } from 'chai';
import {
  victor, ipoint, Victor, vector, point, calc
} from '../src';

describe('mixed 2D and 3D test.', () => {
  it('fetches higher order operand automatically in calc', () => {
    const pos = calc(() => ipoint(5, 6) + victor(1, 2, 3) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 7);
    assert.equal(pos.y, 10);
    assert.equal(pos.z, 6);
  });

  it('works from 2d to 3d', () => {
    const pos = victor(() => victor(0, 0, 0) + ipoint(5, 6) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 10);
    assert.equal(pos.y, 12);
    assert.equal(pos.z, 0);
  });

  it('works from 2d to 3d always', () => {
    const pos = victor(() => ipoint(5, 6) * 2);

    assert.instanceOf(pos, Victor);
    assert.equal(pos.x, 10);
    assert.equal(pos.y, 12);
    assert.equal(pos.z, 0);
  });

  it('should throw error from 3d to 2d', () => {
    assert.throws(() => {
      const pos = ipoint(() => victor(5, 6, 7) * 2);
    }, Error);
  });

  it('should work tranform manually from 3d to 2d', () => {
    const pos = point(() => vector(5, 6, 7).xz * 2);

    assert.equal(pos.x, 10);
    assert.equal(pos.y, 14);
  });
});
