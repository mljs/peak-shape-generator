import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type { Parameter, Shape1DClass } from '../Shape1DClass.ts';
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
        0.11116 *
          lorentzianFraction *
          lorentzianFraction *
          lorentzianFraction);
    this._fwhmG = value;
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
        0.11116 *
          lorentzianFraction *
          lorentzianFraction *
          lorentzianFraction);
    this._fwhmL = value;
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
}

/**
 * Compute the effective FWHM from gaussian and lorentzian component widths
 * using the Thompson–Cox–Hastings approximation.
 * @param fwhmG - gaussian component FWHM.
 * @param fwhmL - lorentzian component FWHM.
 * @returns effective combined FWHM.
 */
function computeEffectiveWidth(fwhmG: number, fwhmL: number): number {
  const g2 = fwhmG * fwhmG;
  const g3 = g2 * fwhmG;
  const g4 = g3 * fwhmG;
  const g5 = g4 * fwhmG;
  const l2 = fwhmL * fwhmL;
  const l3 = l2 * fwhmL;
  const l4 = l3 * fwhmL;
  const l5 = l4 * fwhmL;
  return (
    g5 +
    2.69269 * g4 * fwhmL +
    2.42843 * g3 * l2 +
    4.47163 * g2 * l3 +
    0.07842 * fwhmG * l4 +
    l5
  ) ** 0.2;
}

/**
 * Solve for the lorentzian width fraction fwhmL/fwhm given lorentzianFraction = 1 - mu,
 * using Newton's method on: 1.36603·x - 0.47719·x² + 0.11116·x³ = lorentzianFraction.
 * @param lorentzianFraction - TCH lorentzian mixing parameter (= 1 - mu).
 * @returns the lorentzian width fraction fwhmL/fwhm.
 */
function lorentzianWidthFraction(lorentzianFraction: number): number {
  let x = lorentzianFraction;
  for (let i = 0; i < 6; i++) {
    const f =
      1.36603 * x - 0.47719 * x * x + 0.11116 * x * x * x - lorentzianFraction;
    const df = 1.36603 - 2 * 0.47719 * x + 3 * 0.11116 * x * x;
    x -= f / df;
  }
  return x;
}
