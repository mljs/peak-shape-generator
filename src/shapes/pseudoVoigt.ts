import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../util/constants';

import { fct as lorentzian } from './lorentzian';
import { fct as gaussian } from './gaussian';

interface GetDataOpt {
  length?: number;
  factor?: number;
  height?: number;
  fwhm?: number;
  mu?: number;
}

interface GetAreaOpt {
  height?: number;
  fwhm?: number;
  mu?: number;
}

/**
 * Return a parameterized function of a gaussian shape (see README for equation).
 * @param x - x value to calculate.
 * @param fwhm - full width half maximum
 * @returns - the y value of gaussian with the current parameters.
 */
export function fct(fwhm: number = 500, mu: number, x: number) {
  return (1 - mu) * lorentzian(fwhm, x) + mu * gaussian(fwhm, x);
}

/**
 * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
 * //https://mathworld.wolfram.com/GaussianFunction.html
 * @param width - Width between the inflection points
 * @returns fwhm
 */
export function widthToFWHM(width: number, mu: number = 0.5) {
  return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
}

/**
 * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
 * //https://mathworld.wolfram.com/GaussianFunction.html
 * @param fwhm - Full Width at Half Maximum.
 * @returns width
 */
export function fwhmToWidth(fwhm: number, mu: number = 0.5) {
  return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
}

/**
 * Calculate the area of a specific shape.
 * @param fwhm - Full width at half maximum.
 * @param [height = 1] - Maximum y value of the shape.
 * @returns returns the area of the specific shape and parameters.
 */

export function getArea(options: GetAreaOpt) {
  let { fwhm, height = 1, mu = 0.5 } = options;

  if (fwhm == undefined) {
    throw new Error('should pass fwhm or sd parameters');
  }

  return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
}

/**
 * Calculate the number of times FWHM allows to reach a specific area coverage.
 * @param [area=0.9999]
 * @returns
 */
export function getFactor(area: number = 0.9999) {
  return 2 * Math.tan(Math.PI * (area - 0.5));
}

/**
 * Calculate a gaussian shape
 * @param [options = {}]
 * @param [options.factor = 6] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param [options.length = fwhm * factor + 1] - total number of points to calculate
 * @return {Float64Array} y values
 */

export function getData(options: GetDataOpt = {}) {
  let { length, factor = getFactor(), fwhm = 500, height, mu = 0.5 } = options;

  if (!height) {
    height =
      1 /
      ((mu / Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI)) * fwhm +
        ((1 - mu) * fwhm * Math.PI) / 2);
  }

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = fct(fwhm, mu, i - center) * height;
    data[length - 1 - i] = data[i];
  }

  return data;
}
