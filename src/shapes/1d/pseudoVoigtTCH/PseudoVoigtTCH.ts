import { GAUSSIAN_EXP_FACTOR } from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  Parameter,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';
import {
  calculatePseudoVoigtHeight,
  getPseudoVoigtArea,
  getPseudoVoigtData,
  getPseudoVoigtFactor,
  pseudoVoigtFct,
  pseudoVoigtFwhmToWidth,
  pseudoVoigtWidthToFWHM,
} from '../pseudoVoigt/PseudoVoigt.ts';

export interface PseudoVoigtTCHClassOptions {
  /**
   * Full width at half maximum of the gaussian component.
   * @default 500
   */
  fwhmG?: number;
  /**
   * Full width at half maximum of the lorentzian component.
   * @default 500
   */
  fwhmL?: number;
  /**
   * Effective full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * Ratio of gaussian contribution in the shape.
   * @default 0.5
   */
  mu?: number;
}

/**
 * TCH-style pseudo-Voigt where gaussian and lorentzian widths are independent.
 * The effective fwhm and mixing parameter mu are derived from fwhmG and fwhmL
 * via the Thompson–Cox–Hastings approximation.
 */
export class PseudoVoigtTCH implements Shape1DClass {
  private _fwhmG: number;
  private _fwhmL: number;
  private _fwhm: number;
  private _mu: number;
  private _lorentzianWidthFraction: number;

  public constructor(options: PseudoVoigtTCHClassOptions = {}) {
    const { fwhmG, fwhmL, fwhm, mu = 0.5 } = options;

    this._mu = mu;
    this._fwhm = 0;
    this._fwhmG = 0;
    this._fwhmL = 0;
    this._lorentzianWidthFraction = lorentzianWidthFraction(1 - mu);

    if (fwhmG && fwhmL) {
      this._fwhmG = fwhmG;
      this.fwhmL = fwhmL;
    } else if (fwhm) {
      this.fwhm = fwhm;
    }
  }

  public set fwhmG(value: number) {
    const effectiveFwhm = computeEffectiveWidth(value, this._fwhmL);
    const lorentzianFraction = this._fwhmL / effectiveFwhm;
    this._fwhm = effectiveFwhm;
    this._mu =
      1 -
      (1.36603 * lorentzianFraction -
        0.47719 * lorentzianFraction * lorentzianFraction +
        0.11116 * lorentzianFraction * lorentzianFraction * lorentzianFraction);
    this._fwhmG = value;
    this._lorentzianWidthFraction = lorentzianFraction;
  }

  public get fwhmG(): number {
    return this._fwhmG;
  }

  public set fwhmL(value: number) {
    const effectiveFwhm = computeEffectiveWidth(this._fwhmG, value);
    const lorentzianFraction = value / effectiveFwhm;
    this._fwhm = effectiveFwhm;
    this._mu =
      1 -
      (1.36603 * lorentzianFraction -
        0.47719 * lorentzianFraction * lorentzianFraction +
        0.11116 * lorentzianFraction * lorentzianFraction * lorentzianFraction);
    this._fwhmL = value;
    this._lorentzianWidthFraction = lorentzianFraction;
  }

  public get fwhmL(): number {
    return this._fwhmL;
  }

  public set mu(value: number) {
    const lorentzianFraction = lorentzianWidthFraction(1 - value);
    this._lorentzianWidthFraction = lorentzianFraction;
    this._fwhmL = this._fwhm * lorentzianFraction;
    this._fwhmG = this._fwhm * (1 - lorentzianFraction);
    this._mu = value;
  }

  public get mu(): number {
    return this._mu;
  }

  public set fwhm(value: number) {
    const lorentzianFraction =
      this._lorentzianWidthFraction || lorentzianWidthFraction(1 - this._mu);
    this._fwhmL = value * lorentzianFraction;
    this._fwhmG = value * (1 - lorentzianFraction);
    this._fwhm = value;
  }

