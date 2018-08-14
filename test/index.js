import { assert } from 'chai';
import { Vector, IVector } from '../src';

describe('standard Vector test.', () => {
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

  it('should be calculated by assigned statement with only numbers', () => {
    const vec = new Vector(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
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

  it('should calculate the cross product', () => {
    const dir1 = new Vector(0, 1, 0);
    const dir2 = new Vector(-1, 0, 1);
    const cross = dir1.cross(dir2);

    assert.equal(cross.x, 1);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross product', () => {
    const dir1 = new Vector(0, 1, 0);
    const dir2 = new Vector(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross also when handling operators', () => {
    const dir1 = new Vector(0, 1, 0);
    const dir2 = new Vector(-1, 0, 0);
    const cross = new Vector(() => dir1.crossNormalize(dir2) * 50);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 50);
  });
});

describe('standard IVector test.', () => {
  it('should create x y z values', () => {
    const pos = new Vector(5, 6, 7);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it('should be calculated by assigned statement', () => {
    const pos = new IVector(5, 6, 7);
    const dir = new IVector(1, 0, 0);
    const scale = new IVector(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });

  it('should be calculated by assigned statement with only numbers', () => {
    const vec = new IVector(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it('should compares lengths of vector.', () => {
    const pos = new IVector(1, 1, 1);
    const dir = new IVector(2, 2, 2);

    assert.isTrue(dir > pos, `${dir} should be longer than ${pos}`);
    assert.isTrue(dir.len > pos.len, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir < pos, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir.len < pos.len, `${dir} should be longer than ${pos}`);
  });

  it('should change length to 1 when calling normalize', () => {
    const pos = new IVector(5, 6, 7);
    const dir = pos.normalize();

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });

  it('should calculate the cross product', () => {
    const dir1 = new IVector(0, 1, 0);
    const dir2 = new IVector(-1, 0, 1);
    const cross = dir1.cross(dir2);

    assert.equal(cross.x, 1);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross product', () => {
    const dir1 = new IVector(0, 1, 0);
    const dir2 = new IVector(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross also when handling operators', () => {
    const dir1 = new IVector(0, 1, 0);
    const dir2 = new IVector(-1, 0, 0);
    const cross = new Vector(() => dir1.crossNormalize(dir2) * 50);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 50);
  });
});

describe('special IVector test.', () => {
  it('should throw error when tying to change x y z values', () => {
    const pos = new IVector(5, 6, 7);

    assert.throws(() => (pos.x = 27), Error);
    assert.equal(pos.x, 5);
    assert.throws(() => (pos.y = 28), Error);
    assert.equal(pos.y, 6);
    assert.throws(() => (pos.z = 29), Error);
    assert.equal(pos.z, 7);
  });

  it('should toVector() create a mutable Vector copy', () => {
    const ipos = new IVector(5, 6, 7);
    const pos = ipos.toVector();

    assert.instanceOf(pos, Vector);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });
});

describe('special Vector test.', () => {
  it('should change x y z values when setting directly', () => {
    const pos = new Vector(5, 6, 7);

    pos.x = 27;
    assert.equal(pos.x, 27);
    pos.y = 28;
    assert.equal(pos.y, 28);
    pos.z = 29;
    assert.equal(pos.z, 29);
  });
});
