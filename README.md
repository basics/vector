# basics - vector

[![GitHub package version](https://img.shields.io/github/package-json/v/basics/vector.svg)](https://github.com/basics/vector)
[![npm version](https://img.shields.io/npm/v/@js-basics/vector.svg)](https://www.npmjs.com/package/@js-basics/vector)
[![license](https://img.shields.io/github/license/basics/vector.svg)](https://github.com/basics/vector)
[![Greenkeeper badge](https://badges.greenkeeper.io/basics/vector.svg)](https://greenkeeper.io/)

[![OSX/Linux Build Status](https://travis-ci.org/basics/vector.svg?branch=master)](https://travis-ci.org/basics/vector)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/drb33qvmf3koo5gr?svg=true)](https://ci.appveyor.com/project/StephanGerbeth/vector)
[![NSP Status](https://nodesecurity.io/orgs/basics/projects/23094b78-f287-4645-a043-f97267a30c5b/badge)](https://nodesecurity.io/orgs/basics/projects/23094b78-f287-4645-a043-f97267a30c5b)
[![Dependencies Status](https://david-dm.org/basics/vector/status.svg)](https://david-dm.org/basics/vector)
[![DevDependencies Status](https://david-dm.org/basics/vector/dev-status.svg)](https://david-dm.org/basics/vector?type=dev)

<!-- markdownlint-disable no-inline-html -->

This libary provides 3D Vector in js including support for <nobr>`+` `-` `*` `/`</nobr> operator handling.

Normally vector implementations in javascript handle arithmetic operation by functions <nobr>`aVec.multiply(bVec).substract(dVec)`.</nobr>
Other languages provide operator overloading, that coders can create Vector class which can handle operation similar to number handling <nobr>`aVec * bVec - dVec`.</nobr>

This libary gives javascript coders a way to handle operators with a single statement <nobr>`() => aVec * bVec - dVec`.</nobr>
The calculation can be combined with numbers <nobr>`() => aVec * bVec * 4 - dVec - 1.5`.</nobr>
Vector objects can be create with number <nobr>`new Vector(5, 6, 7)`</nobr> or directly with assigned statement <nobr>`new Vector(() => 5 * 30 + 2)`.</nobr>

<details>
<summary>
Implementation details
</summary>

Javascript has this one peculiarity called `valueOf()` this function is designed for primitive handling (numbers and strings) when handling arithmetic operations.
Every class can overwrite this function to give it special behavior. This Vector class calls the assigned statement three times for `x`, `y` and `z`.
Comparable to trigger arithmetic operation manually for every axis.

```js
const x = aVec.x * bVec.x * 4 - dVec.x - 1.5;
const y = aVec.y * bVec.y * 4 - dVec.y - 1.5;
const z = aVec.z * bVec.z * 4 - dVec.z - 1.5;
```

Internally the `valueOf()` implementation returns `x` in first call, `y` in second call and `z` in last call, these results are put into an new Vector object and can be reused further.

</details>
<!-- markdownlint-enable no-inline-html -->

## working with Vector class

### create vector by numbers

```js
const pos = new Vector(5, 6, 7);
const dir = new Vector(1, 0, 0);

console.log("pos:", pos, " dir:", dir);
```

pos: { x: 5, y: 6, z: 7 } dir: { x: 1, y: 0, z: 0 }

### create vector by calculating other vectors and number

```js
const offset = new Vector(() => dir * 30 + pos);

console.log("offset:", offset);
```

offset: { x: 35, y: 6, z: 7 }

### compare lengths

```js
let way = offset;
if (way > 1) {
  way = way.normalize();
}
console.log("way:", way);
```

way: { x: 0.96, y: 0.16, z: 0.19 }

### calculate cross product

```js
const dir1 = new Vector(0, 1, 0);
const dir2 = new Vector(-1, 0, 1);
const cross = dir1.cross(dir2);

console.log("cross:", cross);
```

cross: { x: 1, y: 0, z: 1 }

### directly normalize the cross product

```js
const crossNorm = dir1.crossNormalize(dir2);

console.log("crossNorm:", crossNorm);
```

crossNorm: { x: 0.71, y: 0, z: 0.71 }

### cross product handling works also with operator handling

```js
const crossNormCalc = new Vector(() => dir1.crossNormalize(dir2) * 50);

console.log("crossNormCalc:", crossNormCalc);
```

crossNormCalc: { x: 35.36, y: 0, z: 35.36 }

## immutable vector called Victor

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

```js
const vec = new Victor(5, 6, 7);

try {
  vec.x = 27;
} catch (error) {
  console.log("error:", error);
}
```

error: set x() not implemented
