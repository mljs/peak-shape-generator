import { pseudovoigtFct2 } from './shapes/pseudovoigtFct2';
/**
 * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
 * @param {object} [options = {}]
 * @param {Number} [options.height = 1] - maximum value of the curve.
 * @param {Number} [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
 * @param {Number} [options.interval = 1] - Step size to calculate the shape values.
 * @param {number} [options.fwhm = 500] - Full Width at Half Maximum, if options.interval is equal to 1, it will be the number of points in FWHM.
 * @param {number} [options.fwhm.gaussian] - Full Width at Half Maximum for gaussian contribution.
 * @param {number} [options.fwhm.lorentzian] - Full Width at Half Maximum for lorentzian contribution.
 * @param {number} [options.mu = 0.5] - ratio of gaussian contribution.
 * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm in the calculation of the length. Default covers 99.99 % of area.
 * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {object} - {fwhm, data<Float64Array>} - An object with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
 */

export function pseudoVoigt(options = {}) {
  let {
    interval = 1,
    height = 1,
    normalized = false,
    length,
    factor = Math.ceil(2 * Math.tan(Math.PI * (0.9999 - 0.5))),
    fwhm = 1000,
    mu = 0.5,
  } = options;

  let gaussianFWHM, lorentzianFWHM;
  if (typeof fwhm === 'object') {
    let { gaussian, lorentzian } = fwhm;
    gaussianFWHM = gaussian;
    lorentzianFWHM = lorentzian;
  } else {
    gaussianFWHM = lorentzianFWHM = fwhm;
  }

  if (!length) {
    length = Math.min(
      Math.ceil((lorentzianFWHM * factor) / interval),
      Math.pow(2, 20),
    );
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const mean = center * interval;

  let intensity = normalized
    ? 1 /
      ((mu / Math.sqrt((4 * Math.LN2) / Math.PI)) * gaussianFWHM +
        ((1 - mu) * lorentzianFWHM * Math.PI) / 2)
    : height;

  let data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = pseudovoigtFct2(
      mean,
      intensity,
      gaussianFWHM,
      lorentzianFWHM,
      mu,
      i * interval,
    );
    data[length - 1 - i] = data[i];
  }

  return { data, fwhm, interval };
}
