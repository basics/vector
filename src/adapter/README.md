# predefined adapters for vector arithmetic operator overloading and short notation functions

# Adapter for [playcanvas](https://github.com/playcanvas/engine)

## Loading

### Load via hmtl

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@js-basics/vector/build/iife/adapter/playcanvas.js"
></script>
```

### Load via npm

\$ `npm i @js-basics/vector`

```javascript
import "@js-basics/vector/adapter/playcanvas";
```

### Load in editor of playcanvas

go to `settings`

open `external scripts`

increase `Array Size`

add `https://unpkg.com/@js-basics/vector/build/iife/adapter/playcanvas.js` to the array

create a new script asset 

set its loading type to `After Engine` 

and type into:

```
if (typeof basics !== 'undefined') {
    basics.vector.adapter.playcanvas.hijackPlayCanvas(pc);
}
```

## Features

### Short notations

- `pc.cross(...)` short notation `Vec3().cross`
- `pc.vec3(...)` short notation `new pc.Vec3(...)`
- `pc.vec2(...)` short notation `new pc.Vec2(...)`
- `pc.vec4(...)` short notation `new pc.Vec4(...)`
- `pc.quat(...)` short notation `new pc.Quat(...)`
- `pc.mat3(...)` short notation `new pc.Mat3(...)`
- `pc.mat4(...)` short notation `new pc.Mat4(...)`
- `Vec3().len` getter for `Vec3().length()`
- `Vec2().len` getter for `Vec2().length()`
- `Vec4().len` getter for `Vec4().length()`

### pc.calc()

further playcanvas gets a new function `pc.calc()` which handles assigned arithmetic expressions

```javascript
const pos = pc.vec3(5, 6, 7);
const dir = pc.vec3(1, 0, 0);
// pos: { x: 5, y: 6, z: 7 }  dir: { x: 1, y: 0, z: 0 }

const offsetA = pc.calc(() => dir * 30 + pos);
// offsetA: { x: 35, y: 6, z: 7 }
```
