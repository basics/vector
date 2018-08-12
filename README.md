[![GitHub package version](https://img.shields.io/github/package-json/v/basics/vector.svg)](https://github.com/basics/vector)
[![license](https://img.shields.io/github/license/basics/vector.svg)](https://github.com/basics/vector)

[![OSX/Linux Build Status](https://travis-ci.org/basics/vector.svg?branch=master)](https://travis-ci.org/basics/vector)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/drb33qvmf3koo5gr?svg=true)](https://ci.appveyor.com/project/StephanGerbeth/vector)
[![NSP Status](https://nodesecurity.io/orgs/basics/projects/23094b78-f287-4645-a043-f97267a30c5b/badge)](https://nodesecurity.io/orgs/basics/projects/23094b78-f287-4645-a043-f97267a30c5b)
[![Dependencies Status](https://david-dm.org/basics/vector/status.svg)](https://david-dm.org/basics/vector)
[![DevDependencies Status](https://david-dm.org/basics/vector/dev-status.svg)](https://david-dm.org/basics/vector?type=dev)

[![start with why](https://img.shields.io/badge/start%20with-why%3F-brightgreen.svg?style=flat)](http://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action)
[![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/dwyl/goodparts "JavaScript The Good Parts") [![Greenkeeper badge](https://badges.greenkeeper.io/basics/vector.svg)](https://greenkeeper.io/)

# basics - vector

this libary provides 3D Vector in js including support for __+ - * /__ operator handling

create vector by numbers

```js
const pos = new Vector(5, 6, 7);
const dir = new Vector(1, 0, 0);

console.log('pos:', pos, ' dir:', dir);
```

pos: { x: 5, y: 6, z: 7 }  dir: { x: 1, y: 0, z: 0 }

or create vector by calculating other vectors and number

```js
const offset = new Vector(() => dir * 30 + pos);

console.log('offset:', offset);
```

offset: { x: 35, y: 6, z: 7 }

compare length

```js
let way = offset;
if (way > 1) {
  way = way.normalize();
}
console.log('way:', way);
```

way: { x: 0.96, y: 0.16, z: 0.19 }
