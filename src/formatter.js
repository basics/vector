// https://code.open-xchange.com/#contentPanel;a7550a02-aa41-45d9-9cad-7e1c920815f3;null;ui/apps/io.ox/office/tk/utils.js;content

const MULTIPLIER = 7;

function normalizeNumber(number) {
  // special handling for zero
  if (number === 0) {
    return { mant: 0, exp: 1 };
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

  for (let i = 0; i <= MULTIPLIER; i += 1) {
    mant /= 10;
    exp += 1;
  }

  return { mant, exp };
}

export default function formatNumber(nr, digits) {
  const n = normalizeNumber(nr);
  const p = digits || 4;
  const rounder = 10 ** (p + MULTIPLIER);

  const mant = Math.round(n.mant * rounder) / rounder;

  const e = 10 ** n.exp;
  return mant * e;
}
