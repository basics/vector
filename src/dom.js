import { cachedValueOf, defineVectorLength } from './operator.js';

export const hijackDOMPoint = DOMPoint => {
  try {
    cachedValueOf(DOMPoint);
    defineVectorLength(DOMPoint, 4);
  } catch (e) {
    console.error('error while hijackDOMPoint');
    console.error(e);
  }
};
