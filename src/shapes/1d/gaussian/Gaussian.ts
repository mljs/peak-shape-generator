import type { DoubleArray } from 'cheminfo-types';

import type { GetData1DOptions } from '../../../types/GetData1DOptions';
import {
  ROOT_2LN2,
  GAUSSIAN_EXP_FACTOR,
  ROOT_PI_OVER_LN2,
} from '../../../util/constants';
import erfinv from '../../../util/erfinv';

interface ICalculateHeight {
  fwhm?: number;
  area?: number;
  sd?: number;
}

export interface IGaussianClassOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * The halft width between the inflection points or standard deviation.
   * If it is defined the fwhm would be re-assigned.
   */
  sd?: number;
}

export interface IGetAreaGaussianOptions {
  /**
   * The maximum intensity value of the shape.
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * The halft width between the inflection points or standard deviation.
   * If it is defined the fwhm would be re-assigned.
   */
  sd?: number;
}

export interface IGaussianClass {
  calculateHeight(area?: number): number;
  fct(x: number): number;
  widthToFWHM(width: number): number;
  fwhmToWidth(fwhm?: number): number;
  getArea(height?: number): number;
  getFactor(area?: number): number;
  getData(
    options?: GetData1DOptions,
  ): DoubleArray;
}

export class Gaussian implements IGaussianClass {
  /**
   * Full width at half maximum.
   * @default 500
   */
  public fwhm: number;

  public constructor(options: IGaussianClassOptions = {}) {
    const { fwhm = 500, sd } = options;

    this.fwhm = sd ? Gaussian.widthToFWHM(2 * sd) : fwhm;
  }

  public fwhmToWidth(fwhm = this.fwhm) {
    return Gaussian.fwhmToWidth(fwhm);
  }

  public widthToFWHM(width: number) {
    return Gaussian.widthToFWHM(width);
  }

  public fct(x: number) {
    return Gaussian.fct(x, this.fwhm);
  }

  public getArea(height = Gaussian.calculateHeight({ fwhm: this.fwhm })) {
    return Gaussian.getArea({ fwhm: this.fwhm, height });
  }

  public getFactor(area?: number) {
    return Gaussian.getFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return Gaussian.getData(this, options);
  }

  public calculateHeight(area = 1) {
    return Gaussian.calculateHeight({ fwhm: this.fwhm, area });
  }

  /**
   * Calculate the height depending of fwhm and area.
   */

  public static calculateHeight(options: ICalculateHeight) {
    let { fwhm = 1, area = 1, sd } = options;

    if (sd) fwhm = Gaussian.widthToFWHM(2 * sd);

    return (2 * area) / ROOT_PI_OVER_LN2 / fwhm;
  }
  /**
   * Return a parameterized function of a gaussian shape (see README for equation).
   * @returns - the y value of gaussian with the current parameters.
   */
  public static fct = (x: number, fwhm: number) => {
    return Math.exp(GAUSSIAN_EXP_FACTOR * Math.pow(x / fwhm, 2));
  };

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * for more information check the [mathworld page](https://mathworld.wolfram.com/GaussianFunction.html)
   * @returns fwhm
   */
  public static widthToFWHM = (width: number) => {
    return width * ROOT_2LN2;
  };

  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * for more information check the [mathworld page](https://mathworld.wolfram.com/GaussianFunction.html)
   * @param fwhm - Full Width at Half Maximum.
   * @returns width
   */
  public static fwhmToWidth = (fwhm: number) => {
    return fwhm / ROOT_2LN2;
  };

  /**
   * Calculate the area of a specific shape.
   * @returns returns the area of the specific shape and parameters.
   */
  public static getArea = (options: IGetAreaGaussianOptions) => {
    let { fwhm, sd, height = 1 } = options;

    if (sd) fwhm = Gaussian.widthToFWHM(2 * sd);

    if (fwhm === undefined) {
      throw new Error('should pass fwhm or sd parameters');
    }

    return (height * ROOT_PI_OVER_LN2 * fwhm) / 2;
  };

  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage.
   * @param [area=0.9999] Expected area to be covered.
   * @returns
   */
  public static getFactor = (area = 0.9999) => {
    return Math.sqrt(2) * erfinv(area);
  };

  /**
   * Calculate intensity array of a gaussian shape.
   * @returns {Float64Array} Intensity values.
   */

  public static getData = (
    shape: IGaussianClassOptions = {},
    options: GetData1DOptions = {},
  ) => {
    let { fwhm = 500, sd } = shape;
    if (sd) fwhm = Gaussian.widthToFWHM(2 * sd);

    let {
      length,
      factor = Gaussian.getFactor(),
      height = Gaussian.calculateHeight({ fwhm }),
    } = options;

    if (!length) {
      length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
      if (length % 2 === 0) length++;
    }

    const center = (length - 1) / 2;
    const data = new Float64Array(length);
    for (let i = 0; i <= center; i++) {
      data[i] = Gaussian.fct(i - center, fwhm) * height;
      data[length - 1 - i] = data[i];
    }

    return data;
  };
}