  public get fwhm(): number {
    return this._fwhm;
  }

  public fwhmToWidth(fwhm = this._fwhm, mu = this._mu): number {
    return pseudoVoigtFwhmToWidth(fwhm, mu);
  }

  public widthToFWHM(width: number, mu: number = this._mu): number {
    return pseudoVoigtWidthToFWHM(width, mu);
  }

  public fct(x: number): number {
    return pseudoVoigtFct(x, this._fwhm, this._mu);
  }

  public getArea(height = 1): number {
    return getPseudoVoigtArea({ fwhm: this._fwhm, height, mu: this._mu });
  }

  public getFactor(area?: number): number {
    return getPseudoVoigtFactor(area, this._mu);
  }

  public getData(options: GetData1DOptions = {}) {
    const {
      length,
      factor,
      height = calculatePseudoVoigtHeight({
        fwhm: this._fwhm,
        mu: this._mu,
        area: 1,
      }),
    } = options;
    return getPseudoVoigtData(this, { factor, length, height });
  }

  public calculateHeight(area = 1): number {
    return calculatePseudoVoigtHeight({
      fwhm: this._fwhm,
      mu: this._mu,
      area,
    });
  }

  public getParameters(): Parameter[] {
    return ['fwhmG', 'fwhmL'];
  }

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhmG, dFwhmL } = pseudoVoigtTCHDerivative(
      x,
      this._fwhmG,
      this._fwhmL,
    );
    return { fct, dx, parameters: [dFwhmG, dFwhmL] };
  }
}

/**
 * Analytical value and partial derivatives of the TCH pseudo-Voigt function centered at x=0.
 * The effective fwhm `F` and mixing `mu` are functions of `fwhmG` and `fwhmL`, so the
 * derivatives chain `∂fct/∂F` and `∂fct/∂mu` through `∂F/∂·` and `∂mu/∂·`.
 * @param x - position at which to evaluate.
 * @param fwhmG - full width at half maximum of the gaussian component.
 * @param fwhmL - full width at half maximum of the lorentzian component.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`), `fwhmG` (`dFwhmG`) and `fwhmL` (`dFwhmL`).
 */
