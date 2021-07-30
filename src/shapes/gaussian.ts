import {
  ROOT_2LN2,
  GAUSSIAN_EXP_FACTOR,
  ROOT_PI_OVER_LN2,
} from '../util/constants';
import erfinv from '../util/erfinv';

interface GetDataOpt {
  length?: number;
  factor?: number;
  height?: number;
  fwhm?: number;
  sd?: number;
}

interface GetAreaOpt {
  height?: number;
  fwhm?: number;
  sd?: number;
}

/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param x - x value to calculate.
 * @param fwhm - full width half maximum
 * @returns - the y value of gaussian with the current parameters.
 */
export function fct(fwhm: number = 500, x: number) {
  return Math.exp(GAUSSIAN_EXP_FACTOR * Math.pow(x / fwhm, 2));
}

/**
 * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
 * //https://mathworld.wolfram.com/GaussianFunction.html
 * @param width - Width between the inflection points
 * @returns fwhm
 */
export function widthToFWHM(width: number) {
  return width * ROOT_2LN2;
}

/**
 * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
 * //https://mathworld.wolfram.com/GaussianFunction.html
 * @param fwhm - Full Width at Half Maximum.
 * @returns width
 */
export function fwhmToWidth(fwhm: number) {
  return fwhm / ROOT_2LN2;
}

/**
 * Calculate the area of a specific shape.
 * @param fwhm - Full width at half maximum.
 * @param [height = 1] - Maximum y value of the shape.
 * @returns returns the area of the specific shape and parameters.
 */

export function getArea(options: GetAreaOpt) {
  let { fwhm, sd, height = 1 } = options;

  if (sd) fwhm = widthToFWHM(2 * sd);

  if (fwhm == undefined) {
      throw new Error('should pass fwhm or sd parameters');
  }

  return (height * ROOT_PI_OVER_LN2 * fwhm) / 2;
}

/**
 * Calculate the number of times FWHM allows to reach a specific area coverage.
 * @param [area=0.9999]
 * @returns
 */
export function getFactor(area: number = 0.9999) {
  return Math.sqrt(2) * erfinv(area);
}

/**
 * Calculate a gaussian shape
 * @param [options = {}]
 * @param [options.factor = 6] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {Float64Array} y values
 */

export function getData(options: GetDataOpt = {}) {
  let { length, factor = getFactor(), fwhm = 500, sd, height } = options;
  if (sd) fwhm = widthToFWHM(2 * sd);

  if (!height) {
    height = Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI) / fwhm;
  }

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = fct(fwhm, i - center) * height;
    data[length - 1 - i] = data[i];
  }

  return data;
}
