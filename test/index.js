import { assert } from 'chai';
import { Vector, Victor, calc } from '../src';
import * as Examples from '../examples';

const vectorTest = (Vec3) => {
  it('should create x y z values', () => {
    const pos = new Vec3(5, 6, 7);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it('should be calculated by assigned statement', () => {
    const pos = new Vec3(5, 6, 7);
    const dir = new Vec3(1, 0, 0);
    const scale = new Vec3(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });

  it('should be calculated by assigned statement with only numbers', () => {
    const vec = new Vec3(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it('calling of calc should automatically detect assigned Vector types', () => {
    const pos = new Vec3(2, 2, 2);
    const vec = calc(() => 2 * pos + 3);

    assert.instanceOf(vec, Vec3);
    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it('should compares lengths of vector.', () => {
    const pos = new Vec3(1, 1, 1);
    const dir = new Vec3(2, 2, 2);

    assert.isTrue(dir > pos, `${dir} should be longer than ${pos}`);
    assert.isTrue(dir.len > pos.len, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir < pos, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir.len < pos.len, `${dir} should be longer than ${pos}`);
  });

  it('should change length to 1 when calling normalize', () => {
    const pos = new Vec3(5, 6, 7);
    const dir = pos.normalize();

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });

  it('should calculate the cross product', () => {
    const dir1 = new Vec3(0, 1, 0);
    const dir2 = new Vec3(-1, 0, 1);
    const cross = dir1.cross(dir2);

    assert.equal(cross.x, 1);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross product', () => {
    const dir1 = new Vec3(0, 1, 0);
    const dir2 = new Vec3(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross also when handling operators', () => {
    const dir1 = new Vec3(0, 1, 0);
    const dir2 = new Vec3(-1, 0, 0);
    const cross = new Vec3(() => dir1.crossNormalize(dir2) * 50);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 50);
  });

  it('should create polar coordinates when calling toAngles()', () => {
    const dir1 = new Vec3(0, 1, 1).normalize();
    const angles = dir1.toAngles();
    assert.closeTo(angles.theta, 1.57, 0.1);
    assert.closeTo(angles.phi, 0.78, 0.1);
  });

  it('should calculate correct angle between to vectors indepenetend of their lengths', () => {
    const dir1 = new Vec3(0, 10, 0);
    const dir2 = new Vec3(-12, 0, 0);

    const angle1 = dir1.angleTo(dir2);
    const angle2 = dir1.normalize().angleTo(dir2.normalize());

    assert.closeTo(angle1, 1.57, 0.1);
    assert.closeTo(angle1, angle2, 0.1);
  });

  it('should create an array with x y z values', () => {
    const dir1 = new Vec3(7, 10, 12);
    const arr = dir1.toArray();

    assert.closeTo(arr[0], 7, 0.1);
    assert.closeTo(arr[1], 10, 0.1);
    assert.closeTo(arr[2], 12, 0.1);
  });

  it('should be all Vector methods usable inside operation handling', () => {
    const dir1 = new Vec3(0, 1, 0);
    const dir2 = new Vec3(-1, 0, 0);

    const cross1 = new Vec3(() => dir1.crossNormalize(dir2) * (50 + dir1.angleTo(dir2)));
    assert.closeTo(cross1.x, 0, 0.01);
    assert.closeTo(cross1.y, 0, 0.01);
    assert.closeTo(cross1.z, 51.5707, 0.01);

    const cross2 = new Vec3(() => dir1.crossNormalize(dir2) * (50 + dir1.toAngles().phi));
    assert.closeTo(cross2.x, 0, 0.01);
    assert.closeTo(cross2.y, 0, 0.01);
    assert.closeTo(cross2.z, 51.5707, 0.01);

    const cross3 = new Vec3(() => dir1.crossNormalize(dir2) * (50 + dir2.toArray()[0]));
    assert.closeTo(cross3.x, 0, 0.01);
    assert.closeTo(cross3.y, 0, 0.01);
    assert.closeTo(cross3.z, 49, 0.01);
  });
};

describe('standard Vector test.', () => {
  vectorTest(Vector);
});

describe('standard Victor test.', () => {
  vectorTest(Victor);
});

describe('special Victor test.', () => {
  it('should throw error when tying to change x y z values', () => {
    const pos = new Victor(5, 6, 7);

    assert.throws(() => (pos.x = 27), Error);
    assert.equal(pos.x, 5);
    assert.throws(() => (pos.y = 28), Error);
    assert.equal(pos.y, 6);
    assert.throws(() => (pos.z = 29), Error);
    assert.equal(pos.z, 7);
  });

  it('should toVector() create a mutable Vector copy', () => {
    const ipos = new Victor(5, 6, 7);
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

describe('calc test.', () => {
  it('calling of calc should generate only numbers if no vector is in use', () => {
    const vec = calc(() => 2 * 2 + 3);
    assert.equal(vec, 7);
  });
});
