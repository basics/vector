import { operatorCalc, cachedValueOf, defineVectorLength } from './operator';

export function hiJackPlayCanvas(pc) {
  const { Vec2, Vec3, Quat } = pc;

  cachedValueOf(Vec2);
  defineVectorLength(Vec2, 2);

  cachedValueOf(Vec3);
  defineVectorLength(Vec3, 3);

  pc.calc = operatorCalc;

  Quat.prototype.left = function () {
    return this.transformVector(Vec3.LEFT, new Vec3());
  };
  Quat.prototype.dir = function () {
    return this.transformVector(Vec3.FORWARD, new Vec3());
  };
  Quat.prototype.up = function () {
    return this.transformVector(Vec3.UP, new Vec3());
  };
  Quat.fromDir = function (dir, up = pc.Vec3.UP) {
    return new pc.Quat().setFromMat4(new pc.Mat4().setLookAt(pc.Vec3.ZERO, dir, up));
  };
}

// eslint-disable-next-line no-undef
const { pc } = typeof window === 'undefined' ? {} : window;
if (!pc) {
  console.warn('no playcanvas in global namespace found');
} else {
  hiJackPlayCanvas(pc);
}
