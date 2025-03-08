// https://code.open-xchange.com/#contentPanel;a7550a02-aa41-45d9-9cad-7e1c920815f3;null;ui/apps/io.ox/office/tk/utils.js;content

const DECIMAL = (0.5).toLocaleString().substring(1, 2) || '.';
const ZERO = (0).toLocaleString() || '0';

function normalizeNumber(number) {
  // special handling for zero
  if (number === 0) {
    return { mant: 0, exp: 2 };
  }

  let exp = Math.floor(Math.log(Math.abs(number)) / Math.LN10);
  const e = 10 ** exp;
  let mant = number / e;

  // due to rounding errors, the absolute value of the mantissa may become less than 1
  if (Math.abs(mant) < 1) {
    mant /= Math.abs(mant);
  }

  // due to rounding errors, the mantissa may become +-10 instead +-1, e.g. for the number 1000
  if (Math.abs(mant) >= 10) {
    mant /= 10;
    exp += 1;
  }

  return { mant, exp };
}

export function formatNumber(nr, digits) {
  const n = normalizeNumber(nr);
  n.mant /= 10;
  n.exp += 1;

  const p = digits || 4;
  const rounder = 10 ** Math.max(n.exp, p);

  let mant = Math.round(n.mant * rounder) / rounder;
  if (mant === 1) {
    mant /= 10;
    n.exp += 1;
  }

  if (n.exp < 1) {
    const mantString = mant.toString().replace(`${ZERO}${DECIMAL}`, '');

    return `${ZERO}${DECIMAL}${ZERO.repeat(Math.max(0, -n.exp))}${mantString.toLocaleString(undefined, {
      useGrouping: true
    })}`;
  }
  const e = 10 ** n.exp;
  return (mant * e).toLocaleString();
}
