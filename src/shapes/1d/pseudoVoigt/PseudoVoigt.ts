import { DoubleArray } from 'cheminfo-types';

import { GetData1DOptions } from '../../../types/GetData1DOptions';
import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../../../util/constants';
import { gaussianFct, getGaussianFactor } from '../gaussian/Gaussian';
import { lorentzianFct, getLorentzianFactor } from '../lorentzian/Lorentzian';

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
  /**
   * Calculate the height depending of fwhm, mu and area.
   */
  calculateHeight(area?: number): number;
  /**
   * Return a parameterized function of a pseudo voigt shape (see README for equation).
   * @param x - x value to calculate.
   * @param fwhm - full width half maximum
   * @returns - the y value of pseudo voigt with the current parameters.
   */
  fct(x: number): number;
  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * @param width - Width between the inflection points
   * @param [mu=0.5] Ratio of gaussian contribution in the shape
   * @returns fwhm
   */
  widthToFWHM(width: number, mu?: number): number;
  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * @param fwhm - Full Width at Half Maximum.
   * @param [mu=0.5] Ratio of gaussian contribution in the shape
   * @returns width
   */
  fwhmToWidth(fwhm?: number, mu?: number): number;
  /**
   * Calculate the area of a specific shape.
   * @returns returns the area of the specific shape and parameters.
   */
  getArea(height?: number): number;
  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage.
   * @param [area=0.9999] Expected area to be covered.
   * @returns
   */
  getFactor(area?: number): number;
  /**
   * Calculate intensity array of a pseudo voigt shape.
   * @returns y values
   */
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
    return pseudoVoigtFwhmToWidth(fwhm, mu);
  }

  public widthToFWHM(width: number, mu: number = this.mu) {
    return pseudoVoigtWidthToFWHM(width, mu);
  }

  public fct(x: number) {
    return pseudoVoigtFct(x, this.fwhm, this.mu);
  }

  public getArea(height = 1) {
    return getPseudoVoigtArea({ fwhm: this.fwhm, height, mu: this.mu });
  }

  public getFactor(area?: number) {
    return getPseudoVoigtFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    const {
      length,
      factor,
      height = calculatePseudoVoigtHeight({
        fwhm: this.fwhm,
        mu: this.mu,
        area: 1,
      }),
    } = options;
    return getPseudoVoigtData(this, { factor, length, height });
  }

  public calculateHeight(area = 1) {
    return calculatePseudoVoigtHeight({ fwhm: this.fwhm, mu: this.mu, area });
  }
}

export const calculatePseudoVoigtHeight = (options: ICalculateHeightOptions) => {
  let { fwhm = 1, mu = 0.5, area = 1 } = options;
  return (2 * area) / (fwhm * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI));
};

export const pseudoVoigtFct = (x: number, fwhm: number, mu: number) => {
  return (1 - mu) * lorentzianFct(x, fwhm) + mu * gaussianFct(x, fwhm);
};

export const pseudoVoigtWidthToFWHM = (width: number, mu = 0.5) => {
  return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
};

export const pseudoVoigtFwhmToWidth = (fwhm: number, mu = 0.5) => {
  return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
};

export const getPseudoVoigtArea = (options: IGetAreaPseudoVoigtOptions) => {
  const { fwhm, height = 1, mu = 0.5 } = options;
  if (fwhm === undefined) {
    throw new Error('should pass fwhm or sd parameters');
  }

  return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
};

export const getPseudoVoigtFactor = (area = 0.9999, mu = 0.5) => {
  return mu < 1 ? getLorentzianFactor(area) : getGaussianFactor(area);
};

export const getPseudoVoigtData = (
  shape: IPseudoVoigtClassOptions = {},
  options: GetData1DOptions = {},
) => {
  let { fwhm = 500, mu = 0.5 } = shape;
  let {
    length,
    factor = getPseudoVoigtFactor(0.999, mu),
    height = calculatePseudoVoigtHeight({ fwhm, mu, area: 1 }),
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
    data[i] = pseudoVoigtFct(i - center, fwhm, mu) * height;
    data[length - 1 - i] = data[i];
  }

  return data;
};
