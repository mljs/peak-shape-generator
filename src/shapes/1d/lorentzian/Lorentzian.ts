import { DoubleArray } from 'cheminfo-types';

import { GetData1DOptions } from '../../../types/GetData1DOptions';
import { ROOT_THREE } from '../../../util/constants';

export interface ILorentzianClassOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
}

export interface IGetAreaLorentzianOptions {
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
}

export interface ILorentzianClass {
  calculateHeight(area?: number): number;
  fct(x: number): number;
  widthToFWHM(width: number): number;
  fwhmToWidth(fwhm?: number): number;
  getArea(height?: number): number;
  getFactor(area?: number): number;
  getData(options?: GetData1DOptions): DoubleArray;
}

export class Lorentzian implements ILorentzianClass {
  /**
   * Full width at half maximum.
   * @default 500
   */
  public fwhm: number;

  public constructor(options: ILorentzianClassOptions = {}) {
    const { fwhm = 500 } = options;

    this.fwhm = fwhm;
  }

  public fwhmToWidth(fwhm = this.fwhm) {
    return Lorentzian.fwhmToWidth(fwhm);
  }

  public widthToFWHM(width: number) {
    return Lorentzian.widthToFWHM(width);
  }

  public fct(x: number) {
    return Lorentzian.fct(x, this.fwhm);
  }

  public getArea(height = 1) {
    return Lorentzian.getArea({ fwhm: this.fwhm, height });
  }

  public getFactor(area?: number) {
    return Lorentzian.getFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return Lorentzian.getData(this, options);
  }

  public calculateHeight(area = 1) {
    return Lorentzian.calculateHeight({ fwhm: this.fwhm, area });
  }

  /**
   * Calculate the height depending of fwhm and area.
   */

  public static calculateHeight = ({ fwhm = 1, area = 1 }) => {
    return (2 * area) / Math.PI / fwhm;
  };

  /**
   * Return a parameterized function of a lorentzian shape (see README for equation).
   * @param x - x value to calculate.
   * @param fwhm - full width half maximum
   * @returns - the y value of lorentzian with the current parameters.
   */
  public static fct = (x: number, fwhm: number) => {
    return Math.pow(fwhm, 2) / (4 * Math.pow(x, 2) + Math.pow(fwhm, 2));
  };

  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * for more information check the [mathworld page](https://mathworld.wolfram.com/LorentzianFunction.html)
   * @param width - Width between the inflection points
   * @returns fwhm
   */
  public static widthToFWHM = (width: number) => {
    return width * ROOT_THREE;
  };

  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * for more information check the [mathworld page](https://mathworld.wolfram.com/LorentzianFunction.html)
   * @param fwhm - Full Width at Half Maximum.
   * @returns width
   */
  public static fwhmToWidth = (fwhm: number) => {
    return fwhm / ROOT_THREE;
  };

  /**
   * Calculate the area of a specific shape.
   * @returns returns the area of the specific shape and parameters.
   */

  public static getArea = (options: IGetAreaLorentzianOptions) => {
    const { fwhm, height = 1 } = options;

    if (fwhm === undefined) {
      throw new Error('should pass fwhm or sd parameters');
    }

    return (height * Math.PI * fwhm) / 2;
  };

  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage.
   * @param [area=0.9999] Expected area to be covered.
   * @returns
   */
  public static getFactor = (area = 0.9999) => {
    return 2 * Math.tan(Math.PI * (area - 0.5));
  };

  /**
   * Calculate intensity array of a lorentzian shape.
   * @returns {Float64Array} y values
   */

  public static getData = (
    shape: ILorentzianClassOptions = {},
    options: GetData1DOptions = {},
  ) => {
    let { fwhm = 500 } = shape;
    let {
      length,
      factor = Lorentzian.getFactor(),
      height = Lorentzian.calculateHeight({ fwhm, area: 1 }),
    } = options;

    if (!length) {
      length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
      if (length % 2 === 0) length++;
    }

    const center = (length - 1) / 2;
    const data = new Float64Array(length);
    for (let i = 0; i <= center; i++) {
      data[i] = Lorentzian.fct(i - center, fwhm) * height;
      data[length - 1 - i] = data[i];
    }

    return data;
  };
}
