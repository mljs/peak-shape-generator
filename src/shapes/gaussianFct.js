/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param {Object} [options = {}] - options.
 * @param {Number} [options.x] - center of the lorentzian function.
 * @param {Number} [options.y] - height of the lorentzian shape curve.
 * @param {Number} [options.width] - full width at half maximum (FWHM) of the lorentzian function.
 */
export function gaussianFct(options = {}) {
  const { x, width, y } = options;
  const sd = width / 2 / Math.sqrt(2 * Math.LN2);
  return (t) => {
    return y * Math.exp(-0.5 * Math.pow((t - x) / sd, 2));
  };
}
