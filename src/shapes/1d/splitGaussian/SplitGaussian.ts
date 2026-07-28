import { ROOT_PI_OVER_LN2 } from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type { Shape1DClass, Shape1DDerivative } from '../Shape1DClass.ts';
import {
  gaussianDerivative,
  gaussianFct,
  gaussianFwhmToWidth,
  gaussianWidthToFWHM,
  getGaussianFactor,
} from '../gaussian/Gaussian.ts';

export interface SplitGaussianClassOptions {
  /**
   * Full width at half maximum of the lower-x half (x <= 0).
   * @default 500
   */
  fwhmLow?: number;
  /**
   * Full width at half maximum of the higher-x half (x > 0).
   * @default 500
   */
  fwhmHigh?: number;
}

interface CalculateSplitGaussianHeightOptions {
  /**
   * Full width at half maximum of the lower-x half.
   * @default 500
   */
  fwhmLow?: number;
  /**
   * Full width at half maximum of the higher-x half.
   * @default 500
   */
  fwhmHigh?: number;
  /**
   * @default 1
   */
  area?: number;
}

interface GetSplitGaussianAreaOptions {
  /**
   * The maximum intensity value of the shape.
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum of the lower-x half.
   * @default 500
   */
  fwhmLow?: number;
  /**
   * Full width at half maximum of the higher-x half.
   * @default 500
   */
  fwhmHigh?: number;
}

export class SplitGaussian implements Shape1DClass {
  /**
   * Full width at half maximum of the lower-x half (x <= 0).
   * @default 500
   */
  public fwhmLow: number;
  /**
   * Full width at half maximum of the higher-x half (x > 0).
   * @default 500
   */
  public fwhmHigh: number;

  public constructor(options: SplitGaussianClassOptions = {}) {
    const { fwhmLow = 500, fwhmHigh = 500 } = options;

    this.fwhmLow = fwhmLow;
    this.fwhmHigh = fwhmHigh;
  }

  /**
   * Full width at half maximum of the peak. The half-maximum crossings are at
   * `-fwhmLow / 2` and `fwhmHigh / 2`, so the width between them is the mean of
   * both halves.
   * @returns the full width at half maximum.
   */
  public get fwhm() {
    return (this.fwhmLow + this.fwhmHigh) / 2;
  }

  /**
   * Set the full width at half maximum. Both halves are scaled by the same
   * ratio, so their mean becomes `value` while the asymmetry between them is
   * preserved. A peak with no width has no ratio to preserve, so both halves
   * take `value` and the peak stays symmetric.
   * @param value - the new full width at half maximum.
   */
  public set fwhm(value: number) {
    const { fwhm } = this;

    if (fwhm === 0) {
      this.fwhmLow = value;
      this.fwhmHigh = value;
      return;
    }

    const ratio = value / fwhm;
    this.fwhmLow *= ratio;
    this.fwhmHigh *= ratio;
  }

  /**
   * Convert a full width at half maximum to the width between the inflection
   * points. For this peak's own fwhm the result is exactly `σlow + σhigh`.
   * @param fwhm - full width at half maximum. Defaults to the peak's fwhm.
   * @returns the width between the inflection points.
   */
  public fwhmToWidth(fwhm = this.fwhm) {
    return gaussianFwhmToWidth(fwhm);
  }

  /**
   * Convert a width between the inflection points back to a full width at half
   * maximum. A single width does not encode the asymmetry, so it cannot recover
   * `fwhmLow` and `fwhmHigh` individually.
   * @param width - width between the inflection points.
   * @returns the corresponding full width at half maximum.
   */
  public widthToFWHM(width: number) {
    return gaussianWidthToFWHM(width);
  }

  public fct(x: number) {
    return splitGaussianFct(x, this.fwhmLow, this.fwhmHigh);
  }

  public getArea(
    height = calculateSplitGaussianHeight({
      fwhmLow: this.fwhmLow,
      fwhmHigh: this.fwhmHigh,
    }),
  ) {
    return getSplitGaussianArea({
      fwhmLow: this.fwhmLow,
      fwhmHigh: this.fwhmHigh,
      height,
    });
  }

  public getFactor(area?: number) {
    return getGaussianFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return getSplitGaussianData(this, options);
  }

