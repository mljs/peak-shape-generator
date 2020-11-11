import { pseudovoigtFct } from './shapes/pseudovoigtFct';
/**
 * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {object} [options = {}]
 * @param {Number} [options.height = 1] - maximum value of the curve.
 * @param {Number} [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {number} [options.fwhm = 1000] - number of points in Full Width at Half Maximum, Standard deviation for gaussian contribution will be computed as fwhm / 2 / sqrt(2 ln(2))
 * @param {number} [options.mu = 0.5] - ratio of gaussian contribution.
 * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function pseudoVoigt(options = {}) {
  let {
    height = 1,
    normalized = false,
    length,
    factor = Math.ceil(2 * Math.tan(Math.PI * (0.9999 - 0.5))),
    fwhm = 1000,
    mu = 0.5,
  } = options;

  if (!length) {
    length = Math.ceil(fwhm * factor);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;

  let intensity = normalized
    ? 1 /
      ((mu / Math.sqrt((4 * Math.LN2) / Math.PI)) * fwhm +
        ((1 - mu) * fwhm * Math.PI) / 2)
    : height;

  let data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = pseudovoigtFct(center, intensity, fwhm, mu, i);
    data[length - 1 - i] = data[i];
  }

  return { data, fwhm };
}
