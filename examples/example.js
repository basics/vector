const { calc, default: Vector } = require('../lib');

/* eslint-disable no-console */

const pos = new Vector(5, 6, 7);
const dir = new Vector(1, 0, 0);
console.log('pos:', pos, ' dir:', dir);

const offsetA = new Vector(() => dir * 30 + pos);
console.log('offsetA:', offsetA);

const offsetB = calc(() => dir * 30 + pos);
console.log('offsetB:', offsetB);

let way = offsetA;
if (way > 1) {
  way = way.normalize();
}
console.log('way:', way);
