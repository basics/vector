import { assert } from 'chai';
import { calc, icolor, IColor, Color, color } from '../src/color';
import { describe, it } from 'vitest';

const colorTest = (color, Color) => {
  it('should create empty color', function () {
    const pos = color();
    assert.equal(pos.x, 0);
    assert.equal(pos.y, 0);
  });

  it('should create x y values', function () {
    const pos = color(5, 6, 7, 8);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
    assert.equal(pos.w, 8);
  });

  it('should create x y values via array', function () {
    const pos = color([5, 6, 7, 8]);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
    assert.equal(pos.z, 7);
    assert.equal(pos.w, 8);
  });

  it('should be calculated by assigned statement', function () {
    const pos = color(5, 6, 7, 8);
    const dir = color(1, 0, 1, 1);
    const scale = color(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 7);
    assert.equal(scale.w, 8);
  });

  it('should be calculated by assigned statement with only numbers', function () {
    const vec = color(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
  });

  it('calling of calc should automatically detect assigned Color types', function () {
    const pos = color(2, 2);
    const vec = color(() => 2 * pos + 3);

    assert.instanceOf(vec, Color);
    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
  });

  it('should create an array with x y values', function () {
    const dir1 = color(7, 10);
    const arr = dir1.toArray();

    assert.closeTo(arr[0], 7, 0.1);
    assert.closeTo(arr[1], 10, 0.1);
  });

  it('should be iterable like an array with x y values', function () {
    const dir1 = color(7, 10, 12);
    const [x, y] = [...dir1];

    assert.closeTo(x, 7, 0.1);
    assert.closeTo(y, 10, 0.1);
  });

  it('should be destructable like an object with x y pairs', function () {
    const { x, y } = color(7, 10, 12);

    assert.closeTo(x, 7, 0.1);
    assert.closeTo(y, 10, 0.1);
  });

  it('should throw an error when using calc function directly with ||', function () {
    const dir0 = color(4, 4);
    const pos0 = color(6, 0);

    assert.throws(() => calc(() => pos0 * dir0 || pos0));
  });

  it('should work when using calc function indirectly with ||', function () {
    const dir0 = color(4, 4);
    const pos0 = color(6, 0);

    const res0 = calc(() => pos0 * dir0 || +pos0);

    assert.equal(res0.x, 24);
    assert.equal(res0.y, 0);

    const dir1 = color(0, 0);
    const pos1 = color(6, 0);

    const res1 = calc(() => pos1 * dir1 || +pos1);

    assert.equal(res1.x, 6);
    assert.equal(res1.y, 0);
  });

  it('should throw an error when using calc function directly returns vector', function () {
    const dir0 = color(4, 4);

    assert.throws(() => calc(() => dir0));
  });

  it('should work when using calc function indirectly returns vector', function () {
    const dir0 = color(4, 4);

    const res0 = calc(() => +dir0);

    assert.equal(res0.x, 4);
    assert.equal(res0.y, 4);
  });

  it('conditional checks inside calc should throw error', function () {
    const dir0 = color(4, 2);

    assert.throws(() => calc(() => (dir0 > 3 ? true : false)));
  });

  it('should work when toString() to generate a valid json string', function () {
    const dir0 = color(4, 4.5);
    const json = JSON.parse(dir0.toString());

    assert.equal(json.x, 4);
    assert.equal(json.y, 4.5);
  });

  it('should work when calling factory via json object', function () {
    const dir0 = color({
      x: 4,
      y: 4.5
    });

    assert.equal(dir0.x, 4);
    assert.equal(dir0.y, 4.5);
  });

  it('calculate directly outside of calc should throw an error.', function () {
    const pos = color(1, 1, 1);
    const dir = color(2, 2, 2);

    assert.throws(() => pos + dir);
  });
};

describe('standard Color test.', function () {
  colorTest(color, Color);
});

describe('standard IColor test.', function () {
  colorTest(icolor, IColor);
});
