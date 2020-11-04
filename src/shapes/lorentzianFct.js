/**
 * Return a parameterized function of a lorentzian shape (see README for equation)
 * @param {Number} x - center of the lorentzian function.
 * @param {Number} y - height of the lorentzian shape curve.
 * @param {Number} width - full width at half maximum (FWHM) of the lorentzian function.
 * @param {Number} t - x value to calculate.
 */
export function lorentzianFct(x, y, width, t) {
  const squareWidth = width * width;
  return (y * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth);
}
