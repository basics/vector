import { assert } from "chai";
import { Vector, Victor, vector, victor, calc } from "../src/vector";
import "../examples";

/**
 * @param {(typeof vector) | (typeof victor)} vec3
 * @param {(typeof Vector) | (typeof Victor)} Vec3
 */
const vectorTest = (vec3, Vec3) => {
  it("should create empty vector", () => {
    const pos = vec3();
    assert.equal(pos.x, 0);
    assert.equal(pos.y, 0);
    assert.equal(pos.z, 0);
  });

  it("should create x y z values", () => {
    const pos = vec3(5, 6, 7);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it("should create x y z values via array", () => {
    const pos = vec3([5, 6, 7]);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });

  it("should be calculated by assigned statement", () => {
    const pos = vec3(5, 6, 7);
    const dir = vec3(1, 0, 0);
    const scale = vec3(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });

  it("should be calculated by assigned statement with only numbers", () => {
    const vec = vec3(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it("calling of calc should automatically detect assigned Vector types", () => {
    const pos = vec3(2, 2, 2);
    const vec = vec3(() => 2 * pos + 3);

    assert.instanceOf(vec, Vec3);
    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
    assert.equal(vec.z, 7);
  });

  it("should change length to 1 when calling normalize", () => {
    const pos = vec3(5, 6, 7);
    const dir = pos.normalize();

    const length = dir.length;
    assert(
      length > 0.99 && length < 1.01,
      `${dir} should have length 1, but is ${length}`
    );
  });

  it("should change length to 1 when normalize via arithmetic", () => {
    const pos = vec3(5, 6, 7);
    const dir = vec3(() => pos / pos.length);

    const length = dir.length;
    assert(
      length > 0.99 && length < 1.01,
      `${dir} should have length 1, but is ${length}`
    );
  });

  it("should calculate the cross product", () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 1);
    const cross = dir1.cross(dir2);

    assert.equal(cross.x, 1);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it("should set opposite axis to 1 when calling the cross product", () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);
    const cross = dir1.crossNormalize(dir2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
  });

  it("should set opposite axis to 1 when calling the cross also when handling operators", () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);
    const cross = vec3(() => dir1.crossNormalize(dir2) * 50);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 50);
  });

  it("should create polar coordinates when calling toAngles()", () => {
    const dir1 = vec3(0, 1, 1).normalize();
    const angles = dir1.toAngles();
    assert.closeTo(angles.theta, 1.57, 0.1);
    assert.closeTo(angles.phi, 0.78, 0.1);
  });

  it("should calculate correct angle between to vectors indepenetend of their lengths", () => {
    const dir1 = vec3(0, 10, 0);
    const dir2 = vec3(-12, 0, 0);

    const angle1 = dir1.angleTo(dir2);
    const angle2 = dir1.normalize().angleTo(dir2.normalize());

    assert.closeTo(angle1, 1.57, 0.1);
    assert.closeTo(angle1, angle2, 0.1);
  });

  it("should create an array with x y z values", () => {
    const dir1 = vec3(7, 10, 12);
    const arr = dir1.toArray();

    assert.closeTo(arr[0], 7, 0.1);
    assert.closeTo(arr[1], 10, 0.1);
    assert.closeTo(arr[2], 12, 0.1);
  });

  it("should be iterable like an array with x y z values", () => {
    const dir1 = vec3(7, 10, 12);
    const [x, y, z] = [...dir1];

    assert.closeTo(x, 7, 0.1);
    assert.closeTo(y, 10, 0.1);
    assert.closeTo(z, 12, 0.1);
  });

  it("should be destructable like an object with x y z pairs", () => {
    const { x, y, z } = vec3(7, 10, 12);

    assert.closeTo(x, 7, 0.1);
    assert.closeTo(y, 10, 0.1);
    assert.closeTo(z, 12, 0.1);
  });

  it("should be all Vector methods usable inside operation handling", () => {
    const dir1 = vec3(0, 1, 0);
    const dir2 = vec3(-1, 0, 0);

    const cross1 = vec3(
      () => dir1.crossNormalize(dir2) * (50 + dir1.angleTo(dir2))
    );
    assert.closeTo(cross1.x, 0, 0.01);
    assert.closeTo(cross1.y, 0, 0.01);
    assert.closeTo(cross1.z, 51.5707, 0.01);

    const cross2 = vec3(
      () => dir1.crossNormalize(dir2) * (50 + dir1.toAngles().phi)
    );
    assert.closeTo(cross2.x, 0, 0.01);
    assert.closeTo(cross2.y, 0, 0.01);
    assert.closeTo(cross2.z, 51.5707, 0.01);

    const cross3 = vec3(
      () => dir1.crossNormalize(dir2) * (50 + dir2.toArray()[0])
    );
    assert.closeTo(cross3.x, 0, 0.01);
    assert.closeTo(cross3.y, 0, 0.01);
    assert.closeTo(cross3.z, 49, 0.01);
  });

  it("should swizzle x y z values", () => {
    const pos = vec3(5, 6, 7).swizzle("zxy");
    assert.equal(pos.x, 7);
    assert.equal(pos.y, 5);
    assert.equal(pos.z, 6);
  });

  it("should work when using calc function directly returns vector", () => {
    const dir0 = vec3(4, 4, 0);

    assert.throws(() => calc(() => dir0));
  });

  it("should work when using calc function indirectly returns vector", () => {
    const dir0 = vec3(4, 4, 0);

    const res0 = calc(() => +dir0);

    assert.equal(res0.x, 4);
    assert.equal(res0.y, 4);
    assert.equal(res0.z, 0);
  });

  it("should throw an error when using calc function directly with ||", () => {
    const dir0 = vec3(4, 4, 0);
    const pos0 = vec3(6, 0, 0);

    assert.throws(() => calc(() => pos0 * dir0 || pos0));
  });

  it("should work when using calc function indirectly with ||", () => {
    const dir0 = vec3(4, 4, 0);
    const pos0 = vec3(6, 0, 0);

    const res0 = calc(() => pos0 * dir0 || +pos0);

    assert.equal(res0.x, 24);
    assert.equal(res0.y, 0);
    assert.equal(res0.z, 0);

    const dir1 = vec3(0, 0, 0);
    const pos1 = vec3(6, 0, 0);

    const res1 = calc(() => pos1 * dir1 || +pos1);

    assert.equal(res1.x, 6);
    assert.equal(res1.y, 0);
    assert.equal(res1.z, 0);
  });

  it("conditional checks inside calc should throw error", () => {
    const dir0 = vec3(4, 2, 5);

    assert.throws(() => calc(() => (dir0 > 3 ? true : false)));
  });

  it("should work when toString() to generate a valid json string", () => {
    const dir0 = vec3(4, 5, 4.5);
    const json = JSON.parse(dir0.toString());

    assert.equal(json.x, 4);
    assert.equal(json.y, 5);
    assert.equal(json.z, 4.5);
  });

  it("should work when calling factory via json object", () => {
    const dir0 = vec3({ x: 4, y: 5, z: 4.5 });

    assert.equal(dir0.x, 4);
    assert.equal(dir0.y, 5);
    assert.equal(dir0.z, 4.5);
  });

  it("calculate directly outside of calc should throw an error.", () => {
    const pos = vec3(1, 1, 1);
    const dir = vec3(2, 2, 2);

    assert.throws(() => (pos + dir));
  });

};

describe("standard Vector test.", () => {
  vectorTest(vector, Vector);
});

describe("standard Victor test.", () => {
  vectorTest(victor, Victor);
});

describe("special Victor test.", () => {
  it("should throw error when tying to change x y z values", () => {
    const pos = victor(5, 6, 7);

    assert.throws(() => (pos.x = 27));
    assert.equal(pos.x, 5);
    assert.throws(() => (pos.y = 28));
    assert.equal(pos.y, 6);
    assert.throws(() => (pos.z = 29));
    assert.equal(pos.z, 7);
  });

  it("should toVector() create a mutable Vector copy", () => {
    const ipos = victor(5, 6, 7);
    const pos = ipos.toVector();

    assert.instanceOf(pos, Vector);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
  });
});

describe("special Vector test.", () => {
  it("should change x y z values when setting directly", () => {
    const pos = vector(5, 6, 7);

    pos.x = 27;
    assert.equal(pos.x, 27);
    pos.y = 28;
    assert.equal(pos.y, 28);
    pos.z = 29;
    assert.equal(pos.z, 29);
  });

  it("should change x y z values when calling local calc method", () => {
    const pos = vector(5, 6, 7);
    const res = pos.calc(p => p * 25);

    assert.isTrue(pos === res);
    assert.equal(pos, res);
    assert.equal(pos.x, 125);
    assert.equal(pos.y, 150);
    assert.equal(pos.z, 175);
  });

  it("should work throw error when using local calc method with directly ||", () => {
    const dir0 = vector(4, 4, 0);
    const pos0 = vector(6, 0, 0);

    assert.throws(() => pos0.calc(p => p * dir0 || p));

    const dir1 = vector(0, 0, 0);
    const pos1 = vector(6, 0, 0);

    assert.throws(() => pos1.calc(p => p * dir1 || p));
  });

  it("should work when using local calc method with indirect ||", () => {
    const dir0 = vector(4, 4, 0);
    const pos0 = vector(6, 0, 0);

    const res0 = pos0.calc(p => p * dir0 || +p);

    assert.isTrue(pos0 === res0);
    assert.equal(pos0, res0);
    assert.equal(res0.x, 24);
    assert.equal(res0.y, 0);
    assert.equal(res0.z, 0);

    const dir1 = vector(0, 0, 0);
    const pos1 = vector(6, 0, 0);

    const res1 = pos1.calc(p => p * dir1 || +p);

    assert.isTrue(pos1 === res1);
    assert.equal(pos1, res1);
    assert.equal(res1.x, 6);
    assert.equal(res1.y, 0);
    assert.equal(res1.z, 0);
  });

  it("should work throw an error using local calc method directly returns vector", () => {
    const dir0 = vector(4, 4, 0);
    const pos0 = vector(6, 0, 0);

    assert.throws(() => pos0.calc(() => dir0));
  });

  it("should work when using local calc method indirectly returns vector", () => {
    const dir0 = vector(4, 4, 0);
    const pos0 = vector(6, 0, 0);

    const res0 = pos0.calc(() => +dir0);

    assert.isTrue(pos0 === res0);
    assert.equal(pos0, res0);
    assert.equal(res0.x, 4);
    assert.equal(res0.y, 4);
    assert.equal(res0.z, 0);
  });
});

describe("calc test.", () => {
  it("calling of calc should generate only numbers if no vector is in use", () => {
    const vec = calc(() => 2 * 2 + 3);
    assert.equal(vec, 7);
  });
});

/*
describe('performance test', () => {
  it('should be fast', () => {
    let time = new Date().getTime();

    const v1 = vector(1, 2, 3);
    const v2 = vector(4, 5, 6);
    for (let i = 0; i < 10000; i++) {
      const v3 = calc(() => v1.cross(v2) + v2 * v1 - v1 / v2 + (v2 * v2) / v1);
    }
    time = new Date().getTime() - time;
    console.log('perf test fast', `${Math.round(time) / 1000}s`);
  });

  it('should be faster', () => {
    let time = new Date().getTime();

    const v1 = vector(1, 2, 3);
    const v2 = vector(4, 5, 6);

    const fn = () => v1 + v2 * v1 - v1 / v2 + (v2 * v2) / v1;
    for (let i = 0; i < 10000; i++) {
      const v3 = calc(fn);
    }
    time = new Date().getTime() - time;
    console.log('perf test faster', `${Math.round(time) / 1000}s`);
  });
});
*/
