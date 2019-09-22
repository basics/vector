export function isArray(arr) {
  return Array.isArray(arr) || ArrayBuffer.isView(arr);
}
