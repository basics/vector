import { calc, Vector, Victor } from '../src';

/* eslint-disable no-console */

// create vector by numbers
const pos = new Vector(5, 6, 7);
const dir = new Vector(1, 0, 0);
console.log('pos:', pos.toString(), ' dir:', dir.toString());
// pos: { x: 5, y: 6, z: 7 }  dir: { x: 1, y: 0, z: 0 }

// or create vector by calculating other vectors and numbers with operator
const offsetA = new Vector(() => dir * 30 + pos);
console.log('offsetA:', offsetA.toString());
// offsetA: { x: 35, y: 6, z: 7 }

// calc two Vectors and numbers with operator
const offsetB = calc(() => dir * 20 + pos);
console.log('offsetB:', offsetB.toString());
// offsetB: { x: 25, y: 6, z: 7 }

// compare length
let way = offsetA;
if (way > 1) {
  way = way.normalize();
}
console.log('way:', way.toString());
// way: { x: 0.97, y: 0.17, z: 0.19 }

// calculate cross product
const dir1 = new Vector(0, 1, 0);
const dir2 = new Vector(-1, 0, 1);
const cross = dir1.cross(dir2);

console.log('cross:', cross.toString());
// cross: { x: 1, y: 0, z: 1 }

// directly normalize the cross product
const crossNorm = dir1.crossNormalize(dir2);

console.log('crossNorm:', crossNorm.toString());
// crossNorm: { x: 0.71, y: 0, z: 0.71 }

// cross product handling works also with operator handling
const crossNormCalc = new Vector(() => dir1.crossNormalize(dir2) * 50);

console.log('crossNormCalc:', crossNormCalc.toString());
// crossNormCalc: { x: 35.36, y: 0, z: 35.36 }

// immutable vector called Victor
const vec = new Victor(5, 6, 7);

try {
  vec.x = 27;
} catch (error) {
  console.log('error:', error.toString());
  // error: Error: set x() not implemented
}
