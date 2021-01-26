import {
  ROOT_2LN2,
  GAUSSIAN_EXP_FACTOR,
  ROOT_PI_OVER_LN2,
} from '../util/constants';
import erfinv from '../util/erfinv';

export class Gaussian2D {
  /**
   * @param {object} [options = {}]
   * @param {number} [options.height=x] Define the height of the peak, by default area=1 (normalized).
   * @param {object} [options.x] - Options for x axis.
   * @param {number} [options.x.fwhm = 500] - Full Width at Half Maximum in the number of points in FWHM for x axis.
   * @param {number} [options.x.sd] - Standard deviation for x axis, if it's defined options.x.fwhm will be ignored and the value will be computed sd * Math.sqrt(8 * Math.LN2);
   * @param {object} [options.y] - Options for y axis.
   * @param {number} [options.y.fwhm = 500] - Full Width at Half Maximum in the number of points in FWHM for y axis.
   * @param {number} [options.y.sd] - Standard deviation for y axis, if it's defined options.y.fwhm will be ignored and the value will be computed sd * Math.sqrt(8 * Math.LN2);
   */
  constructor(options = {}) {
    options = assignDeep({}, options, { x: { fwhm: 500 }, y: { fwhm: 500 } });
    this.x.fwhm = options.x.sd
      ? Gaussian2D.widthToFWHM(2 * options.x.sd)
      : options.x.fwhm;
    this.y.fwhm = options.y.sd
      ? Gaussian2D.widthToFWHM(2 * options.y.sd)
      : options.y.fwhm;
    this.height =
      options.height === undefined
        ? -GAUSSIAN_EXP_FACTOR / Math.PI / this.x.fwhm / this.y.fwhm
        : options.height;
  }
  /**
   * Calculate a Gaussian2D shape
   * @param {object} [options = {}]
   * @param {number} [options.factor = 6] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
   * @param {number} [options.length = fwhm * factor + 1] - total number of points to calculate
   * @return {Float64Array} y values
   */

  getData(options = {}) {
    let { x = {}, y = {}, factor = this.getFactor() } = options;

    let xLength = x.length;
    if (!xLength) {
      xLength = Math.min(Math.ceil(this.x.fwhm * factor), Math.pow(2, 25) - 1);
      if (xLength % 2 === 0) xLength++;
    }

    let yLength = y.length;
    if (!yLength) {
      yLength = Math.min(Math.ceil(this.y.fwhm * factor), Math.pow(2, 25) - 1);
      if (yLength % 2 === 0) yLength++;
    }

    const xCenter = (xLength - 1) / 2;
    const yCenter = (yLength - 1) / 2;
    const data = new Array(xLength);

    for (let i = 0; i <= xCenter; i++) {
      data[i] = new Float64Array(yLength);
      for (let j = 0; j <= yCenter; j++) {
        data[i][j] = this.fct(i - xCenter, j - yCenter) * this.height;
        data[xLength - 1 - i][yLength - 1 - j] = data[i][j];
      }
    }

    return data;
  }

  /**
   * Return a parameterized function of a Gaussian2D shape (see README for equation).
   * @param {number} x - x value to calculate.
   * @param {number} y - y value to calculate.
   * @returns {number} - the z value of bi-dimensional gaussian with the current parameters.
   */
  fct(x, y) {
    return Gaussian2D.fct(x, y, this.x.fwhm, this.y.fwhm);
  }

  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage
   * @param {number} [area=0.9999]
   * @returns {number}
   */
  getFactor(area = 0.9999) {
    return Gaussian2D.getFactor(area);
  }

  /**@TODO
   * Calculate the area of the shape.
   * @returns {number} - returns the area.
   */

  getArea() {
    return Gaussian2D.getArea(this.fwhm, { height: this.height });
  }

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * //https://mathworld.wolfram.com/Gaussian2DFunction.html
   * @param {number} width - Width between the inflection points
   * @returns {number} fwhm
   */
  widthToFWHM(width) {
    //https://mathworld.wolfram.com/Gaussian2DFunction.html
    return Gaussian2D.widthToFWHM(width);
  }

  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * //https://mathworld.wolfram.com/Gaussian2DFunction.html
   * @param {number} fwhm - Full Width at Half Maximum.
   * @returns {number} width
   */
  fwhmToWidth(fwhm = this.x.fwhm) {
    return Gaussian2D.fwhmToWidth(fwhm);
  }

  /**
   * set a new full width at half maximum
   * @param {number} fwhm - full width at half maximum
   */
  setFWHM(axis, fwhm) {
    let axisName = axis.toLowerCase();
    if (axisName !== 'y' && axisName !== 'x') {
      throw new Error('axis name should be x or y');
    }
    this[axisName].fwhm = fwhm;
  }

  /**
   * set a new height
   * @param {number} height - The maximal intensity of the shape.
   */
  setHeight(height) {
    this.height = height;
  }
}

/**
 * Return a parameterized function of a Gaussian2D shape (see README for equation).
 * @param {number} x - x value to calculate.
 * @param {number} y - y value to calculate.
 * @param {number} fwhmX - full width half maximum in the x axis.
 * @param {number} fwhmY - full width half maximum in the y axis.
 * @returns {number} - the z value of bi-dimensional gaussian with the current parameters.
 */
Gaussian2D.fct = function fct(x, y, xFWHM = 500, yFWHM = 500) {
  return Math.exp(
    GAUSSIAN_EXP_FACTOR * (Math.pow(x / xFWHM, 2) + Math.pow(y / yFWHM, 2)),
  );
};

/**
 * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
 * //https://mathworld.wolfram.com/Gaussian2DFunction.html
 * @param {number} width - Width between the inflection points
 * @returns {number} fwhm
 */
Gaussian2D.widthToFWHM = function widthToFWHM(width) {
  return width * ROOT_2LN2;
};

/**
 * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
 * //https://mathworld.wolfram.com/Gaussian2DFunction.html
 * @param {number} fwhm - Full Width at Half Maximum.
 * @returns {number} width
 */
Gaussian2D.fwhmToWidth = function fwhmToWidth(fwhm) {
  return fwhm / ROOT_2LN2;
};

/**
 * Calculate the area of a specific shape.
 * @param {number} fwhm - Full width at half maximum.
 * @param {object} [options = {}] - options.
 * @param {number} [options.height = 1] - Maximum y value of the shape.
 * @returns {number} - returns the area of the specific shape and parameters.
 */

Gaussian2D.getArea = function getArea(fwhm, options = {}) {
  let { height = 1 } = options;
  return (height * ROOT_PI_OVER_LN2 * fwhm) / 2;
};

/**
 * Calculate the number of times FWHM allows to reach a specific area coverage.
 * @param {number} [area=0.9999]
 * @returns {number}
 */
Gaussian2D.getFactor = function getFactor(area = 0.9999) {
  return Math.sqrt(2) * erfinv(area);
};
