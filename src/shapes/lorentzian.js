/**
 * Return a parameterized function of a lorentzian shape (see README for equation)
 * @param {Object} parameters - parameters.
 * @param {Number} [parameters.x] - center of the lorentzian function.
 * @param {Number} [parameters.y] - height of the lorentzian shape curve.
 * @param {Number} [parameters.width] - full width at half maximum (FWHM) of the lorentzian function.
 */
export function lorentzianFct(parameters) {
  const { x, width, y } = parameters;
  const rootWidth = width * width;
  const numerator = y * rootWidth;
  return (t) => {
    return numerator / (4 * Math.pow(t - x, 2) + rootWidth);
  };
}
