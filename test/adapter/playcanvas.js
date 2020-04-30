import { assert } from 'chai';
import { hijackPlayCanvas } from '../../src/adapter/playcanvas';

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

class Quat { };

const math = {};

const pc = {
  Vec2,
  Vec3,
  Quat,
  math
};

describe('override valueOf of playcanvas Vec3', () => {
  it('calculations with the new class', () => {
    hijackPlayCanvas(pc);

    const t1 = pc.vec3(3, 4, 5);
    const t2 = pc.vec3(6, 7, 8);
    const pos = pc.calc(() => t1 + t2 * 2);

    assert.instanceOf(pos, Vec3);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });
});
