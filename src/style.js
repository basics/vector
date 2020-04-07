export class Style {
  constructor(name = undefined) {
    this.name = name;
  }

  get cssVars() {
    let prefix = '';
    const { name } = this;
    if (name) {
      prefix = `${name}-`;
    }

    return Object.entries(this).reduce((res, [key, t]) => {
      if (key === 'name' || key === 'cssVars' || key === 'template') {
        return res;
      }
      if (t.toCSSVars) {
        t.toCSSVars(`${prefix}${key}`, res);
      } else {
        res[`--${prefix}${key}`] = t.valueOf();
      }
      return res;
    }, {});
  }
}

export function style(name = undefined) {
  return new Style(name);
}
