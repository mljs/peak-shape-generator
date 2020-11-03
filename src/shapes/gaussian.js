/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param {Object} parameters - parameters.
 * @param {Number} [parameters.x] - center of the lorentzian function.
 * @param {Number} [parameters.y] - height of the lorentzian shape curve.
 * @param {Number} [parameters.width] - full width at half maximum (FWHM) of the lorentzian function.
 */
export function gaussianFct(parameters) {
  const { x, width, y } = parameters;
  const sd = width / 2 / Math.sqrt(2 * Math.log(2));
  return (t) => {
    return y * Math.exp(-0.5 * Math.pow((t - x) / sd, 2));
  };
}
