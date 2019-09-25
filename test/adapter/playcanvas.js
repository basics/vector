import { assert } from 'chai';
import { hiJackPlayCanvas } from '../../src/adapter/playcanvas';

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

const pc = {
  Vec2,
  Vec3,
  Quat,
};

describe('override valueOf of a new class', () => {
  it('calculations with the new class', () => {
    hiJackPlayCanvas(pc);

    const t1 = new Vec3(3, 4, 5);
    const t2 = new Vec3(6, 7, 8);
    const pos = pc.calc(() => t1 + t2 * 2);

    assert.instanceOf(pos, Vec3);
    assert.equal(pos.x, 15);
    assert.equal(pos.y, 18);
    assert.equal(pos.z, 21);
  });
});
