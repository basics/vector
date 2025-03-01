export function isArray(arr) {
  return Array.isArray(arr) || ArrayBuffer.isView(arr);
}

// http://schteppe.github.io/cannon.js/docs/files/src_math_Quaternion.js.html
export function multQuatVec(quat, vec) {
  const { x, y, z } = vec;
  const { x: qx, y: qy, z: qz, w: qw } = quat;

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

// https://www.khronos.org/registry/OpenGL/specs/es/2.0/GLSL_ES_Specification_1.00.pdf page 50 & 51
// https://stackoverflow.com/questions/24593939/matrix-multiplication-with-vector-in-glsl#answer-24594497
export function multiplyMat3Mat3(matLeft, [mat0, mat1, mat2]) {
  const [column0, column1, column2] = matLeft;
  return new matLeft.constructor(
    new column0.constructor(
      column0.x * mat0.x + column1.x * mat0.y + column2.x * mat0.z,
      column0.y * mat0.x + column1.y * mat0.y + column2.y * mat0.z,
      column0.z * mat0.x + column1.z * mat0.y + column2.z * mat0.z
    ),
    new column0.constructor(
      column0.x * mat1.x + column1.x * mat1.y + column2.x * mat1.z,
      column0.y * mat1.x + column1.y * mat1.y + column2.y * mat1.z,
      column0.z * mat1.x + column1.z * mat1.y + column2.z * mat1.z
    ),
    new column0.constructor(
      column0.x * mat2.x + column1.x * mat2.y + column2.x * mat2.z,
      column0.y * mat2.x + column1.y * mat2.y + column2.y * mat2.z,
      column0.z * mat2.x + column1.z * mat2.y + column2.z * mat2.z
    )
  );
}

export function multiplyMat3Vec(matLeft, { x, y, z }) {
  const [column0, column1, column2] = matLeft;
  return new column0.constructor(
    column0.x * x + column1.x * y + column2.x * z,
    column0.y * x + column1.y * y + column2.y * z,
    column0.z * x + column1.z * y + column2.z * z
  );
}

export function multiplyVecMat3(vecLeft, [column0, column1, column2]) {
  return new vecLeft.constructor(vecLeft.dot(column0), vecLeft.dot(column1), vecLeft.dot(column2));
}

export function multiplyVecMat4(vecLeft, [column0, column1, column2, column3]) {
  return new vecLeft.constructor(
    vecLeft.dot(column0),
    vecLeft.dot(column1),
    vecLeft.dot(column2),
    vecLeft.dot(column3)
  );
}

export function isNumber(nr) {
  if (typeof nr === 'number' || nr?.constructor === Number) {
    return true;
  }
  return false;
}
