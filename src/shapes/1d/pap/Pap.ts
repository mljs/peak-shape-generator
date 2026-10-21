import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type { Shape1DClass, Shape1DDerivative } from '../Shape1DClass.ts';
import type { PapShape1D } from '../shape_1d.ts';

export interface PapClassOptions {
  /**
   * Standard deviation of the peak (D). Stored as `fwhm` for interface
   * compatibility.
   * @default 500
   */
  fwhm?: number;
  /**
   * Asymmetry factor of the peak, in the range (0, 2).
   * @default 1
   */
  a?: number;
}

interface CalculatePapHeightOptions {
  fwhm?: number;
  a?: number;
  area?: number;
}

interface GetPapAreaOptions {
  height?: number;
  fwhm?: number;
  a?: number;
}

/**
 * Lanczos approximation of the gamma function.
 * @param z - input value.
 * @returns gamma(z).
 */
function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6,
  ];
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 1; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
}

/**
 * Pap (logarithmically modified Gaussian) peak function.
 *
 * f(t) = 0 for t < M - D(4 - a^2)/(2a)
 * f(t) = H * exp( (4 - a^2)/a^2 * ( ln(1 + 2a(t-M)/(D(4-a^2))) - 2a(t-M)/(D(4-a^2)) ) )
 */
export class Pap implements Shape1DClass {
  readonly kind = 'pap' as const;
  /**
   * Standard deviation of the peak (D).
   * @default 500
   */
  fwhm: number;
  /**
   * Asymmetry factor, in the range (0, 2).
   * @default 1
   */
  a: number;

  constructor(options: PapClassOptions = {}) {
    const { fwhm = 500, a = 1 } = options;
    this.fwhm = fwhm;
    this.a = a;
  }

  private get alpha() {
    return (2 * this.a) / (4 - this.a * this.a);
  }

  private get k() {
    return (4 - this.a * this.a) / (this.a * this.a);
  }

  /**
   * Full width at half maximum is not available in closed form for this shape;
   * the standard deviation (stored as `fwhm`) is returned instead.
   * @param fwhm - standard deviation.
   * @returns the same value.
   */
  fwhmToWidth(fwhm = this.fwhm) {
    return fwhm;
  }

  /**
   * Identity conversion, since this shape is parameterized by its standard
   * deviation.
   * @param width - standard deviation.
   * @returns the same value.
   */
  widthToFWHM(width: number) {
    return width;
  }

  fct(x: number) {
    return papFct(x, this.fwhm, this.a);
  }

  getArea(
    height = calculatePapHeight({ fwhm: this.fwhm, a: this.a, area: 1 }),
  ) {
    // area for height 1
    const area1 = papArea({ fwhm: this.fwhm, a: this.a, height: 1 });
    return height * area1;
  }

  getFactor(area?: number) {
    return area ?? 0.9999;
  }

  getData(options: GetData1DOptions = {}) {
    return getPapData(this, options);
  }

  calculateHeight(area = 1) {
    const area1 = papArea({ fwhm: this.fwhm, a: this.a, height: 1 });
    return area / area1;
  }

  getParameters(): PapParameter[] {
    return ['fwhm', 'a'];
  }

  toJSON(): PapShape1D {
    return { kind: this.kind, fwhm: this.fwhm, a: this.a };
  }

  derivative(x: number): Shape1DDerivative {
    const f = this.fct(x);
    const D = this.fwhm;
    const a = this.a;
    const alpha = this.alpha;
    const k = this.k;
    const u = (alpha * x) / D;
    // dx
    const dudx = alpha / D;
    const dEdu = -k * (u / (1 + u));
    const dx = f * dEdu * dudx;
    // dD
    const dED = (k * u * u) / (D * (1 + u));
    const dFwhm = f * dED;
    // da via finite differences
    const eps = 1e-6;
    const fPlus = papFct(x, D, a + eps);
    const fMinus = papFct(x, D, a - eps);
    const da = (fPlus - fMinus) / (2 * eps);
    return { fct: f, dx, parameters: [dFwhm, da] };
  }
}

/**
 * Parameters characterizing a Pap shape.
 */
export type PapParameter = 'fwhm' | 'a';

/**
 * Evaluate the Pap peak function.
 * @param x - position.
 * @param fwhm - standard deviation (D).
 * @param a - asymmetry factor.
 * @returns intensity.
 */
export function papFct(x: number, fwhm: number, a: number) {
  const D = fwhm;
  const thr = (-D * (4 - a * a)) / (2 * a);
  if (x <= thr) return 0;
  const u = (2 * a * x) / (D * (4 - a * a));
  const k = (4 - a * a) / (a * a);
  return Math.exp(k * (Math.log(1 + u) - u));
}

/**
 * Calculate the area of a Pap peak.
 * @param options - height, fwhm and a.
 * @returns the area.
 */
function papArea(options: GetPapAreaOptions) {
  const { height = 1, fwhm = 500, a = 1 } = options;
  const D = fwhm;
  const alpha = (2 * a) / (4 - a * a);
  const k = (4 - a * a) / (a * a);
  // integral = height * D/alpha * exp(k) * Gamma(k+1) / k^(k+1)
  return (height * (D / alpha) * Math.exp(k) * gamma(k + 1)) / k ** (k + 1);
}

/**
 * Calculate the height for a given area.
 * @param options - fwhm, a and area.
 * @returns the height.
 */
export function calculatePapHeight(options: CalculatePapHeightOptions = {}) {
  const { fwhm = 500, a = 1, area = 1 } = options;
  const area1 = papArea({ fwhm, a, height: 1 });
  return area / area1;
}

/**
 * Generate an intensity array for a Pap peak.
 * @param shape - peak parameters.
 * @param options - sampling options.
 * @returns intensity values.
 */
export function getPapData(
  shape: PapClassOptions,
  options: GetData1DOptions = {},
) {
  const { fwhm = 500, a = 1 } = shape;
  const D = fwhm;
  const { factor = 5, height = calculatePapHeight({ fwhm, a, area: 1 }) } =
    options;
  let { length } = options;
  if (!length) {
    length = Math.min(Math.ceil(D * factor), 2 ** 25 - 1);
    if (length % 2 === 0) length++;
  }
  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i < length; i++) {
    data[i] = papFct(i - center, fwhm, a) * height;
  }
  return data;
}
