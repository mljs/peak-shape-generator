import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../util/constants';

export class PseudoVoigt {
  /**
   * @param {number} mu - ratio of gaussian contribution.
   */
  constructor(mu = 0.5) {
    this.mu = mu;
  }

  /**
   * Calculate a linear combination of gaussian and lorentzian function width an same full width at half maximum
   * @param { object } [options = {}]
   * @param { number } [options.height = 1] - maximum value of the curve.
   * @param { number } [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
   * @param { number } [options.fwhm = 500] - Number of points at Full Width at Half Maximum(FWHM)
   * @param { number } [options.mu = 0.5] - ratio of gaussian contribution.
   * @param { number } [options.factor = 2 * Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm in the calculation of the length.Default covers 99.99 % of area.
   * @param { number } [options.length = fwhm * factor + 1] - total number of points to calculate
   * @return { object } - { fwhm, data<Float64Array>} - An with the number of points at half maximum and the array of y values covering the 99.99 % of the area.
   */

  shape(options = {}) {
    let {
      height = 1,
      normalized = false,
      length,
      factor = this.getFactor(),
      fwhm = 500,
      mu = 0.5,
    } = options;

    if (!length) {
      length = Math.ceil(fwhm * factor);
      if (length % 2 === 0) length++;
    }

    const center = (length - 1) / 2;

    let intensity = normalized
      ? 1 /
      ((this.mu / Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI)) * fwhm +
        ((1 - this.mu) * fwhm * Math.PI) / 2)
      : height;

    let data = new Float64Array(length);
    for (let i = 0; i <= center; i++) {
      data[i] = this.fct(center, intensity, fwhm, mu, i);
      data[length - 1 - i] = data[i];
    }

    return { data, fwhm };
  }

  /**
   * Return a parameterized function of a linear combination of Gaussian and Lorentzian shapes where the full width at half maximum are the same for both kind of shapes (see README for equation).
   * @param {number} x - center of the lorentzian function.
   * @param {number} y - height of the lorentzian shape curve.
   * @param {number} width - full width at half maximum (FWHM) of the lorentzian function.
   * @param {number} t - x value to calculate.
   * @returns {number} - the y value of a pseudo voigt with the current parameters.
   */

  fct(x, y, width, t) {
    const squareWidth = width * width;
    return (
      y *
      (((1 - this.mu) * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth) +
        this.mu * Math.exp(GAUSSIAN_EXP_FACTOR * Math.pow((t - x) / width, 2)))
    );
  }

  getFactor(area = 0.99999) {
    return 2 * Math.tan(Math.PI * (area - 0.5));
  }

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) of a specific shape from the width between the inflection points.
   * @param {number} width - Width between the inflection points
   * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
   * @param {object} options - options
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   */
  inflectionPointsWidthToFWHM(width) {
    return width * (this.mu * ROOT_2LN2_MINUS_ONE + 1);
  }

  /**
   * Compute the value of width between the inflection points of a specific shape from Full Width at Half Maximum (FWHM).
   * @param {number} fwhm - Full Width at Half Maximum.
   * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
   * @param {object} options - options
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   */
  fwhmToInflectionPointsWidth(fwhm) {
    return fwhm / (this.mu * ROOT_2LN2_MINUS_ONE + 1);
  }

  /**
   * Calculate the area of a specific shape.
   * @param {number} fwhm - Full width at half maximum.
   * @param {number|string} [kind = 1] - number of points in Full Width at Half Maximum, Standard deviation will be computed as fwhm / 2 / sqrt(2 ln(2))
   * @param {*} [options = {}] - options.
   * @param {number} [options.height = 1] - Maximum y value of the shape.
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   * @returns {number} - returns the area of the specific shape and parameters.
   */

  area(fwhm, options = {}) {
    let { height = 1, mu = 0.5 } = options;

    return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
  }
}