  public calculateHeight(area = 1) {
    return calculateSplitGaussianHeight({
      fwhmLow: this.fwhmLow,
      fwhmHigh: this.fwhmHigh,
      area,
    });
  }

  public getParameters(): SplitGaussianParameter[] {
    return ['fwhmLow', 'fwhmHigh'];
  }

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhmLow, dFwhmHigh } = splitGaussianDerivative(
      x,
      this.fwhmLow,
      this.fwhmHigh,
    );
    return { fct, dx, parameters: [dFwhmLow, dFwhmHigh] };
  }
}

/** Parameters characterizing a split gaussian shape. */
export type SplitGaussianParameter = 'fwhmLow' | 'fwhmHigh';

/**
 * Calculate the peak height for a given area and both half-widths.
 * @param options - fwhmLow, fwhmHigh and area.
 * @returns the peak height.
 */
export function calculateSplitGaussianHeight(
  options: CalculateSplitGaussianHeightOptions,
) {
  const { fwhmLow = 500, fwhmHigh = 500, area = 1 } = options;
  return (4 * area) / ROOT_PI_OVER_LN2 / (fwhmLow + fwhmHigh);
}

/**
 * Evaluate the split (asymmetric) gaussian function centered at x=0.
 * The lower-x half (x <= 0) uses `fwhmLow`, the higher-x half (x > 0) uses `fwhmHigh`.
 * @param x - position at which to evaluate.
 * @param fwhmLow - full width at half maximum of the lower-x half.
 * @param fwhmHigh - full width at half maximum of the higher-x half.
 * @returns the intensity at x.
 */
export function splitGaussianFct(x: number, fwhmLow: number, fwhmHigh: number) {
  return x <= 0 ? gaussianFct(x, fwhmLow) : gaussianFct(x, fwhmHigh);
}

/**
 * Analytical value and partial derivatives of the split gaussian function centered at x=0.
 * Each half's fwhm only affects its own side, so the off-side derivative is 0.
 * @param x - position at which to evaluate.
 * @param fwhmLow - full width at half maximum of the lower-x half.
 * @param fwhmHigh - full width at half maximum of the higher-x half.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`), `fwhmLow` (`dFwhmLow`) and `fwhmHigh` (`dFwhmHigh`).
 */
export function splitGaussianDerivative(
  x: number,
  fwhmLow: number,
  fwhmHigh: number,
) {
  if (x <= 0) {
    const { fct, dx, dFwhm } = gaussianDerivative(x, fwhmLow);
    return { fct, dx, dFwhmLow: dFwhm, dFwhmHigh: 0 };
  }
  const { fct, dx, dFwhm } = gaussianDerivative(x, fwhmHigh);
  return { fct, dx, dFwhmLow: 0, dFwhmHigh: dFwhm };
}

/**
 * Calculate the area under a split gaussian peak.
 * @param options - fwhmLow, fwhmHigh and height.
 * @returns the area.
 */
export function getSplitGaussianArea(options: GetSplitGaussianAreaOptions) {
  const { fwhmLow = 500, fwhmHigh = 500, height = 1 } = options;
  return (height * ROOT_PI_OVER_LN2 * (fwhmLow + fwhmHigh)) / 4;
}

/**
 * Generate an intensity array for a split gaussian shape.
 * @param shape - split gaussian shape parameters (fwhmLow, fwhmHigh).
 * @param options - sampling options (length, factor, height).
 * @returns Float64Array of intensity values.
 */
export function getSplitGaussianData(
  shape: SplitGaussianClassOptions = {},
  options: GetData1DOptions = {},
) {
  const { fwhmLow = 500, fwhmHigh = 500 } = shape;

  const {
    factor = getGaussianFactor(),
    height = calculateSplitGaussianHeight({ fwhmLow, fwhmHigh }),
  } = options;
  let { length } = options;

  if (!length) {
    length = Math.min(
      Math.ceil(Math.max(fwhmLow, fwhmHigh) * factor),
      2 ** 25 - 1,
    );
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i < length; i++) {
    data[i] = splitGaussianFct(i - center, fwhmLow, fwhmHigh) * height;
  }

  return data;
}
