# basics - vector

[![GitHub package version](https://img.shields.io/github/package-json/v/basics/vector.svg)](https://github.com/basics/vector)
[![npm version](https://img.shields.io/npm/v/@js-basics/vector.svg)](https://www.npmjs.com/package/@js-basics/vector)
[![license](https://img.shields.io/github/license/basics/vector.svg)](https://github.com/basics/vector)

![main action pipeline](https://github.com/basics/vector/actions/workflows/main.yml/badge.svg)
![beta action pipeline](https://github.com/basics/vector/actions/workflows/beta.yml/badge.svg)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=basics_vector&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=basics_vector)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=basics_vector&metric=coverage)](https://sonarcloud.io/summary/new_code?id=basics_vector)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=basics_vector&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=basics_vector)

This library provides 3D Vector in js including arithmetic operator overloading (`+ - * / % **`).

Normally vector implementations in javascript handle arithmetic operation by methods `aVec.multiply(bVec).substract(dVec)`.
Other languages provide operator overloading, that coders can create Vector class which can handle operation similar to number handling `aVec * bVec - dVec`.

This library gives javascript coders a way to handle operators with a single statement `() => aVec * bVec - dVec`.
The calculation can be combined with numbers `() => aVec * bVec * 4 - dVec - 1.5`.
Vector objects can be create with number `new Vector(5, 6, 7)` or directly with assigned statement `new Vector(() => 5 * 30 + 2)`.

## Implementation details

```javascript
// typical implementation of vector in js
const vec = aVec.multiply(bVec).multiply(4).substract(dVec).substract(1.5);

                    ⇓

// better readable, but much more complicated
const vec = new Vec(aVec.x * bVec.x * 4 - dVec.x - 1.5,
                    aVec.y * bVec.y * 4 - dVec.y - 1.5,
                    aVec.z * bVec.z * 4 - dVec.z - 1.5);

                    ⇓

// inspired by smart array handling
// first version of calling assigned function three times
const vec = oldCalc(  aVec, bVec, dVec,
                    ( aVec, bVec, dVec) => aVec * bVec * 4 - dVec - 1.5
                   );

                    ⇓

// final version with overwritten valueOf() method
const vec = calc(() => aVec * bVec * 4 - dVec - 1.5);
```

Javascript has this one peculiarity called `valueOf()` this method is designed for primitive handling (numbers and strings) when handling arithmetic operations.
Every class can overwrite this method to give it special behavior. This Vector class calls the assigned statement three times for `x`, `y` and `z`.
Comparable to trigger arithmetic operation manually for every axis.

Internally the `valueOf()` implementation returns `x` in first call, `y` in second call and `z` in last call, these results are put into an new Vector object and can be reused further.

## Usage

### load via hmtl

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@js-basics/vector/build/iife"
></script>
```

```javascript
const { calc, vector, victor, point, ipoint } = basics.vector;
```

### load via npm

\$ `npm i @js-basics/vector`

```javascript
import { calc, vector, victor, point, ipoint } from "@js-basics/vector";
```

## working with Vector classes

### create vector by numbers

```javascript
const pos = vector(5, 6, 7);
const dir = vector(1, 0, 0);
console.log(debug`pos:${pos}, dir: ${dir}`);
// pos: { x: 5, y: 6, z: 7 }  dir: { x: 1, y: 0, z: 0 }
```

### create vector by calculating other vectors and number

```javascript
const offsetA = vector(() => dir * 30 + pos);
console.log(debug`offsetA: ${offsetA}`);
// offsetA: { x: 35, y: 6, z: 7 }
```

### calculate cross product

```javascript
const dir1 = vector(0, 1, 0);
const dir2 = vector(-1, 0, 1);
const cross = dir1.cross(dir2);

console.log(debug`cross: ${cross}`);
// cross: { x: 1, y: 0, z: 1 }
```

### directly normalize the cross product

```javascript
const crossNorm = dir1.crossNormalize(dir2);

console.log(debug`crossNorm: ${crossNorm}`);
// crossNorm: { x: 0.7071, y: 0, z: 0.7071 }
```

### cross product handling works also with operator handling

```javascript
const crossNormCalc = vector(() => dir1.crossNormalize(dir2) * 50);

console.log(debug`crossNormCalc: ${crossNormCalc}`);
// crossNormCalc: { x: 35.36, y: 0, z: 35.36 }
```

### normalize with arithmetic only

```javascript
const norm = vector(() => offsetA / offsetA.length);
console.log(debug`norm: ${norm}`);
// norm: { x: 0.967, y: 0.1658, z: 0.1934 }
```

### mutable 3D vector called Vector

```javascript
const v1 = vector(5, 6, 7);

v1.x = 27;
console.log(debug`v1: ${v1}`);
// v1: { x: 27, y: 6, z: 7 }

v1.calc(p => (p + 1) * 12);
console.log(debug`v1: ${v1}`);
// v1: { x: 336, y: 84, z: 96 }
```

### immutable 3D vector called Victor

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

```javascript
const v2 = victor(5, 6, 7);

try {
  v2.x = 27;
} catch (error) {
  console.log(`error: ${error}`);
  // error: Error: set x() not implemented
}
```

### mutable 2D vector called Point

```javascript
const p1 = point(5, 6);

p1.x = 27;
console.log(debug`p1: ${p1}`);
// p1: { x: 27, y: 6 }

p1.calc(p => (p + 1) * 12);
console.log(debug`v1: ${v1}`);
// p1: { x: 336, y: 84 }
```

### immutable 2D vector called IPoint

behaves exactly like Point but code cant change its `x` and `y` axes.

```javascript
const p2 = ipoint(5, 6);

try {
  p2.x = 27;
} catch (error) {
  console.log('error:', error.toString());
  // error: Error: set x() not implemented
}
```
### creating vector inside calculation

works fine thanks to caching in factory function.

```javascript
// creating vector inside calculation works fine,
// thanks to caching in factory function
const inlineVec = victor(() => victor(25, 30, 0) / 2);
console.log(debug`inlineVec: ${inlineVec}`);
// inlineVec: { x: 12.5, y: 15, z: 0 }
```

### mixing 2D and 3D space

```javascript
// mix 2D and 3D space
const from2d = victor(() => point(25, 30) / 2);
const from3d = ipoint(() => from2d.xy * 2);
console.log(debug`from2d: ${from2d}`);
console.log(debug`from3d: ${from3d}`);
// from2d: { x: 12.5, y: 15, z: 0 }
// from3d: { x: 25, y: 30 }
```

## Not another vector lib

You are happy with your current vector library and definitely don’t want to change 1000 lines of code already written in your projects. Then you can only use the valueOf extension and the calc function.

## working with Operator class

### load via hmtl

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@js-basics/vector/build/iife/operator.js"
></script>
```

```javascript
const { cachedValueOf, cachedFactory, operatorCalc } = basics.vector.operator;
```

### load via npm

\$ `npm i @js-basics/vector`

```javascript
import {
  cachedValueOf,
  cachedFactory,
  operatorCalc
} from "@js-basics/vector/operator";
```

### override valueOf in own class

```javascript
class Tuple {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
cachedValueOf(Tuple);
```

### write own factory function

```javascript
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
```

## Predefined adapters

existing operator overloading for game engines or other vector libraries

- [playcanvas](https://github.com/basics/vector/tree/master/src/adapter)
  
