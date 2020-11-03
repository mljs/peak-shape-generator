/**
 * Return a parameterized function of a lorentzian shape (see README for equation)
 * @param {Object} [options = {}] - options.
 * @param {Number} [options.x] - center of the lorentzian function.
 * @param {Number} [options.y] - height of the lorentzian shape curve.
 * @param {Number} [options.width] - full width at half maximum (FWHM) of the lorentzian function.
 */
export function lorentzianFct(options = {}) {
  const { x, width, y } = options;
  const rootWidth = width * width;
  const numerator = y * rootWidth;
  return (t) => {
    return numerator / (4 * Math.pow(t - x, 2) + rootWidth);
  };
}
