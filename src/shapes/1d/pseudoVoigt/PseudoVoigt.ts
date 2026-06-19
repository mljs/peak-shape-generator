import {
  GAUSSIAN_EXP_FACTOR,
  ROOT_2LN2_MINUS_ONE,
  ROOT_PI_OVER_LN2,
} from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  Parameter,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';
import { gaussianFct } from '../gaussian/Gaussian.ts';
import { lorentzianFct } from '../lorentzian/Lorentzian.ts';

import { pseudoVoigtFindFactor } from './computeFactor.ts';

export interface PseudoVoigtClassOptions {
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

interface GetPseudoVoigtAreaOptions {
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

interface CalculatePseudoVoightHeightOptions {
  /**
   * @default 1
   */
  fwhm?: number;
  /**
   * @default 0.5
   */
  mu?: number;
  /**
   * @default 1
   */
  area?: number;
}

export class PseudoVoigt implements Shape1DClass {
  public fwhm: number;
  /**
   * Ratio of gaussian contribution in the shape
   * @default 0.5
   */
  public mu: number;

  public constructor(options: PseudoVoigtClassOptions = {}) {
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
    return getPseudoVoigtFactor(area, this.mu);
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

  public getParameters(): Parameter[] {
    return ['fwhm', 'mu'];
  }

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhm, dMu } = pseudoVoigtDerivative(
      x,
      this.fwhm,
      this.mu,
    );
    return { fct, dx, parameters: [dFwhm, dMu] };
  }
}

export const calculatePseudoVoigtHeight = (
  options: CalculatePseudoVoightHeightOptions = {},
) => {
  const { fwhm = 1, mu = 0.5, area = 1 } = options;
  return (2 * area) / (fwhm * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI));
};

export const pseudoVoigtFct = (x: number, fwhm: number, mu: number) => {
  return (1 - mu) * lorentzianFct(x, fwhm) + mu * gaussianFct(x, fwhm);
};

/**
 * Analytical value and partial derivatives of the pseudo-Voigt function centered at x=0.
 * @param x - position at which to evaluate.
 * @param fwhm - full width at half maximum.
 * @param mu - ratio of gaussian contribution in the shape.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`), `fwhm` (`dFwhm`) and `mu` (`dMu`).
 */
export const pseudoVoigtDerivative = (x: number, fwhm: number, mu: number) => {
  // gaussian and lorentzian derivative math is inlined (rather than calling
  // gaussianDerivative / lorentzianDerivative) to allocate a single object on
  // this hot path; the sub-calls would allocate three.
  const e = Math.exp(GAUSSIAN_EXP_FACTOR * (x / fwhm) ** 2);
  const denominator = 4 * x * x + fwhm * fwhm;
  const lorentz = (fwhm * fwhm) / denominator;
  const dEdt = ((2 * GAUSSIAN_EXP_FACTOR * x) / (fwhm * fwhm)) * e;
  const dLdt = (-8 * x * fwhm * fwhm) / (denominator * denominator);
  const dEdfwhm =
    ((-2 * GAUSSIAN_EXP_FACTOR * x * x) / (fwhm * fwhm * fwhm)) * e;
  const dLdfwhm = (8 * fwhm * x * x) / (denominator * denominator);
  return {
    fct: (1 - mu) * lorentz + mu * e,
    dx: (1 - mu) * dLdt + mu * dEdt,
    dFwhm: (1 - mu) * dLdfwhm + mu * dEdfwhm,
    dMu: e - lorentz,
  };
};

export const pseudoVoigtWidthToFWHM = (width: number, mu = 0.5) => {
  return width * (mu * ROOT_2LN2_MINUS_ONE + 1);
};

export const pseudoVoigtFwhmToWidth = (fwhm: number, mu = 0.5) => {
  return fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1);
};

export const getPseudoVoigtArea = (options: GetPseudoVoigtAreaOptions) => {
  const { fwhm = 500, height = 1, mu = 0.5 } = options;
  return (fwhm * height * (mu * ROOT_PI_OVER_LN2 + (1 - mu) * Math.PI)) / 2;
};

export const getPseudoVoigtFactor = (area = 0.9999, mu = 0.5) => {
  return pseudoVoigtFindFactor(area, mu);
};

export const getPseudoVoigtData = (
  shape: PseudoVoigtClassOptions = {},
  options: GetData1DOptions = {},
) => {
  const { fwhm = 500, mu = 0.5 } = shape;
  const { factor = getPseudoVoigtFactor(0.999, mu) } = options;
  let { length, height = calculatePseudoVoigtHeight({ fwhm, mu, area: 1 }) } =
    options;

  if (!height) {
    height =
      1 /
      ((mu / Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI)) * fwhm +
        ((1 - mu) * fwhm * Math.PI) / 2);
  }

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), 2 ** 25 - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    const value = pseudoVoigtFct(i - center, fwhm, mu) * height;
    data[i] = value;
    data[length - 1 - i] = value;
  }

  return data;
};
