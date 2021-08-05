import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../util/constants';

import { fct as gaussian } from './gaussian';
import { fct as lorentzian } from './lorentzian';

export interface curryOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * Ratio of gaussian contribution in the shape
   * @default 0.5
   */
  mu?: number;
}

export interface GetDataOptions {
  /**
   * number of points of the shape.
   * @default 'fwhm * factor'
   */
  length?: number;
  /**
   * Number of times of fwhm to calculate length..
   * @default 'covers 99.99 % of volume'
   */
  factor?: number;
  /**
   * The maximum value of the shape
   */
  height?: number;
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * Ratio of gaussian contribution in the shape
   * @default 0.5
   */
  mu?: number;
}

export interface GetAreaOptions {
  /**
   * The maximum intensity value of the shape
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * Ratio of gaussian contribution in the shape
   * @default 0.5
   */
  mu?: number;
}

/**
 * Return a parameterized function of a pseudo voigt shape (see README for equation).
 * @param x - x value to calculate.
 * @param fwhm - full width half maximum
 * @returns - the y value of pseudo voigt with the current parameters.
 */
export function fct(fwhm: number, mu: number, x: number) {
  return (1 - mu) * lorentzian(fwhm, x) + mu * gaussian(fwhm, x);
}

/**
 * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
 * @param width - Width between the inflection points
 * @param [mu=0.5] Ratio of gaussian contribution in the shape
 * @returns fwhm
 */
export function widthToFWHM(width: number, mu = 0.5) {
  return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
}

/**
 * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
 * @param fwhm - Full Width at Half Maximum.
 * @param [mu=0.5] Ratio of gaussian contribution in the shape
 * @returns width
 */
export function fwhmToWidth(fwhm: number, mu = 0.5) {
  return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
}

/**
 * Calculate the area of a specific shape.
 * @returns returns the area of the specific shape and parameters.
 */

export function getArea(options: GetAreaOptions) {
  let { fwhm, height = 1, mu = 0.5 } = options;

  if (fwhm === undefined) {
    throw new Error('should pass fwhm or sd parameters');
  }

  return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
}

/**
 * Calculate the number of times FWHM allows to reach a specific area coverage.
 * @param [area=0.9999] Expected area to be covered.
 * @returns
 */
export function getFactor(area = 0.9999) {
  return 2 * Math.tan(Math.PI * (area - 0.5));
}

/**
 * Calculate intensity array of a pseudo voigt shape.
 * @return {Float64Array} y values
 */

export function getData(options: GetDataOptions = {}) {
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

/**
 * export the pseudo voigt function that expect just the x value;
 */

export function curry(options: curryOptions = {}) {
  let { fwhm = 500, mu = 0.5 } = options;
  return fct.bind({}, fwhm, mu);
}
