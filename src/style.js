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
        res[`--${prefix}${key}`] = t.toString();
      }
      return res;
    }, {});
  }
}

export class TemplateStyle extends Style {
  constructor(template, name = undefined) {
    super(name);
    this.template = template;
  }

  bakeStyle() {
    const { cssVars } = this;
    const vars = Object.entries(cssVars).map(([key, v]) => `${key}: ${v}`).join((';\n'));
    return `\n${this.template}\n${vars}\n`;
  }
}

export function style(name = undefined) {
  return new Style(name);
}

export function templateStyle(template, name = undefined) {
  return new TemplateStyle(template, name);
}
