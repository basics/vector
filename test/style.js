import { assert } from 'chai';
import { style } from '../src/style';
import { victor } from '../src';

describe('style test.', () => {
  // https://github.com/keithclark/cssvr/blob/master/src/js/viewport.js#L74
  it('a matrix should behave like in the cool cs vr demo', () => {

    const template = `
      transform:
        translate3d(-50%,-50%,calc(var(--fov) - var(--fov) / 10px))
        rotateZ(calc(var(--rotation-z) * 1deg))
        rotateX(calc(var(--rotation-x) * 1deg))
        rotateY(calc(var(--rotation-y) * 1deg))
        translate3d(calc(--position-x * 1px), calc(--position-y * 1px), calc(--position-z * 1px))
    `;
    const definition = {
      template,
      fov: 450,
      position: victor(5, 6, 7),
      rotation: victor(45, 6, 7),
    };

    const matrix = style(definition);

    matrix.position = victor(-5, -6, -7);

    console.log('hallo', matrix.cssTemplate, matrix.cssVars);

    // assert.equal(formatNumber(0.00000001), '0.00000001');

  });

  it('a quaternion should behave like static fromOrientation from real Quaternion clas', () => {

    const template = `
      transform:
        rotateY(calc(var(--alpha-y) * 1deg))
        rotateZ(calc(var(--beta-z) * 1deg))
        rotateX(calc(var(--gamma-x) * 1deg))
        rotateZ(-90deg))
    `;
    const definition = {
      template,
      alpha: 450,
      beta: 10,
      gamma: 12,
      orientation: 0
    };

    const matrix = style(definition);

    matrix.beta = 20;
    matrix.orientation = 90;

    console.log('hallo', matrix.cssTemplate, matrix.cssVars);

    // assert.equal(formatNumber(0.00000001), '0.00000001');

  });

  // export function fromOrientation({ alpha, beta, gamma }, orientation) {
  // let rot = iquaternion(UP, degree(alpha))
  //   .mul(RIGHT, degree(beta))
  //   .mul(FORWARD, degree(gamma))
  //   .mul(LEFT90);
  //
  // rot = iquaternion(rot.dir, degree(orientation))
  //   .mul(rot);
  //
  // return rot;
  // }
});
