import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  Parameter,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';
import type { LorentzianClassOptions } from '../lorentzian/Lorentzian.ts';
import {
  calculateLorentzianHeight,
  getLorentzianFactor,
  lorentzianFwhmToWidth,
  lorentzianWidthToFWHM,
} from '../lorentzian/Lorentzian.ts';

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

  public getArea() {
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

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhm } = lorentzianDispersiveDerivative(x, this.fwhm);
    return { fct, dx, parameters: [dFwhm] };
  }
}

export const lorentzianDispersiveFct = (x: number, fwhm: number) => {
  return (2 * fwhm * x) / (4 * x ** 2 + fwhm ** 2);
};

/**
 * Analytical value and partial derivatives of the dispersive lorentzian function centered at x=0.
 * @param x - position at which to evaluate.
 * @param fwhm - full width at half maximum.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`) and `fwhm` (`dFwhm`).
 */
export const lorentzianDispersiveDerivative = (x: number, fwhm: number) => {
  const denominator = 4 * x * x + fwhm * fwhm;
  const fct = (2 * fwhm * x) / denominator;
  const dx =
    (2 * fwhm * (fwhm * fwhm - 4 * x * x)) / (denominator * denominator);
  const dFwhm =
    (2 * x * (4 * x * x - fwhm * fwhm)) / (denominator * denominator);
  return { fct, dx, dFwhm };
};

export const getLorentzianDispersiveData = (
  shape: LorentzianClassOptions = {},
  options: GetData1DOptions = {},
) => {
  const { fwhm = 500 } = shape;
  const {
    factor = getLorentzianFactor(),
    height = calculateLorentzianHeight({ fwhm, area: 1 }),
  } = options;
  let { length } = options;

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), 2 ** 25 - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    const value = lorentzianDispersiveFct(i - center, fwhm) * height;
    data[i] = value;
    data[length - 1 - i] = -value;
  }

  return data;
};
