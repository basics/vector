export function getVarPrefix(name) {
  let prefix = '';
  if (name) {
    prefix = `${name}-`;
  }
  return prefix;
}

export function convertToCSSVars(name, obj, target = {}) {
  const prefix = getVarPrefix(name);
  Object.entries(obj).forEach((value, key) => {
    target[`--${prefix}${key}`] = value;
  });
  return target;
}
