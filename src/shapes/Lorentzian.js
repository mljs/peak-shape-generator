import { ROOT_THREE } from '../util/constants';

export class Lorentzian {
  /**
   * Calculate a lorentzian shape
   * @param {object} [options = {}]
   * @param {number} [options.height] - maximum value of the curve.
   * @param {number} [options.normalized] - If it's true the area under the curve will be equal to one, ignoring height option.
   * @param {number} [options.fwhm = 500] - Full Width at Half Maximum in number of points.
   * @param {number} [options.factor = Math.tan(Math.PI * (0.9999 - 0.5))] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
   * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
   * @return {Float64Array} y values
   */
  shape(options = {}) {
    let {
      height = 1,
      length,
      factor = this.getFactor(),
      fwhm = 500,
      normalized = false,
    } = options;

    if (!length) {
      length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
      if (length % 2 === 0) length++;
    }

    const center = (length - 1) / 2;
    const data = new Float64Array(length);
    const intensity = normalized ? 2 / Math.PI / fwhm : height;
    for (let i = 0; i <= center; i++) {
      data[i] = this.fct(center, intensity, fwhm, i);
      data[length - 1 - i] = data[i];
    }
    return data;
  }

  /**
   * Return a parameterized function of a lorentzian shape (see README for equation)
   * @param {number} x - center of the gaussian function.
   * @param {number} y - height of the lorentzian shape curve.
   * @param {number} width - full width at half maximum (FWHM) of the lorentzian function.
   * @param {number} t - x value to calculate.
   * @returns {number} - the y value of lorentzian with the current parameters.
   */
  fct(x, y, width, t) {
    const squareWidth = width * width;
    return (y * squareWidth) / (4 * Math.pow(t - x, 2) + squareWidth);
  }

  getFactor(area = 0.99999) {
    return 2 * Math.tan(Math.PI * (area - 0.5));
  }

  /**
   * Compute the value of width between the inflection points of a specific shape from Full Width at Half Maximum (FWHM).
   * @param {number} fwhm - Full Width at Half Maximum.
   * @param {number|string} [kind = 1] kind may be 'gaussian', 'lorentzian' or 'pseudovoigt' or their corresponding number
   * @param {object} options - options
   * @param {number} [options.mu = 0.5] - ratio of gaussian contribution. It is used if the kind = 3 or pseudovoigt.
   */
  fwhmToInflectionPointsWidth(fwhm) {
    return fwhm / ROOT_THREE;
  }

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) of a specific shape from the width between the inflection points.
   * @param {number} width - Width between the inflection points
   */
  inflectionPointsWidthToFWHM(width) {
    //https://mathworld.wolfram.com/LorentzianFunction.html
    return width * ROOT_THREE;
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
    let { height = 1 } = options;

    return (height * Math.PI * fwhm) / 2;
  }
}
