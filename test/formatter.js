import { assert } from 'chai';
import formatNumber from '../src/formatter';

describe('formatNumber test.', () => {
  it('should format Number with default 4 decimals', () => {
    assert.equal(formatNumber(0.00000001), '0.00000001');
    assert.equal(formatNumber(0.00009998), '0.00009998');
    assert.equal(formatNumber(0.00000000000000000001), '0.00000000000000000001');
    assert.equal(formatNumber(0.0000000000000000000000000001), '0.0000000000000000000000000001');
    assert.equal(formatNumber(0.00009999999999), '0.0001');
    assert.equal(formatNumber(0.00009999), '0.00009999');
    assert.equal(formatNumber(257.5657), '257.6');
    assert.equal(formatNumber(2575657546445.985), '2575657546446');
  });
});
