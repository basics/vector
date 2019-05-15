import { assert } from 'chai';
import { operatorCalc, cachedFactory } from '../src/operator';
import { victor, vector } from '../src';

describe('operatorCalc with Victor test.', () => {
  it('should throw error with assgined Victor', () => {
    const pos = victor(5, 6, 7);
    const dir = victor(1, 0, 0);

    assert.throws(() => operatorCalc(() => dir * pos, victor(1, 0, 0)), Error);
  });
});

describe('operatorCalc with Vector test.', () => {
  it('should throw error with assgined Victor', () => {
    const pos = vector(5, 6, 7);
    const dir = vector(1, 0, 0);

    const scale = operatorCalc(() => dir * pos, vector(1, 0.9, 0));

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });
});

describe('operatorCalc with class using cachedFactory (Vector or Victor or Point or Ipoint) test.', () => {
  let counter = 0;
  class V {
    constructor() {
      counter++;
    }
  }
  const vFactory = cachedFactory(V);

  it('factory call should be cached', () => {
    const pos = vector(5, 6, 7);
    const dir = vector(1, 0, 0);
    operatorCalc(() => dir * vFactory() + 1);

    assert.equal(counter, 1);
  });
});
