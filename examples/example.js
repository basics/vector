import { vector, victor } from '../src/vector';
import { point, ipoint } from '../src/point';
import debug from '../src/debug';
import { cachedValueOf, cachedFactory, operatorCalc } from '../src/operator';

// create vector by numbers
const pos = vector(5, 6, 7);
const dir = vector(1, 0, 0);
console.log(debug`pos:${pos}, dir: ${dir}`);
// pos: { x: 5, y: 6, z: 7 }  dir: { x: 1, y: 0, z: 0 }

// or create vector by calculating other vectors and numbers with operator
const offsetA = vector(() => dir * 30 + pos);
console.log(debug`offsetA: ${offsetA}`);
// offsetA: { x: 35, y: 6, z: 7 }

// compare length
let way = offsetA;
if (way > 1) {
  way = way.normalize();
}
console.log(debug`way: ${way}`);
// way: { x: 0.967, y: 0.1658, z: 0.1934 }

// calculate cross product
const dir1 = vector(0, 1, 0);
const dir2 = vector(-1, 0, 1);
const cross = dir1.cross(dir2);

console.log(debug`cross: ${cross}`);
// cross: { x: 1, y: 0, z: 1 }

// directly normalize the cross product
const crossNorm = dir1.crossNormalize(dir2);

console.log(debug`crossNorm: ${crossNorm}`);
// crossNorm: { x: 0.7071, y: 0, z: 0.7071 }

// cross product handling works also with operator handling
const crossNormCalc = vector(() => dir1.crossNormalize(dir2) * 50);

console.log(debug`crossNormCalc: ${crossNormCalc}`);
// crossNormCalc: { x: 35.36, y: 0, z: 35.36 }

// normalize only with arithmetic
const norm = vector(() => offsetA / offsetA.length);
console.log(debug`norm: ${norm}`);
// norm: { x: 0.967, y: 0.1658, z: 0.1934 }

// mutable 3D vector called Vector
const v1 = vector(5, 6, 7);

v1.x = 27;
console.log(debug`v1: ${v1}`);
// v1: { x: 27, y: 6, z: 7 }

v1.calc(p => (p + 1) * 12);
console.log(debug`v1: ${v1}`);
// v1: { x: 336, y: 84, z: 96 }

// immutable 3D vector called Victor
const v2 = victor(5, 6, 7);

try {
  v2.x = 27;
} catch (error) {
  console.log('error:', error.toString());
  // error: Error: set x() not implemented
}

// mutable 2D vector called Point
const p1 = point(5, 6);

p1.x = 27;
console.log(debug`p1: ${p1}`);
// p1: { x: 27, y: 6 }

p1.calc(p => (p + 1) * 12);
console.log(debug`v1: ${v1}`);
// p1: { x: 336, y: 84 }

// immutable 2D point called IPoint
const p2 = ipoint(5, 6);

try {
  p2.x = 27;
} catch (error) {
  console.log('error:', error.toString());
  // error: Error: set x() not implemented
}

// creating vector inside calculation works fine,
// thanks to caching in factory function
const inlineVec = victor(() => victor(25, 30, 0) / 2);
console.log(debug`inlineVec: ${inlineVec}`);
// inlineVec: { x: 12.5, y: 15, z: 0 }

// mix 2D and 3D space
const from2d = victor(() => point(25, 30) / 2);
const from3d = ipoint(() => from2d.xy * 2);
console.log(debug`from2d: ${from2d}`);
console.log(debug`from3d: ${from3d}`);
// from2d: { x: 12.5, y: 15, z: 0 }
// from3d: { x: 25, y: 30 }

// override valueOf in own class
class Tuple {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
cachedValueOf(Tuple);

// write own factory function
const tuple = (() => {
  const tupleFactory = cachedFactory(Tuple);
  return (x, y, z) => {
    if (typeof x === 'function') {
      return operatorCalc(x, new Tuple());
    }
    return tupleFactory(x, y, z);
  };
})();

const t1 = tuple(3, 4, 5);
const t2 = tuple(6, 7, 8);
const t = tuple(() => t1 + t2 * 2);

console.log(`t: ${JSON.stringify(t)}`);
// t: {"x":15,"y":18,"z":21}
