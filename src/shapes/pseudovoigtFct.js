/**
 * Return a parameterized function of a linear combination of Gaussian and Lorentzian shapes where the full width at half maximum are the same for both kind of shapes (see README for equation).
 * @param {Number} x - center of the lorentzian function.
 * @param {Number} y - height of the lorentzian shape curve.
 * @param {Number} width - full width at half maximum (FWHM) of the lorentzian function.
 * @param {Number} mu - ratio of gaussian contribution.
 * @param {Number} t - x value to calculate.
 * @returns {Number} - the y value of a pseudo voigt with the current parameters.
 */

const factor = -4 * Math.LN2;
export function pseudovoigtFct(x, y, width, mu, t) {
  const squareWidth = width * width;
  return (
    y *
    (((1 - mu) * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth) +
      mu * Math.exp(factor * Math.pow((t - x) / width, 2)))
  );
}
