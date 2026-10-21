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
 * Lanczos approximation of the logarithm of the gamma function, stable for
 * large arguments (the gamma value itself would overflow).
 * @param z - input value.
 * @returns ln(gamma(z)).
 */
function logGamma(z: number): number {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
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
  return Math.log(Math.sqrt(2 * Math.PI) * x) + (z + 0.5) * Math.log(t) - t;
}

/**
 * Regularized lower incomplete gamma function P(s, x) = g(s, x) / G(s),
 * computed with the series (x < s + 1) or the continued fraction
 * (x >= s + 1), both already normalized so no gamma value is formed.
 * @param s - shape parameter, s > 0.
 * @param x - integration bound, x >= 0.
 * @returns the area fraction below x of a gamma distribution with shape s.
 */
function lowerGammaRegularized(s: number, x: number): number {
  if (x <= 0) {
    return 0;
  }
  if (x < s + 1) {
    // series expansion
    let ap = s;
    let term = 1 / s;
    let sum = term;
    for (let i = 0; i < 10000; i++) {
      ap++;
      term *= x / ap;
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-16) {
        break;
      }
    }
    return sum * Math.exp(-x + s * Math.log(x) - logGamma(s));
  }
  // modified Lentz continued fraction
  let b = x + 1 - s;
  let c = Infinity;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 200; i++) {
    const an = -i * (i - s);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) {
      d = 1e-300;
    }
    c = b + an / c;
    if (Math.abs(c) < 1e-300) {
      c = 1e-300;
    }
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-15) {
      break;
    }
  }
  return 1 - Math.exp(-x + s * Math.log(x) - logGamma(s)) * h;
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
    if (a <= 0 || a >= 2) {
      throw new Error('a should be (0 - 2)');
    }
    if (fwhm <= 0) {
      throw new Error('fwhm should be > 0');
    }
    this.fwhm = fwhm;
    this.a = a;
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
    return getPapFactor(area, this.a);
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
    const { fct, dx, dD, da } = papDerivative(x, this.fwhm, this.a);
    return { fct, dx, parameters: [dD, da] };
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
 * Analytical value and partial derivatives of the Pap peak function at `x`.
 * @param x - position.
 * @param fwhm - standard deviation (D).
 * @param a - asymmetry factor.
 * @returns the value `fct` and its partial derivatives with respect to `x`
 * (`dx`), to the standard deviation (`dD`) and to the asymmetry factor (`da`).
 */
export function papDerivative(x: number, fwhm: number, a: number) {
  const fct = papFct(x, fwhm, a);
  if (fct === 0) {
    return { fct, dx: 0, dD: 0, da: 0 };
  }
  const D = fwhm;
  const u = (2 * a * x) / (D * (4 - a * a));
  const k = (4 - a * a) / (a * a);
  // dx
  const dx = fct * ((-k * u) / (1 + u)) * ((2 * a) / (D * (4 - a * a)));
  // dD
  const dD = (fct * k * u * u) / (D * (1 + u));
  // da
  const dKda = -8 / (a * a * a);
  const duda = ((2 * (4 + a * a)) / ((4 - a * a) * (4 - a * a))) * (x / D);
  const dEda = dKda * (Math.log(1 + u) - u) - ((k * u) / (1 + u)) * duda;
  const da = fct * dEda;
  return { fct, dx, dD, da };
}

/**
 * Calculate the area of a Pap peak, evaluated in log space so it stays
 * accurate (and finite) for every `a` in (0, 2).
 * @param options - height, fwhm and a.
 * @returns the area.
 */
function papArea(options: GetPapAreaOptions) {
  const { height = 1, fwhm = 500, a = 1 } = options;
  const D = fwhm;
  const alpha = (2 * a) / (4 - a * a);
  const k = (4 - a * a) / (a * a);
  // integral = height * D/alpha * exp(k) * Gamma(k+1) / k^(k+1), in log space
  const lnArea =
    Math.log(D / alpha) + k + logGamma(k + 1) - (k + 1) * Math.log(k);
  return height * Math.exp(lnArea);
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
 * Calculate the number of times the standard deviation (stored as `fwhm`)
 * must be sampled around the peak maximum to reach the requested coverage of
 * the total area. The window is symmetric around the maximum, so both sides
 * of the asymmetric peak are taken into account.
 * @param [area=0.9999] - Expected area to be covered.
 * @param a - asymmetry factor, in the range (0, 2). Default 1.
 * @returns the factor by which to multiply the standard deviation.
 */
export function getPapFactor(area = 0.9999, a = 1) {
  if (area >= 1) {
    throw new Error('area should be (0 - 1)');
  }
  const k = (4 - a * a) / (a * a);
  const scaled = a / (4 - a * a);
  // coverage of [x, +x] around the maximum: cumulative from the far tail
  const coverage = (factor: number) => {
    const high = lowerGammaRegularized(k + 1, k * (1 + factor * scaled));
    const low = 1 - factor * scaled;
    return low > 0 ? high - lowerGammaRegularized(k + 1, k * low) : high;
  };
  let lo = 0;
  let hi = 1;
  while (coverage(hi) < area && hi < 1e8) {
    lo = hi;
    hi *= 2;
  }
  for (let i = 0; i < 100 && hi - lo > 1e-9; i++) {
    const mid = (lo + hi) / 2;
    if (coverage(mid) < area) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
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
  const {
    factor = getPapFactor(0.9999, a),
    height = calculatePapHeight({ fwhm, a, area: 1 }),
  } = options;
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
