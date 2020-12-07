/**
 * Return a parameterized function of a linear combination of Gaussian and Lorentzian shapes where the full width at half maximum could be differents for both kind of shapes (see README for equation).
 * @param {Number} x - center of the lorentzian function.
 * @param {Number} y - height of the lorentzian shape curve.
 * @param {Number} lorentzianWidth - full width at half maximum (FWHM) of the lorentzian shape.
 * @param {Number} gaussianWidth - full width at half maximum (FWHM) of the gaussian shape.
 * @param {Number} mu - ratio of gaussian contribution.
 * @param {Number} t - x value to calculate.
 * @returns {Number} - the y value of a pseudo voigt with the current parameters.
 */

export function pseudovoigtFct2(x, y, gaussianWidth, lorentzianWidth, mu, t) {
  const squareWidth = lorentzianWidth * lorentzianWidth;
  return (
    y *
    (((1 - mu) * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth) +
      mu * Math.exp(-4 * Math.LN2 * Math.pow((t - x) / gaussianWidth, 2)))
  );
}
