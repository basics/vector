import { assert } from 'chai';
import Vector from '../src';

describe('Vector test.', () => {
  it('should create x y z values', () => {
    const pos = new Vector(5, 6, 7);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it('should be calculated by assigned statement', () => {
    const pos = new Vector(5, 6, 7);
    const dir = new Vector(1, 0, 0);
    const scale = new Vector(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });

  it('should compares lengths of vector.', () => {
    const pos = new Vector(1, 1, 1);
    const dir = new Vector(2, 2, 2);

    assert.isTrue(dir > pos, `${dir} should be longer than ${pos}`);
    assert.isTrue(dir.len > pos.len, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir < pos, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir.len < pos.len, `${dir} should be longer than ${pos}`);
  });

  it('should change length to 1 when calling normalize', () => {
    const pos = new Vector(5, 6, 7);
    const dir = pos.normalize();

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });

  it('should set opposite axis to 1 when calling the cross product', () => {
    const dir1 = new Vector(0, 1, 0);
    const dir2 = new Vector(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('only for readme', () => {
    require('../examples');
  });
});
