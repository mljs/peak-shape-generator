import type { GetData1DOptions } from '../GetData1DOptions';
import type { Parameter, Shape1DClass } from '../Shape1DClass';
import {
  calculateLorentzianHeight,
  getLorentzianFactor,
  LorentzianClassOptions,
  lorentzianFwhmToWidth,
  lorentzianWidthToFWHM,
} from '../lorentzian/Lorentzian';

export class LorentzianDispersive implements Shape1DClass {
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
    return lorentzianDispersiveFct(x, this.fwhm);
  }

  //eslint-disable-next-line
  public getArea(_height: number) {
    return 0;
  }

  public getFactor(area?: number) {
    return getLorentzianFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return getLorentzianDispersiveData(this, options);
  }

  public calculateHeight(area = 1) {
    return calculateLorentzianHeight({ fwhm: this.fwhm, area });
  }

  public getParameters(): Parameter[] {
    return ['fwhm'];
  }
}

export const lorentzianDispersiveFct = (x: number, fwhm: number) => {
  return (2 * fwhm * x) / (4 * x ** 2 + fwhm ** 2);
};

export const getLorentzianDispersiveData = (
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
    data[i] = lorentzianDispersiveFct(i - center, fwhm) * height;
    data[length - 1 - i] = -data[i];
  }

  return data;
};
