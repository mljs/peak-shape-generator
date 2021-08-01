import { check } from 'prettier';
import { GAUSSIAN_EXP_FACTOR } from '../util/constants';
import erfinv from '../util/erfinv';
import { widthToFWHM } from './gaussian';

export interface xyNumber {
  [index: string]: number;
  x: number;
  y: number;
}

interface GetDataOpt {
  length?: number | xyNumber;
  factor?: number | xyNumber;
  height?: number;
  fwhm?: number | xyNumber;
  sd?: number | xyNumber;
}

interface GetVolumeOpt {
  height?: number;
  fwhm?: number | xyNumber;
}

/**
 * Return a parameterized function of a Gaussian2D shape (see README for equation).
 * @param x - x value to calculate.
 * @param y - y value to calculate.
 * @param fwhmX - full width half maximum in the x axis.
 * @param fwhmY - full width half maximum in the y axis.
 * @returns - the z value of bi-dimensional gaussian with the current parameters.
 */
export function fct(
  xFWHM: number = 500,
  yFWHM: number = 500,
  x: number,
  y: number,
) {
  return Math.exp(
    GAUSSIAN_EXP_FACTOR * (Math.pow(x / xFWHM, 2) + Math.pow(y / yFWHM, 2)),
  );
}

/**
 * Calculate a Gaussian2D shape
 * @param [options = {}]
 * @param [options.factor] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param [options.x] - parameter for x axis.
 * @param [options.x.length=fwhm*factor+1] - length on x axis.
 * @param [options.x.factor=factor] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @param [options.y] - parameter for y axis.
 * @param [options.y.length=fwhm*factor+1] - length on y axis.
 * @param [options.y.factor=factor] - Number of time to take fwhm to calculate length. Default covers 99.99 % of area.
 * @return z values.
 */

export function getData(options: GetDataOpt = {}) {
  let { fwhm = 50, factor = getFactor(), height } = options;

  let sd: any = options.sd ? options.sd : null;
  let length: any = options.length ? options.length : {};

  fwhm = checkObject(fwhm);
  factor = checkObject(factor);

  if (sd) sd = checkObject(sd);
  if (length) length = checkObject(length);

  if (!height) {
    height = -GAUSSIAN_EXP_FACTOR / Math.PI / fwhm.y / fwhm.x;
  }

  for (const axis of ['x', 'y']) {
    if (sd) fwhm[axis] = widthToFWHM(2 * sd[axis]);
    if (!length[axis]) {
      length[axis] = Math.min(
        Math.ceil(fwhm[axis] * factor[axis]),
        Math.pow(2, 25) - 1,
      );
      if (length[axis] % 2 === 0) length[axis]++;
    }
  }

  const xCenter = (length.x - 1) / 2;
  const yCenter = (length.y - 1) / 2;
  const data = new Array(length.x);
  for (let i = 0; i < length.x; i++) {
    data[i] = new Array(length.y);
  }
  for (let i = 0; i < length.x; i++) {
    for (let j = 0; j < length.y; j++) {
      data[i][j] = fct(fwhm.x, fwhm.y, i - xCenter, j - yCenter) * height;
    }
  }
  return data;
}

function checkObject(input: number | xyNumber) {
  let result = typeof input !== 'object' ? { x: input, y: input } : input;
  return result;
}

/**@TODO look for a better factor
 * Calculate the number of times FWHM allows to reach a specific volume coverage.
 * @param {number} [volume=0.9999]
 * @returns {number}
 */
export function getFactor(volume = 0.9999) {
  return Math.sqrt(2) * erfinv(volume);
}

/**
 * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
 * //https://mathworld.wolfram.com/Gaussian2DFunction.html
 * @param {number} width - Width between the inflection points
 * @returns {number} fwhm
 */
export { widthToFWHM } from './gaussian';

/**
 * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
 * //https://mathworld.wolfram.com/Gaussian2DFunction.html
 * @param {number} fwhm - Full Width at Half Maximum.
 * @returns {number} width
 */
export { fwhmToWidth } from './gaussian';

/**
 * Calculate the volume of a specific shape.
 * @param {number} xFWHM - Full width at half maximum for x axis.
 * @param {number} yFWHM - Full width at half maximum for y axis.
 * @param {object} [options = {}] - options.
 * @param {number} [options.height = 1] - Maximum z value of the shape.
 * @returns {number} - returns the area of the specific shape and parameters.
 */

export function getVolume(options: GetVolumeOpt = {}) {
  let { fwhm = 50, height = 1 } = options;

  if (typeof fwhm !== 'object') fwhm = { x: fwhm, y: fwhm };

  return (height * Math.PI * fwhm.y * fwhm.x) / Math.LN2 / 4;
}
