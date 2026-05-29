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
    const H = computeEffectiveWidth(value, this._fwhmL);
    const r = this._fwhmL / H;
    this._fwhm = H;
    this._mu = 1 - (1.36603 * r - 0.47719 * r * r + 0.11116 * r * r * r);
    this._fwhmG = value;
  }

  public get fwhmG(): number {
    return this._fwhmG;
  }

  public set fwhmL(value: number) {
    const H = computeEffectiveWidth(this._fwhmG, value);
    const r = value / H;
    this._fwhm = H;
    this._mu = 1 - (1.36603 * r - 0.47719 * r * r + 0.11116 * r * r * r);
    this._fwhmL = value;
  }

  public get fwhmL(): number {
    return this._fwhmL;
  }

  public set mu(value: number) {
    const r = lorentzianWidthFraction(1 - value);
    this._lorentzianWidthFraction = r;
    this._fwhmL = this._fwhm * r;
    this._fwhmG = this._fwhm * (1 - r);
    this._mu = value;
  }

  public get mu(): number {
    return this._mu;
  }

  public set fwhm(value: number) {
    const r =
      this._lorentzianWidthFraction || lorentzianWidthFraction(1 - this._mu);
    this._fwhmL = value * r;
    this._fwhmG = value * (1 - r);
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
 * Compute the effective FWHM H from gaussian (Hg) and lorentzian (Hl) widths
 * using the Thompson–Cox–Hastings approximation.
 * @param Hg - gaussian FWHM.
 * @param Hl - lorentzian FWHM.
 * @returns effective combined FWHM.
 */
function computeEffectiveWidth(Hg: number, Hl: number): number {
  const Hg2 = Hg * Hg;
  const Hg3 = Hg2 * Hg;
  const Hg4 = Hg3 * Hg;
  const Hg5 = Hg4 * Hg;
  const Hl2 = Hl * Hl;
  const Hl3 = Hl2 * Hl;
  const Hl4 = Hl3 * Hl;
  const Hl5 = Hl4 * Hl;
  return (
    (Hg5 +
      2.69269 * Hg4 * Hl +
      2.42843 * Hg3 * Hl2 +
      4.47163 * Hg2 * Hl3 +
      0.07842 * Hg * Hl4 +
      Hl5) **
    0.2
  );
}

/**
 * Solve for the lorentzian width fraction x = Hl/H given eta = 1 - mu,
 * using Newton–Raphson on: 1.36603·x - 0.47719·x² + 0.11116·x³ = eta.
 * @param eta - target value (= 1 - mu).
 * @returns the lorentzian width fraction Hl/H.
 */
function lorentzianWidthFraction(eta: number): number {
  let x = eta;
  for (let i = 0; i < 6; i++) {
    const f = 1.36603 * x - 0.47719 * x * x + 0.11116 * x * x * x - eta;
    const df = 1.36603 - 2 * 0.47719 * x + 3 * 0.11116 * x * x;
    x -= f / df;
  }
  return x;
}
