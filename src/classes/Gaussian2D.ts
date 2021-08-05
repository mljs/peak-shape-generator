import { GAUSSIAN_EXP_FACTOR } from '../util/constants';
import erfinv from '../util/erfinv';

import { widthToFWHM, fwhmToWidth } from './Gaussian';

export { widthToFWHM, fwhmToWidth } from './Gaussian';

export interface xyNumber {
  [index: string]: number;
  x: number;
  y: number;
}

export interface Gaussian2DOptions {
  /**
   * The maximum z value of the shape
   */
  height?: number;
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   * @default 50
   */
  fwhm?: number | xyNumber;
  /**
   * The halft width between the inflection points or standard deviation.
   * If it is defined the fwhm would be re-assigned.
   */
  sd?: number | xyNumber;
}

export interface GetDataOptions extends Gaussian2DOptions {
  /**
   * number of points along an specific axis.
   * Could specify the value for each axis by a xy object or the same value by a number
   * @default 'fwhm[axis] * factor[axis]'
   */
  length?: number | xyNumber;
  /**
   * Number of time to take fwhm to calculate length.
   * @default 'covers 99.99 % of volume'
   */
  factor?: number | xyNumber;
}

export interface GetVolumeOptions {
  /**
   * The maximum intensity value of the shape
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   */
  fwhm?: number | xyNumber;
}

export class Gaussian2D {
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   * @default 50
   */
  public fwhm: xyNumber;
  /**
   * The maximum z value of the shape, default keep surface equal 1.
   */
  public height: number;

  public constructor(options: Gaussian2DOptions = {}) {
    let { fwhm = 50, sd, height } = options;

    fwhm = checkObject(fwhm);
    if (sd) {
      let sdObject = checkObject(sd);
      ['x', 'y'].forEach(
        (axis) => (sdObject[axis] = widthToFWHM(2 * sdObject[axis])),
      );
      fwhm = { ...fwhm, ...sdObject };
    }

    this.fwhm = checkObject(fwhm);
    this.height =
      height === undefined
        ? -GAUSSIAN_EXP_FACTOR / Math.PI / fwhm.y / fwhm.x
        : height;
  }

  public fct(x: number, y: number) {
    return fct(x, y, this.fwhm.x, this.fwhm.y);
  }

  public getData(options: GetDataOptions = {}) {
    const { factor, length } = options;
    return getData({ fwhm: this.fwhm, height: this.height, factor, length });
  }

  public getFactor(surface: number) {
    return getFactor(surface);
  }

  public getSurface() {
    return getSurface({ fwhm: this.fwhm, height: this.height });
  }

  public widthToFWHM(width: number) {
    return widthToFWHM(width);
  }

  public fwhmToWidth(fwhm: number) {
    return fwhmToWidth(fwhm);
  }
}

/**
 * Return a parameterized function of a Gaussian2D shape (see README for equation).
 * @param x - x value to calculate.
 * @param y - y value to calculate.
 * @param fwhmX - full width half maximum in the x axis.
 * @param fwhmY - full width half maximum in the y axis.
 * @returns - the z value of bi-dimensional gaussian with the current parameters.
 */
export function fct(x: number, y: number, xFWHM: number, yFWHM: number) {
  return Math.exp(
    GAUSSIAN_EXP_FACTOR * (Math.pow(x / xFWHM, 2) + Math.pow(y / yFWHM, 2)),
  );
}

/**
 * Calculate the intensity matrix of a gaussian shape.
 * @returns z values.
 */

export function getData(options: GetDataOptions = {}) {
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
      data[i][j] = fct(i - xCenter, j - yCenter, fwhm.x, fwhm.y) * height;
    }
  }
  return data;
}

/**
 * Calculate the number of times FWHM allows to reach a specific surface coverage.
 * @param [surface=0.9999] Expected volume to be covered.
 * @returns
 */
export function getFactor(surface = 0.9999) {
  return Math.sqrt(2) * erfinv(surface);
}

/**
 * Calculate the surface of gaussian shape.
 * @returns The surface of the specific shape and parameters.
 */

export function getSurface(options: GetVolumeOptions = {}) {
  let { fwhm = 50, height = 1 } = options;

  if (typeof fwhm !== 'object') fwhm = { x: fwhm, y: fwhm };

  return (height * Math.PI * fwhm.y * fwhm.x) / Math.LN2 / 4;
}

function checkObject(input: number | xyNumber): xyNumber {
  let result = typeof input !== 'object' ? { x: input, y: input } : input;
  return result;
}