export const pseudoVoigtTCHDerivative = (
  x: number,
  fwhmG: number,
  fwhmL: number,
) => {
  const effectiveFwhm = computeEffectiveWidth(fwhmG, fwhmL);
  const w = effectiveFwhm ** 5; // the polynomial under the 1/5 power

  // ∂w/∂fwhmG and ∂w/∂fwhmL (derivatives of the TCH width polynomial).
  const dwDfwhmG =
    5 * fwhmG ** 4 +
    10.77076 * fwhmG ** 3 * fwhmL +
    7.28529 * fwhmG ** 2 * fwhmL ** 2 +
    8.94326 * fwhmG * fwhmL ** 3 +
    0.07842 * fwhmL ** 4;
  const dwDfwhmL =
    2.69269 * fwhmG ** 4 +
    4.85686 * fwhmG ** 3 * fwhmL +
    13.41489 * fwhmG ** 2 * fwhmL ** 2 +
    0.31368 * fwhmG * fwhmL ** 3 +
    5 * fwhmL ** 4;

  // F = w^0.2  =>  ∂F/∂· = 0.2 * F / w * ∂w/∂·
  const dFwhmDfwhmG = (0.2 * effectiveFwhm * dwDfwhmG) / w;
  const dFwhmDfwhmL = (0.2 * effectiveFwhm * dwDfwhmL) / w;

  // lorentzian width fraction L = fwhmL / F
  const lorentzianFraction = fwhmL / effectiveFwhm;
  const dLorentzianFractionDfwhmG =
    (-fwhmL / (effectiveFwhm * effectiveFwhm)) * dFwhmDfwhmG;
  const dLorentzianFractionDfwhmL =
    1 / effectiveFwhm - (fwhmL / (effectiveFwhm * effectiveFwhm)) * dFwhmDfwhmL;

  // mu = 1 - (1.36603 L - 0.47719 L^2 + 0.11116 L^3)
  const dPolyDfraction =
    1.36603 -
    0.95438 * lorentzianFraction +
    0.33348 * lorentzianFraction * lorentzianFraction;
  const dMuDfwhmG = -dPolyDfraction * dLorentzianFractionDfwhmG;
  const dMuDfwhmL = -dPolyDfraction * dLorentzianFractionDfwhmL;

  const mu =
    1 -
    (1.36603 * lorentzianFraction -
      0.47719 * lorentzianFraction * lorentzianFraction +
      0.11116 * lorentzianFraction * lorentzianFraction * lorentzianFraction);

  // pseudoVoigt value and its ∂/∂x, ∂/∂F (dFwhm), ∂/∂mu (dMu) at the effective
  // fwhm, inlined to allocate a single object on this hot path.
  const e = Math.exp(GAUSSIAN_EXP_FACTOR * (x / effectiveFwhm) ** 2);
  const denominator2 = 4 * x * x + effectiveFwhm * effectiveFwhm;
  const lorentz = (effectiveFwhm * effectiveFwhm) / denominator2;
  const dEdt =
    ((2 * GAUSSIAN_EXP_FACTOR * x) / (effectiveFwhm * effectiveFwhm)) * e;
  const dLdt =
    (-8 * x * effectiveFwhm * effectiveFwhm) / (denominator2 * denominator2);
  const dEdfwhm =
    ((-2 * GAUSSIAN_EXP_FACTOR * x * x) /
      (effectiveFwhm * effectiveFwhm * effectiveFwhm)) *
    e;
  const dLdfwhm = (8 * effectiveFwhm * x * x) / (denominator2 * denominator2);
  const dFwhm = (1 - mu) * dLdfwhm + mu * dEdfwhm;
  const dMu = e - lorentz;
  return {
    fct: (1 - mu) * lorentz + mu * e,
    dx: (1 - mu) * dLdt + mu * dEdt,
    dFwhmG: dFwhm * dFwhmDfwhmG + dMu * dMuDfwhmG,
    dFwhmL: dFwhm * dFwhmDfwhmL + dMu * dMuDfwhmL,
  };
};

/**
 * Compute the effective FWHM from gaussian and lorentzian component widths
 * using the Thompson–Cox–Hastings approximation.
 * @param fwhmG - gaussian component FWHM.
 * @param fwhmL - lorentzian component FWHM.
 * @returns effective combined FWHM.
 */
function computeEffectiveWidth(fwhmG: number, fwhmL: number): number {
  return (
    (fwhmG ** 5 +
      2.69269 * fwhmG ** 4 * fwhmL +
      2.42843 * fwhmG ** 3 * fwhmL ** 2 +
      4.47163 * fwhmG ** 2 * fwhmL ** 3 +
      0.07842 * fwhmG * fwhmL ** 4 +
      fwhmL ** 5) **
    0.2
  );
}

/**
 * Solve for the lorentzian width fraction fwhmL/fwhm given lorentzianFraction = 1 - mu,
 * using Newton's method on: 1.36603·x - 0.47719·x² + 0.11116·x³ = lorentzianFraction.
 * @param lorentzianFraction - TCH lorentzian mixing parameter (= 1 - mu).
 * @returns the lorentzian width fraction fwhmL/fwhm.
 */
function lorentzianWidthFraction(lorentzianFraction: number): number {
  let fraction = lorentzianFraction;
  for (let i = 0; i < 6; i++) {
    const f =
      1.36603 * fraction -
      0.47719 * fraction * fraction +
      0.11116 * fraction * fraction * fraction -
      lorentzianFraction;
    const df =
      1.36603 - 2 * 0.47719 * fraction + 3 * 0.11116 * fraction * fraction;
    fraction -= f / df;
  }
  return fraction;
}
