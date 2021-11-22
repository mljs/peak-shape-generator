import { DoubleArray } from 'cheminfo-types';

import { GetData1DOptions } from '../../../types/GetData1DOptions';
import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../../../util/constants';
import { Gaussian } from '../gaussian/Gaussian';
import { Lorentzian } from '../lorentzian/Lorentzian';

export interface IPseudoVoigtClassOptions {
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

export interface IGetAreaPseudoVoigtOptions {
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

interface ICalculateHeightOptions {
  fwhm: number;
  mu: number;
  area: number;
}

export interface IPseudoVoigtClass {
  calculateHeight(area?: number): number;
  fct(x: number): number;
  widthToFWHM(width: number, mu?: number): number;
  fwhmToWidth(fwhm?: number, mu?: number): number;
  getArea(height?: number): number;
  getFactor(area?: number): number;
  getData(options?: GetData1DOptions): DoubleArray;
}

export class PseudoVoigt implements IPseudoVoigtClass {
  /**
   * Full width at half maximum.
   * @default 500
   */
  public fwhm: number;
  /**
   * Ratio of gaussian contribution in the shape
   * @default 0.5
   */
  public mu: number;

  public constructor(options: IPseudoVoigtClassOptions = {}) {
    const { fwhm = 500, mu = 0.5 } = options;

    this.mu = mu;
    this.fwhm = fwhm;
  }

  public fwhmToWidth(fwhm = this.fwhm, mu = this.mu) {
    return PseudoVoigt.fwhmToWidth(fwhm, mu);
  }

  public widthToFWHM(width: number, mu: number = this.mu) {
    return PseudoVoigt.widthToFWHM(width, mu);
  }

  public fct(x: number) {
    return PseudoVoigt.fct(x, this.fwhm, this.mu);
  }

  public getArea(height = 1) {
    return PseudoVoigt.getArea({ fwhm: this.fwhm, height, mu: this.mu });
  }

  public getFactor(area?: number) {
    return PseudoVoigt.getFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    const {
      length,
      factor,
      height = PseudoVoigt.calculateHeight({
        fwhm: this.fwhm,
        mu: this.mu,
        area: 1,
      }),
    } = options;
    return PseudoVoigt.getData(this, { factor, length, height });
  }

  public calculateHeight(area = 1) {
    return PseudoVoigt.calculateHeight({ fwhm: this.fwhm, mu: this.mu, area });
  }

  /**
   * Calculate the height depending of fwhm, mu and area.
   */
  public static calculateHeight = (options: ICalculateHeightOptions) => {
    let { fwhm = 1, mu = 0.5, area = 1 } = options;
    return (2 * area) / (fwhm * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI));
  };

  /**
   * Return a parameterized function of a pseudo voigt shape (see README for equation).
   * @param x - x value to calculate.
   * @param fwhm - full width half maximum
   * @returns - the y value of pseudo voigt with the current parameters.
   */
  public static fct = (x: number, fwhm: number, mu: number) => {
    return (1 - mu) * Lorentzian.fct(x, fwhm) + mu * Gaussian.fct(x, fwhm);
  };

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * @param width - Width between the inflection points
   * @param [mu=0.5] Ratio of gaussian contribution in the shape
   * @returns fwhm
   */
  public static widthToFWHM = (width: number, mu = 0.5) => {
    return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
  };

  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * @param fwhm - Full Width at Half Maximum.
   * @param [mu=0.5] Ratio of gaussian contribution in the shape
   * @returns width
   */
  public static fwhmToWidth = (fwhm: number, mu = 0.5) => {
    return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
  };

  /**
   * Calculate the area of a specific shape.
   * @returns returns the area of the specific shape and parameters.
   */

  public static getArea = (options: IGetAreaPseudoVoigtOptions) => {
    const { fwhm, height = 1, mu = 0.5 } = options;
    if (fwhm === undefined) {
      throw new Error('should pass fwhm or sd parameters');
    }

    return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
  };

  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage.
   * @param [area=0.9999] Expected area to be covered.
   * @returns
   */
  public static getFactor = (area = 0.9999, mu = 0.5) => {
    return mu < 1 ? Lorentzian.getFactor(area) : Gaussian.getFactor(area);
  };

  /**
   * Calculate intensity array of a pseudo voigt shape.
   * @returns {Float64Array} y values
   */

  public static getData = (
    shape: IPseudoVoigtClassOptions = {},
    options: GetData1DOptions = {},
  ) => {
    let { fwhm = 500, mu = 0.5 } = shape;
    let {
      length,
      factor = PseudoVoigt.getFactor(),
      height = PseudoVoigt.calculateHeight({ fwhm, mu, area: 1 }),
    } = options;

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
      data[i] = PseudoVoigt.fct(i - center, fwhm, mu) * height;
      data[length - 1 - i] = data[i];
    }

    return data;
  };
}
