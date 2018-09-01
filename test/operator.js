import { assert } from 'chai';
import { operatorCalc } from '../src/operator';
import { Victor, Vector } from '../src';

describe('operatorCalc with Victor test.', () => {
  it('should throw error with assgined Victor', () => {
    const pos = new Victor(5, 6, 7);
    const dir = new Victor(1, 0, 0);

    assert.throws(() => operatorCalc(() => dir * pos, new Victor(1, 0, 0)), Error);
  });
});

describe('operatorCalc with Vector test.', () => {
  it('should throw error with assgined Victor', () => {
    const pos = new Vector(5, 6, 7);
    const dir = new Vector(1, 0, 0);

    const scale = operatorCalc(() => dir * pos, new Vector(1, 0.9, 0));

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });
});
