// @ts-nocheck
import { cachedValueOf } from './operator';
import { isArray } from './utils/math';

export class VectorArray extends Array {
  constructor(...vals) {
    if (!vals.length) {
      throw new Error('no empty array allowd');
    }
    const first = vals[0];
    const src = isArray(first) ? first : vals;

    super(src.length);
    for (let i = 0; i < src.length; i += 1) {
      this[i] = src[i];
    }
  }
}

cachedValueOf(VectorArray, src => src);

/**
 * @typedef {Array<number> & number} ArrayType
 * @typedef {(arr: Array<number>) => ArrayType} ArrArr
 * @typedef {(...number) => ArrayType} NumberArr
 * @typedef {ArrArr & NumberArr}
 *
 * @param {Array<number> | ...number} vals
 * @returns {ArrayType}
 */
export function vectorArray(...vals) {
  return new VectorArray(...vals);
}
