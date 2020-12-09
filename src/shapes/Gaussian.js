import erfinv from 'compute-erfinv';

import {
  ROOT_2LN2,
  GAUSSIAN_EXP_FACTOR,
  ROOT_PI_OVER_LN2,
} from '../util/constants';

export class Gaussian {
  /**
   * Calculate a normalized gaussian shape
   * @param {object} [options = {}]
   * @param {number} [options.height = 1] - maximum value of the curve.
   * @param {number} [options.normalized = false] - If it's true the area under the curve will be equal to one, ignoring height option.
   * @param {number} [options.fwhm = 500] - Full Width at Half Maximum in the number of points in FWHM.
   * @param {number} [options.sd] - Standard deviation, if it's defined options.fwhm will be ignored and the value will be computed sd * Math.sqrt(8 * Math.LN2);
   * @param {number} [options.factor = 6] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
   * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
   * @return {Float64Array} y values
   */

  shape(options = {}) {
    let {
      height = 1,
      length,
      factor = this.getFactor(),
      fwhm = 500,
      sd,
      normalized = false,
    } = options;

    if (sd) {
      fwhm = this.inflectionPointsWidthToFWHM(2 * sd);
    }

    if (!length) {
      length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
      if (length % 2 === 0) length++;
    }

    const center = (length - 1) / 2;

    let intensity = normalized
      ? Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI) / fwhm
      : height;

    const data = new Float64Array(length);
    for (let i = 0; i <= center; i++) {
      data[i] = this.fct(center, intensity, fwhm, i);
      data[length - 1 - i] = data[i];
    }
    return data;
  }

  /**
   * Return a parameterized function of a gaussian shape (see README for equation).
   * @param {number} x - center of the gaussian function.
   * @param {number} y - height of the gaussian shape curve.
   * @param {number} width - full width at half maximum (FWHM) of the gaussian function.
   * @param {number} t - x value to calculate.
   * @returns {number} - the y value of gaussian with the current parameters.
   */
  fct(x, y, width, t) {
    return y * Math.exp(GAUSSIAN_EXP_FACTOR * Math.pow((t - x) / width, 2));
  }

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) of a specific shape from the width between the inflection points.
   * @param {number} width - Width between the inflection points
   * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
   * @param {object} options - options
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   */

  inflectionPointsWidthToFWHM(width) {
    //https://mathworld.wolfram.com/GaussianFunction.html
    return width * ROOT_2LN2;
  }

  /**
   * Compute the value of width between the inflection points of a specific shape from Full Width at Half Maximum (FWHM).
   * @param {number} fwhm - Full Width at Half Maximum.
   * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
   * @param {object} options - options
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   */

  fwhmToInflectionPointsWidth(fwhm) {
    return fwhm / ROOT_2LN2;
  }

  getFactor(area = 0.99999) {
    return Math.sqrt(2) * erfinv(area);
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

  getArea(fwhm, options) {
    const { height = 1 } = options;
    return (height * ROOT_PI_OVER_LN2 * fwhm) / 2;
  }
}
