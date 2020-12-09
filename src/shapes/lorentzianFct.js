/**
 * Return a parameterized function of a lorentzian shape (see README for equation)
 * @param {number} x - center of the lorentzian function.
 * @param {number} y - height of the lorentzian shape curve.
 * @param {number} width - full width at half maximum (FWHM) of the lorentzian function.
 * @param {number} t - x value to calculate.
 * @returns {number} - the y value of lorentzian with the current parameters.
 */
export function lorentzianFct(x, y, width, t) {
  const squareWidth = width * width;
  return (y * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth);
}
