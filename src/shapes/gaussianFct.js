/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param {Number} x - center of the lorentzian function.
 * @param {Number} y - height of the lorentzian shape curve.
 * @param {Number} width - full width at half maximum (FWHM) of the lorentzian function.
 * @param {Number} t - x value to calculate.
 */

export function gaussianFct(x, y, width, t) {
  return y * Math.exp(-4 * Math.LN2 * Math.pow((t - x) / width, 2));
}
