import { assert } from 'chai';
import { formatNumber } from '../src/formatter';
import { describe, it } from 'vitest';

describe('formatNumber test.', function () {
  it('should format Number with default 4 decimals.', function () {
    assert.equal(formatNumber(0.00000001), '0.00000001');
    assert.equal(formatNumber(0.00009998), '0.00009998');
    assert.equal(formatNumber(0.00000000000000000001), '0.00000000000000000001');
    assert.equal(formatNumber(0.0000000000000000000000000001), '0.0000000000000000000000000001');
    assert.equal(formatNumber(0.00009999999999), '0.0001');
    assert.equal(formatNumber(0.00009999), '0.00009999');
    assert.equal(formatNumber(2.5), '2.5');
    assert.equal(formatNumber(2.9999999999), '3');
    assert.equal(formatNumber(2.999), '2.999');
    assert.equal(formatNumber(257.5657), '257.6');
    assert.equal(formatNumber(2575657546445.985), '2,575,657,546,446');
  });
});
