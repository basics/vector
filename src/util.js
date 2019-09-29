
export function isArray(arr) {
  return Array.isArray(arr) || ArrayBuffer.isView(arr);
}

export function multQuatVec(quat, vec) {
  const {
    x, y, z
  } = vec;
  const {
    x: qx, y: qy, z: qz, w: qw
  } = quat;

  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;
  const rx = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  const ry = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  const rz = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return new vec.constructor(rx, ry, rz);
}

// https://github.com/immersive-web/webvr-polyfill/blob/ceb80d0e2d1d66e318782e30d89e0a09ca4857cd/build/webvr-polyfill.js#L2209
export function fromEulerYXZ(x, y, z) {
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);

  return [
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 - s1 * s2 * c3,
    c1 * c2 * c3 + s1 * s2 * s3
  ];
}

const angle180 = Math.PI;
const angle360 = Math.PI * 2;

export function normRad(angle) {
  let mod = angle % angle360;
  if (mod < -angle180) {
    mod += angle360;
  } else if (mod > angle180) {
    mod -= angle360;
  }
  return mod;
}
