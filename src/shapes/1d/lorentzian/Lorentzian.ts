import { ROOT_THREE } from '../../../util/constants';
import type { GetData1DOptions } from '../GetData1DOptions';
import type { IShape1DClass } from '../IShape1DClass';

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

export class Lorentzian implements IShape1DClass {
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
    return lorentzianFwhmToWidth(fwhm);
  }

  public widthToFWHM(width: number) {
    return lorentzianWidthToFWHM(width);
  }

  public fct(x: number) {
    return lorentzianFct(x, this.fwhm);
  }

  public getArea(height = 1) {
    return getLorentzianArea({ fwhm: this.fwhm, height });
  }

  public getFactor(area?: number) {
    return getLorentzianFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return getLorentzianData(this, options);
  }

  public calculateHeight(area = 1) {
    return calculateLorentzianHeight({ fwhm: this.fwhm, area });
  }
}

export const calculateLorentzianHeight = ({ fwhm = 1, area = 1 }) => {
  return (2 * area) / Math.PI / fwhm;
};

export const lorentzianFct = (x: number, fwhm: number) => {
  return Math.pow(fwhm, 2) / (4 * Math.pow(x, 2) + Math.pow(fwhm, 2));
};

export const lorentzianWidthToFWHM = (width: number) => {
  return width * ROOT_THREE;
};

export const lorentzianFwhmToWidth = (fwhm: number) => {
  return fwhm / ROOT_THREE;
};

export const getLorentzianArea = (options: IGetAreaLorentzianOptions) => {
  const { fwhm, height = 1 } = options;

  if (fwhm === undefined) {
    throw new Error('should pass fwhm or sd parameters');
  }

  return (height * Math.PI * fwhm) / 2;
};

export const getLorentzianFactor = (area = 0.9999) => {
  return 2 * Math.tan(Math.PI * (area - 0.5));
};

export const getLorentzianData = (
  shape: ILorentzianClassOptions = {},
  options: GetData1DOptions = {},
) => {
  let { fwhm = 500 } = shape;
  let {
    length,
    factor = getLorentzianFactor(),
    height = calculateLorentzianHeight({ fwhm, area: 1 }),
  } = options;

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), Math.pow(2, 25) - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    data[i] = lorentzianFct(i - center, fwhm) * height;
    data[length - 1 - i] = data[i];
  }

  return data;
};
