/**
 * Return a parameterized function of a linear combination of Gaussian and Lorentzian shapes (see README for equation).
 * @param {Object} [options = {}] - options.
 * @param {Number} [options.x] - center of the lorentzian function.
 * @param {Number} [options.y] - height of the lorentzian shape curve.
 * @param {Number} [options.width] - full width at half maximum (FWHM) of the lorentzian function.
 * @param {Number} [options.normalized] - If it's true the area under the curve will be equal to one.
 */

export function pseudovoigtFct(options = []) {
  const { x, width, y, mu, normalized } = options;

  const rootWidth = width * width;
  const sd = width / 2 / Math.sqrt(2 * Math.LN2);
  const gFactor = normalized ? mu / Math.sqrt(2 * Math.PI) / sd : mu * y;
  const lFactor = normalized
    ? ((1 - mu) * 2 * width) / Math.PI
    : (1 - mu) * y * rootWidth;

  return (t) => {
    return (
      lFactor / (4 * Math.pow(t - x, 2) + rootWidth) +
      gFactor * Math.exp(-0.5 * Math.pow((t - x) / sd, 2))
    );
  };
}
