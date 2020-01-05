# basics - vector

[![GitHub package version](https://img.shields.io/github/package-json/v/basics/vector.svg)](https://github.com/basics/vector)
[![npm version](https://img.shields.io/npm/v/@js-basics/vector.svg)](https://www.npmjs.com/package/@js-basics/vector)
[![license](https://img.shields.io/github/license/basics/vector.svg)](https://github.com/basics/vector)
[![Greenkeeper badge](https://badges.greenkeeper.io/basics/vector.svg)](https://greenkeeper.io/)

[![OSX/Linux Build Status](https://travis-ci.org/basics/vector.svg?branch=master)](https://travis-ci.org/basics/vector)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/drb33qvmf3koo5gr?svg=true)](https://ci.appveyor.com/project/StephanGerbeth/vector)
[![Dependencies Status](https://david-dm.org/basics/vector/status.svg)](https://david-dm.org/basics/vector)
[![DevDependencies Status](https://david-dm.org/basics/vector/dev-status.svg)](https://david-dm.org/basics/vector?type=dev)

This libary provides 3D Vector in js including support for `+` `-` `*` `/` (also `%` and `**`) operator handling.

Normally vector implementations in javascript handle arithmetic operation by methods `aVec.multiply(bVec).substract(dVec)`.
Other languages provide operator overloading, that coders can create Vector class which can handle operation similar to number handling `aVec * bVec - dVec`.

This libary gives javascript coders a way to handle operators with a single statement `() => aVec * bVec - dVec`.
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

[API Reference](https://unpkg.com/@js-basics/vector/docs/globals.html)

### load via hmtl

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@js-basics/vector/build/iife/bundle.min.js"
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

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=6-12)](https://github.com/basics/vector/blob/master/examples/example.js#L6)

### create vector by calculating other vectors and number

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=12-17)](https://github.com/basics/vector/blob/master/examples/example.js#L12)

### compare lengths

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=17-25)](https://github.com/basics/vector/blob/master/examples/example.js#L17)

### calculate cross product

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=25-33)](https://github.com/basics/vector/blob/master/examples/example.js#L25)

### directly normalize the cross product

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=33-39)](https://github.com/basics/vector/blob/master/examples/example.js#L33)

### cross product handling works also with operator handling

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=39-45)](https://github.com/basics/vector/blob/master/examples/example.js#L39)

### normalize only with arithmetic

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=45-50)](https://github.com/basics/vector/blob/master/examples/example.js#L45)

### mutable 3D vector called Vector

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=50-61)](https://github.com/basics/vector/blob/master/examples/example.js#L50)

### immutable 3D vector called Victor

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=61-71)](https://github.com/basics/vector/blob/master/examples/example.js#L57)

### mutable 2D vector called Point

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=71-82)](https://github.com/basics/vector/blob/master/examples/example.js#L67)

### immutable 2D vector called IPoint

behaves exactly like Point but code cant change its `x` and `y` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=82-92)](https://github.com/basics/vector/blob/master/examples/example.js#L74)

### creating vector inside calculation

works fine thanks to caching in factory function.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=92-98)](https://github.com/basics/vector/blob/master/examples/example.js#L84)

### mixing 2D and 3D space

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=98-106)](https://github.com/basics/vector/blob/master/examples/example.js#L90)

## Not another vector lib

You are happy with your current vector library and definitely don’t want to change 1000 lines of code already written in your projects. Then you can only use the valueOf extension and the calc function.

## working with Operator class

### load via hmtl

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@js-basics/vector/build/iife/operator.min.js"
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

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=106-116)](https://github.com/basics/vector/blob/master/examples/example.js#L98)

### write own factory function

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=116-134)](https://github.com/basics/vector/blob/master/examples/example.js#L107)
