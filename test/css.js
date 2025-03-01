import { assert } from 'chai';
import { css } from '../src/css';
import { iquaternion, victor } from '../src';
import { describe, it } from 'vitest';

describe('style test.', function () {
  it('a transform should behave like in 3d game engines', function () {
    // const template = `
    //   transform: matrix3d(
    //    var(--rot-a1), var(--rot-b1), var(--rot-c1), var(--translation-x),
    //    var(--rot-a2), var(--rot-b2), var(--rot-c2), var(--translation-y),
    //    var(--rot-a3), var(--rot-b3), var(--rot-c3), var(--translation-z),
    //    var(--scale-x), var(--scale-y), var(--scale-z), 1.0);

    const transform = css();

    transform.translation = victor(-5, -6, -7);
    transform.rotation = iquaternion(victor(0, 0, -1), victor(0, 1, 0));
    transform.scale = victor(1, 1, 1);

    const { vars } = transform;

    assert.deepEqual(vars, {
      '--rotation-a1': -1,
      '--rotation-a2': 0,
      '--rotation-a3': 0,
      '--rotation-b1': 0,
      '--rotation-b2': 1,
      '--rotation-b3': 0,
      '--rotation-c1': 0,
      '--rotation-c2': 0,
      '--rotation-c3': -1,
      '--rotation-w': 0,
      '--rotation-x': 0,
      '--rotation-y': 1,
      '--rotation-z': 0,
      '--scale-x': 1,
      '--scale-y': 1,
      '--scale-z': 1,
      '--translation-x': -5,
      '--translation-y': -6,
      '--translation-z': -7
    });
  });

  // https://github.com/keithclark/cssvr/blob/master/src/js/viewport.js#L74
  it('a matrix should behave like in the cool cs vr demo', function () {
    // const template = `
    //   transform:
    //     translate3d(-50%,-50%,calc(var(--fov) - var(--fov) / 10px))
    //     rotateZ(calc(var(--rotation-z) * 1deg))
    //     rotateX(calc(var(--rotation-x) * 1deg))
    //     rotateY(calc(var(--rotation-y) * 1deg))
    //     translate3d(calc(--position-x * 1px), calc(--position-y * 1px), calc(--position-z * 1px));
    //
    //   perspective: calc(var(--fov) * 1px);`;

    const matrix = css();

    matrix.position = victor(-5, -6, -7);
    matrix.fov = 450;
    matrix.rotation = victor(45, 6, 7);

    const { vars } = matrix;

    assert.deepEqual(vars, {
      '--position-x': -5,
      '--position-y': -6,
      '--position-z': -7,
      '--fov': 450,
      '--rotation-x': 45,
      '--rotation-y': 6,
      '--rotation-z': 7
    });
  });

  it('a quaternion should behave like static fromOrientation from real Quaternion clas', function () {
    // const template = `
    //   transform:
    //     rotateY(calc(var(--gyro-alpha) * 1deg))
    //     rotateZ(calc(var(--gyro-beta) * 1deg))
    //     rotateX(calc(var(--gyro-gamma) * 1deg))
    //     rotateZ(-90deg));
    //   `;

    const matrix = css('gyro');

    matrix.beta = 20;
    matrix.alpha = 20;
    matrix.gamma = 12;

    const { vars } = matrix;

    assert.deepEqual(vars, {
      '--gyro-beta': 20,
      '--gyro-alpha': 20,
      '--gyro-gamma': 12
    });
  });
});
