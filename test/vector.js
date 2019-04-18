import { assert } from 'chai';
import {
  Vector, Victor, vector, victor, calc
} from '../src/vector';
import * as Examples from '../examples';

/**
 * @param {victor | vector} vec3
 * @param {(typeof Vector) | (typeof Victor)} Vec3
 */
const vectorTest = (vec3, Vec3) => {
  it('should create x y z values', () => {
    const pos = vec3(5, 6, 7);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it('should be calculated by assigned statement', () => {
    const pos = vec3(5, 6, 7);
    const dir = vec3(1, 0, 0);
    const scale = calc(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });

  it('should be calculated by assigned statement with only numbers', () => {
    const vec = vec3(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it('calling of calc should automatically detect assigned Vector types', () => {
    const pos = vec3(2, 2, 2);
    const vec = vec3(() => 2 * pos + 3);

    assert.instanceOf(vec, Vec3);
    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it('should compares lengths of vector.', () => {
    const pos = vec3(1, 1, 1);
    const dir = vec3(2, 2, 2);

    assert.isTrue(dir > pos, `${dir} should be longer than ${pos}`);
    assert.isTrue(dir.len > pos.len, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir < pos, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir.len < pos.len, `${dir} should be longer than ${pos}`);
  });

  it('should change length to 1 when calling normalize', () => {
    const pos = vec3(5, 6, 7);
    const dir = pos.normalize();

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });
  /*
  it('should change length to 1 when normalize via arithmetic', () => {
    const pos = vec3(5, 6, 7);
    const dir = calc(() => pos / Math.abs(pos));

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });
*/
  it('should calculate the cross product', () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 1);
    const cross = dir1.cross(dir2);

    assert.equal(cross.x, 1);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross product', () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it('should set opposite axis to 1 when calling the cross also when handling operators', () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);
    const cross = calc(() => dir1.crossNormalize(dir2) * 50);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 50);
  });

  it('should create polar coordinates when calling toAngles()', () => {
    const dir1 = vec3(0, 1, 1).normalize();
    const angles = dir1.toAngles();
    assert.closeTo(angles.theta, 1.57, 0.1);
    assert.closeTo(angles.phi, 0.78, 0.1);
  });

  it('should calculate correct angle between to vectors indepenetend of their lengths', () => {
    const dir1 = vec3(0, 10, 0);
    const dir2 = vec3(-12, 0, 0);

    const angle1 = dir1.angleTo(dir2);
    const angle2 = dir1.normalize().angleTo(dir2.normalize());

    assert.closeTo(angle1, 1.57, 0.1);
    assert.closeTo(angle1, angle2, 0.1);
  });

  it('should create an array with x y z values', () => {
    const dir1 = vec3(7, 10, 12);
    const arr = dir1.toArray();

    assert.closeTo(arr[0], 7, 0.1);
    assert.closeTo(arr[1], 10, 0.1);
    assert.closeTo(arr[2], 12, 0.1);
  });

  it('should be all Vector methods usable inside operation handling', () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);

    const cross1 = calc(() => dir1.crossNormalize(dir2) * (50 + dir1.angleTo(dir2)));
    assert.closeTo(cross1.x, 0, 0.01);
    assert.closeTo(cross1.y, 0, 0.01);
    assert.closeTo(cross1.z, 51.5707, 0.01);

    const cross2 = calc(() => dir1.crossNormalize(dir2) * (50 + dir1.toAngles().phi));
    assert.closeTo(cross2.x, 0, 0.01);
    assert.closeTo(cross2.y, 0, 0.01);
    assert.closeTo(cross2.z, 51.5707, 0.01);

    const cross3 = calc(() => dir1.crossNormalize(dir2) * (50 + dir2.toArray()[0]));
    assert.closeTo(cross3.x, 0, 0.01);
    assert.closeTo(cross3.y, 0, 0.01);
    assert.closeTo(cross3.z, 49, 0.01);
  });

  it('should swizzle x y z values', () => {
    const pos = vec3(5, 6, 7).swizzle('zxy');
    assert.equal(pos.x, 7);
    assert.equal(pos.y, 5);
    assert.equal(pos.z, 6);
  });
};

describe('standard Vector test.', () => {
  vectorTest(vector, Vector);
});

describe('standard Victor test.', () => {
  vectorTest(victor, Victor);
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

  it('should change x y z values when calling local calc method', () => {
    const pos = new Vector(5, 6, 7);
    const res = pos.calc(p => p * 25);

    assert.equal(pos, res);
    assert.equal(pos.x, 125);
    assert.equal(pos.y, 150);
    assert.equal(pos.z, 175);
  });
});

describe('calc test.', () => {
  it('calling of calc should generate only numbers if no vector is in use', () => {
    const vec = calc(() => 2 * 2 + 3);
    assert.equal(vec, 7);
  });
});

/*
describe('performance test', () => {
  it('should be fast', () => {
    let time = new Date().getTime();

    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 6);
    for (let i = 0; i < 10000; i++) {
      const v3 = calc(() => v1.cross(v2) + v2 * v1 - v1 / v2 + (v2 * v2) / v1);
    }
    time = new Date().getTime() - time;
    console.log('perf test fast', `${Math.round(time) / 1000}s`);
  });

  it('should be faster', () => {
    let time = new Date().getTime();

    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 6);

    const fn = () => v1 + v2 * v1 - v1 / v2 + (v2 * v2) / v1;
    for (let i = 0; i < 10000; i++) {
      const v3 = calc(fn);
    }
    time = new Date().getTime() - time;
    console.log('perf test faster', `${Math.round(time) / 1000}s`);
  });
});
*/
