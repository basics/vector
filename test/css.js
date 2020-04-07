import { assert } from 'chai';
import { css } from '../src/css';
import { victor } from '../src';

describe('style test.', () => {
  // https://github.com/keithclark/cssvr/blob/master/src/js/viewport.js#L74
  it('a matrix should behave like in the cool cs vr demo', () => {

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

  it('a quaternion should behave like static fromOrientation from real Quaternion clas', () => {

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
