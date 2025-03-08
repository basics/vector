import { assert } from 'chai';
import { operatorCalc, cachedFactory } from '../src/operator';
import { victor, vector } from '../src';
import { describe, it } from 'vitest';

describe('operatorCalc with Victor test.', function () {
  it('should throw error with assingned Victor', function () {
    const pos = victor(5, 6, 7);
    const dir = victor(1, 0, 0);

    assert.throws(() => operatorCalc(() => dir * pos, victor(1, 0, 0)));
  });

  it('should work fine with number wrapper class', function () {
    class Num {
      constructor(nr) {
        this.nr = nr;
      }

      valueOf() {
        return this.nr;
      }

      toString() {
        return `${this.nr}`;
      }
    }

    const pos = vector(new Num(5), 6, 7);
    const dir = vector(1, new Num(0), 0);

    const scale = operatorCalc(() => dir * pos, vector(1, 0.9, 0));

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });
});

describe('operatorCalc with Vector test.', function () {
  it('should work fine with assigning result vector', function () {
    const pos = vector(5, 6, 7);
    const dir = vector(1, 0, 0);

    const scale = operatorCalc(() => dir * pos, vector(1, 0.9, 0));

    assert.equal(scale.x, 5);
    assert.equal(scale.y, 0);
    assert.equal(scale.z, 0);
  });
});

describe('operatorCalc with class using cachedFactory (Vector or Victor or Point or Ipoint) test.', function () {
  let counter = 0;
  class V {
    constructor() {
      counter++;
    }
  }
  const vFactory = cachedFactory(V);

  it('factory call should be cached', function () {
    // const pos = vector(5, 6, 7);
    const dir = vector(1, 0, 0);
    operatorCalc(() => dir * vFactory() + 1);

    assert.equal(counter, 1);
  });
});
