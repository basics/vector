import { assert } from 'chai';
import { hijackArray, hijackPlayCanvas } from '../../src/adapter/playcanvas';
import { describe, it } from 'vitest';

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vec4 {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

class Quat {}

class Mat3 {}

class Mat4 {}

const math = {};

const pc = {
  Vec2,
  Vec3,
  Vec4,
  Quat,
  Mat3,
  Mat4,
  math
};

describe('override valueOf of playcanvas vector classes', function () {
  it('calculations with the new class', function () {
    hijackPlayCanvas(pc);

    const t1 = pc.vec3(3, 4, 5);
    const t2 = pc.vec3(6, 7, 8);
    const pos = pc.calc(() => t1 + t2 * 2);

    assert.instanceOf(pos, Vec3);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });

  it('calculations with Array class', function () {
    hijackArray(Array);

    const t1 = [3, 4, 5];
    const t2 = [6, 7, 8];
    const pos = pc.calc(() => t1 + t2 * 2);

    assert.instanceOf(pos, Array);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });
});
