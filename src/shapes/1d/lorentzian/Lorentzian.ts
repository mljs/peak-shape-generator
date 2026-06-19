import { ROOT_THREE } from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  Parameter,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';

export interface LorentzianClassOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
}

export interface GetLorentzianAreaOptions {
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

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhm } = lorentzianDerivative(x, this.fwhm);
    return { fct, dx, parameters: [dFwhm] };
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

/**
 * Analytical value and partial derivatives of the lorentzian function centered at x=0.
 * @param x - position at which to evaluate.
 * @param fwhm - full width at half maximum.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`) and `fwhm` (`dFwhm`).
 */
export const lorentzianDerivative = (x: number, fwhm: number) => {
  const denominator = 4 * x * x + fwhm * fwhm;
  const fct = (fwhm * fwhm) / denominator;
  const dx = (-8 * x * fwhm * fwhm) / (denominator * denominator);
  const dFwhm = (8 * fwhm * x * x) / (denominator * denominator);
  return { fct, dx, dFwhm };
};

export const lorentzianWidthToFWHM = (width: number) => {
  return width * ROOT_THREE;
};

export const lorentzianFwhmToWidth = (fwhm: number) => {
  return fwhm / ROOT_THREE;
};

const lorentzianQuantile = (p: number) => Math.tan(Math.PI * (p - 0.5));

export const getLorentzianFactor = (area = 0.9999) => {
  if (area >= 1) {
    throw new Error('area should be (0 - 1)');
  }
  const halfResidual = (1 - area) * 0.5;
  return (
    (lorentzianQuantile(1 - halfResidual) - lorentzianQuantile(halfResidual)) /
    2
  );
};

export const getLorentzianData = (
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
    const value = lorentzianFct(i - center, fwhm) * height;
    data[i] = value;
    data[length - 1 - i] = value;
  }

  return data;
};
