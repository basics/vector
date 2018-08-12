import { assert } from 'chai';
import { Vector } from '../src/vector';

describe('Vector test.', () => {
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

  it('only for readme', () => {

    // create vector by numbers

    const pos = new Vector(5, 6, 7);
    const dir = new Vector(1, 0, 0);

    console.log('pos:', pos, ' dir:', dir);
    // pos: { [Number: 10.48] x: 5, y: 6, z: 7 }  dir: { [Number: 1] x: 1, y: 0, z: 0 }

    // or create vector by calculating other vectors and number
    const offset = new Vector(() => dir * 30 + pos);

    console.log('offset:', offset);
    // offset: { [Number: 36.19] x: 35, y: 6, z: 7 }

    // compare length
    let way = offset;
    if (way > 1) {
      way = way.normalize();
    }
    console.log('way:', way);
    // way: { [Number: 1] x: 0.96, y: 0.16, z: 0.19 }

  });
});
