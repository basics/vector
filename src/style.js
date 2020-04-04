const NAME = Symbol('name');
const TEMPLATE = Symbol('template');
const TARGET = Symbol('target');
const KEYS = Symbol('keys');

function getCSSVars(name, target, keys) {
  let prefix = '';
  if (name) {
    prefix = `-${name}-`;
  }

  return keys.reduce((res, key) => {
    const t = target[key];
    if (t.toCSSVars) {
      t.toCSSVars(`${prefix}${key}`, res);
    } else {
      res[`-${prefix}-${key}`] = t.toString();
    }
    return res;
  }, {});
}

const handler = {
  get(obj, prop) {
    if (prop === 'cssTemplate') {
      return obj[TEMPLATE];
    }
    if (prop === 'cssVars') {
      return getCSSVars(obj[NAME], obj, obj[KEYS]);
    }
    return obj[prop];
  }
};

export function style({ name, template, ...definition }) {
  const proxy = new Proxy(definition, handler);
  proxy[NAME] = name;
  proxy[TEMPLATE] = template;
  proxy[TARGET] = definition;
  proxy[KEYS] = Object.keys(definition);
  return proxy;
}
