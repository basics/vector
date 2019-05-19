# basics - vector

[![GitHub package version](https://img.shields.io/github/package-json/v/basics/vector.svg)](https://github.com/basics/vector)
[![npm version](https://img.shields.io/npm/v/@js-basics/vector.svg)](https://www.npmjs.com/package/@js-basics/vector)
[![license](https://img.shields.io/github/license/basics/vector.svg)](https://github.com/basics/vector)
[![Greenkeeper badge](https://badges.greenkeeper.io/basics/vector.svg)](https://greenkeeper.io/)

[![OSX/Linux Build Status](https://travis-ci.org/basics/vector.svg?branch=master)](https://travis-ci.org/basics/vector)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/drb33qvmf3koo5gr?svg=true)](https://ci.appveyor.com/project/StephanGerbeth/vector)
[![Dependencies Status](https://david-dm.org/basics/vector/status.svg)](https://david-dm.org/basics/vector)
[![DevDependencies Status](https://david-dm.org/basics/vector/dev-status.svg)](https://david-dm.org/basics/vector?type=dev)

<!-- markdownlint-disable no-inline-html -->

This libary provides 3D Vector in js including support for<nobr> `+` `-` `*` `/` </nobr>operator handling.

Normally vector implementations in javascript handle arithmetic operation by functions<nobr> `aVec.multiply(bVec).substract(dVec)`. </nobr>
Other languages provide operator overloading, that coders can create Vector class which can handle operation similar to number handling<nobr> `aVec * bVec - dVec`. </nobr>

This libary gives javascript coders a way to handle operators with a single statement<nobr> `() => aVec * bVec - dVec`. </nobr>
The calculation can be combined with numbers<nobr> `() => aVec * bVec * 4 - dVec - 1.5`. </nobr>
Vector objects can be create with number<nobr> `new Vector(5, 6, 7)` </nobr>or directly with assigned statement<nobr> `new Vector(() => 5 * 30 + 2)`.</nobr>

<details>
<summary> Implementation details</summary>

```js
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
                    ( aVec, bVec, dVec) =>
                      aVec * bVec * 4 - dVec - 1.5
                   );

                    ⇓

// final version with overwritten valueOf() function
const vec = calc(() => aVec * bVec * 4 - dVec - 1.5);
```

Javascript has this one peculiarity called `valueOf()` this function is designed for primitive handling (numbers and strings) when handling arithmetic operations.
Every class can overwrite this function to give it special behavior. This Vector class calls the assigned statement three times for `x`, `y` and `z`.
Comparable to trigger arithmetic operation manually for every axis.

Internally the `valueOf()` implementation returns `x` in first call, `y` in second call and `z` in last call, these results are put into an new Vector object and can be reused further.

</details>
<!-- markdownlint-enable no-inline-html -->

## working with Vector class

### create vector by numbers

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=6-12)](https://github.com/basics/vector/blob/master/examples/example.js)

### create vector by calculating other vectors and number

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=12-17)](https://github.com/basics/vector/blob/master/examples/example.js)

### compare lengths

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=17-25)](https://github.com/basics/vector/blob/master/examples/example.js)

### calculate cross product

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=25-30)](https://github.com/basics/vector/blob/master/examples/example.js)

### directly normalize the cross product

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=36-39)](https://github.com/basics/vector/blob/master/examples/example.js)

### cross product handling works also with operator handling

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=39-45)](https://github.com/basics/vector/blob/master/examples/example.js)

### normalize only with arithmetic

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=45-50)](https://github.com/basics/vector/blob/master/examples/example.js)

## mutable 3D vector called Vector

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=50-57)](https://github.com/basics/vector/blob/master/examples/example.js)

## immutable 3D vector called Victor

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=57-67)](https://github.com/basics/vector/blob/master/examples/example.js)

## mutable 2D vector called Point

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=67-74)](https://github.com/basics/vector/blob/master/examples/example.js)

## immutable 2D vector called IPoint

behaves exactly like Vector but code cant change its `x`, `y` and `z` axes.

[![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=74-84)](https://github.com/basics/vector/blob/master/examples/example.js)

## creating vector inside calculation

 works fine thanks to caching in factory function.

 [![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=84-90)](https://github.com/basics/vector/blob/master/examples/example.js)

## mixing 2D and 3D space

 [![code preview](https://us-central1-code-snippet-to-svg.cloudfunctions.net/default/basics/vector/blob/master/examples/example.js?theme=atom_one_light&range=90-98)](https://github.com/basics/vector/blob/master/examples/example.js)
