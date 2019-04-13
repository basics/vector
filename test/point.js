import { assert } from 'chai';
import { Point, IPoint, calc } from '../src/point';

const pointTest = (Vec2) => {
  it('should create x y values', () => {
    const pos = new Vec2(5, 6);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
  });

  it('should be calculated by assigned statement', () => {
    const pos = new Vec2(5, 6);
    const dir = new Vec2(1, 0);
    const scale = new Vec2(() => dir * pos);

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
  });

  it('should be calculated by assigned statement with only numbers', () => {
    const vec = new Vec2(() => 2 * 2 + 3);

    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
  });

  it('calling of calc should automatically detect assigned Point types', () => {
    const pos = new Vec2(2, 2);
    const vec = calc(() => 2 * pos + 3);

    assert.instanceOf(vec, Vec2);
    assert.equal(vec.x, 7);
    assert.equal(vec.y, 7);
  });

  it('should compares lengths of point.', () => {
    const pos = new Vec2(1, 1);
    const dir = new Vec2(2, 2);

    assert.isTrue(dir > pos, `${dir} should be longer than ${pos}`);
    assert.isTrue(dir.len > pos.len, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir < pos, `${dir} should be longer than ${pos}`);
    assert.isFalse(dir.len < pos.len, `${dir} should be longer than ${pos}`);
  });

  it('should change length to 1 when calling normalize', () => {
    const pos = new Vec2(5, 6);
    const dir = pos.normalize();

    const length = dir.length;
    assert(length > 0.99 && length < 1.01, `${dir} should have length 1, but is ${length}`);
  });

  it('should create polar coordinates when calling toAngles()', () => {
    const dir1 = new Vec2(0, 1).normalize();
    const rad = dir1.getRad();
    assert.closeTo(rad, 1.57, 0.1);
  });

  it('should calculate correct angle between to points indepenetend of their lengths', () => {
    const dir1 = new Vec2(0, 10);
    const dir2 = new Vec2(-12, 0);

    const angle1 = dir1.angleTo(dir2);
    const angle2 = dir1.normalize().angleTo(dir2.normalize());

    assert.closeTo(angle1, -1.57, 0.1);
    assert.closeTo(angle1, angle2, 0.1);
  });

  it('should create an array with x y values', () => {
    const dir1 = new Vec2(7, 10);
    const arr = dir1.toArray();

    assert.closeTo(arr[0], 7, 0.1);
    assert.closeTo(arr[1], 10, 0.1);
  });
};

describe('standard Point test.', () => {
  pointTest(Point);
});

describe('standard IPoint test.', () => {
  pointTest(IPoint);
});

describe('special IPoint test.', () => {
  it('should throw error when tying to change x y values', () => {
    const pos = new IPoint(5, 6);

    assert.throws(() => (pos.x = 27), Error);
    assert.equal(pos.x, 5);
    assert.throws(() => (pos.y = 28), Error);
    assert.equal(pos.y, 6);
  });

  it('should toPoint() create a mutable Point copy', () => {
    const ipos = new IPoint(5, 6);
    const pos = ipos.toPoint();

    assert.instanceOf(pos, Point);
    assert.equal(pos.x, 5);
    assert.equal(pos.y, 6);
  });
});

describe('special Point test.', () => {
  it('should change x y values when setting directly', () => {
    const pos = new Point(5, 6, 7);

    pos.x = 27;
    assert.equal(pos.x, 27);
    pos.y = 28;
    assert.equal(pos.y, 28);
  });

  it('should change x y values when calling local calc method', () => {
    const pos = new Point(5, 6);
    const res = pos.calc(p => p * 25);

    assert.equal(pos, res);
    assert.equal(pos.x, 125);
    assert.equal(pos.y, 150);
  });
});

describe('calc test.', () => {
  it('calling of calc should generate only numbers if no point is in use', () => {
    const vec = calc(() => 2 * 2 + 3);
    assert.equal(vec, 7);
  });
});
