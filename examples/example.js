const { calc, default: Vector } = require('../lib');

/* eslint-disable no-console */

// create vector by numbers
const pos = new Vector(5, 6, 7);
const dir = new Vector(1, 0, 0);
console.log('pos:', pos, ' dir:', dir);
// pos: { [Number: 10.48] x: 5, y: 6, z: 7 }  dir: { [Number: 1] x: 1, y: 0, z: 0 }

// or create vector by calculating other vectors and number
const offsetA = new Vector(() => dir * 30 + pos);
console.log('offsetA:', offsetA);
// offsetA: { [Number: 36.19] x: 35, y: 6, z: 7 }

// calc two Vectors
const offsetB = calc(() => dir * 20 + pos);
console.log('offsetB:', offsetB);
// offsetB: { [Number: 26.645825188948457] x: 25, y: 6, z: 7 }

// compare length
let way = offsetA;
if (way > 1) {
  way = way.normalize();
}
console.log('way:', way);
// way: { [Number: 1] x: 0.96, y: 0.16, z: 0.19 }
