import { ROOT_THREE } from '../../../util/constants';
import type { GetData1DOptions } from '../GetData1DOptions';
import type { Parameter, Shape1DClass } from '../Shape1DClass';

export interface LorentzianClassOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
}

interface GetLorentzianAreaOptions {
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

export class Lorentzian implements Shape1DClass {
  /**
   * Full width at half maximum.
   * @default 500
   */
  public fwhm: number;

  public constructor(options: LorentzianClassOptions = {}) {
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

  public getParameters(): Parameter[] {
    return ['fwhm'];
  }
}

export const calculateLorentzianHeight = ({ fwhm = 1, area = 1 }) => {
  return (2 * area) / Math.PI / fwhm;
};

export const getLorentzianArea = (options: GetLorentzianAreaOptions) => {
  const { fwhm = 500, height = 1 } = options;
  return (height * Math.PI * fwhm) / 2;
};

export const lorentzianFct = (x: number, fwhm: number) => {
  return fwhm ** 2 / (4 * x ** 2 + fwhm ** 2);
};

export const lorentzianWidthToFWHM = (width: number) => {
  return width * ROOT_THREE;
};

export const lorentzianFwhmToWidth = (fwhm: number) => {
  return fwhm / ROOT_THREE;
};

export const getLorentzianFactor = (area = 0.9999) => {
  if (area >= 1) {
    throw new Error('area should be (0 - 1)');
  }
  const halfResidual = (1 - area) * 0.5;
  const quantileFunction = (p: number) => Math.tan(Math.PI * (p - 0.5));
  return (
    (quantileFunction(1 - halfResidual) - quantileFunction(halfResidual)) / 2
  );
};

export const getLorentzianData = (
  shape: LorentzianClassOptions = {},
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
