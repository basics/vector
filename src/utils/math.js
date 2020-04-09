
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

export function acos(fValue) {
  if (fValue > -1.0) {
    if (fValue < 1.0) {
      return Math.acos(fValue);
    }
    return 0.0;
  }
  return angle180;
}
