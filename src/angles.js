const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function radians(degree) {
  return degree * DEG_TO_RAD;
}

export function degrees(radian) {
  return radian * RAD_TO_DEG;
}
