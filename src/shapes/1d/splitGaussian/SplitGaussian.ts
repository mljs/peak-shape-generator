import { ROOT_PI_OVER_LN2 } from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  ParameterTuple,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';
import {
  gaussianDerivative,
  gaussianFct,
  gaussianFwhmToWidth,
  gaussianWidthToFWHM,
  getGaussianFactor,
} from '../gaussian/Gaussian.ts';

export interface SplitGaussianClassOptions {
  /**
   * Full width at half maximum of the left half (x <= 0).
   * @default 500
   */
  fwhmLeft?: number;
  /**
   * Full width at half maximum of the right half (x > 0).
   * @default 500
   */
  fwhmRight?: number;
}

interface CalculateSplitGaussianHeightOptions {
  /**
   * Full width at half maximum of the left half.
   * @default 500
   */
  fwhmLeft?: number;
  /**
   * Full width at half maximum of the right half.
   * @default 500
   */
  fwhmRight?: number;
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
   * Full width at half maximum of the left half.
   * @default 500
   */
  fwhmLeft?: number;
  /**
   * Full width at half maximum of the right half.
   * @default 500
   */
  fwhmRight?: number;
}

export class SplitGaussian implements Shape1DClass {
  /**
   * Full width at half maximum of the left half (x <= 0).
   * @default 500
   */
  public fwhmLeft: number;
  /**
   * Full width at half maximum of the right half (x > 0).
   * @default 500
   */
  public fwhmRight: number;

  public constructor(options: SplitGaussianClassOptions = {}) {
    const { fwhmLeft = 500, fwhmRight = 500 } = options;

    this.fwhmLeft = fwhmLeft;
    this.fwhmRight = fwhmRight;
  }

  /**
   * Full width at half maximum of the whole peak, the mean of both halves.
   * A symmetric peak has no split; use a `Gaussian` for that case.
   * @returns the mean full width at half maximum.
   */
  public get fwhm() {
    return (this.fwhmLeft + this.fwhmRight) / 2;
  }

  /**
   * Convert a full width at half maximum to the width between the inflection
   * points, using the plain gaussian relation on the mean fwhm by default.
   *
   * Because that relation is linear, the value returned for the mean fwhm equals
   * the true total span between the split shape's two (asymmetric) inflection
   * points, `σleft + σright`. It is therefore an **aggregate**: it does not
   * capture the asymmetry — `fwhmLeft: 200, fwhmRight: 600` and
   * `fwhmLeft: fwhmRight: 400` yield the same width. Use `fwhmLeft` / `fwhmRight`
   * directly when each half-width matters.
   * @param fwhm - full width at half maximum. Defaults to the mean of both halves.
   * @returns the aggregate width between the inflection points.
   */
  public fwhmToWidth(fwhm = this.fwhm) {
    return gaussianFwhmToWidth(fwhm);
  }

  /**
   * Convert a width between the inflection points back to a full width at half
   * maximum, using the plain gaussian relation.
   *
   * This is the inverse of `fwhmToWidth` only for the **aggregate** (mean) fwhm;
   * it cannot recover the individual `fwhmLeft` / `fwhmRight`, since a single
   * width does not encode the asymmetry.
   * @param width - width between the inflection points.
   * @returns the corresponding (aggregate) full width at half maximum.
   */
  public widthToFWHM(width: number) {
    return gaussianWidthToFWHM(width);
  }

  public fct(x: number) {
    return splitGaussianFct(x, this.fwhmLeft, this.fwhmRight);
  }

  public getArea(
    height = calculateSplitGaussianHeight({
      fwhmLeft: this.fwhmLeft,
      fwhmRight: this.fwhmRight,
    }),
  ) {
    return getSplitGaussianArea({
      fwhmLeft: this.fwhmLeft,
      fwhmRight: this.fwhmRight,
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
      fwhmLeft: this.fwhmLeft,
      fwhmRight: this.fwhmRight,
      area,
    });
  }

  public getParameters(): ParameterTuple<['fwhmLeft', 'fwhmRight']> {
    return ['fwhmLeft', 'fwhmRight'];
  }

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhmLeft, dFwhmRight } = splitGaussianDerivative(
      x,
      this.fwhmLeft,
      this.fwhmRight,
    );
    return { fct, dx, parameters: [dFwhmLeft, dFwhmRight] };
  }
}

/**
 * Calculate the peak height for a given area and both half-widths.
 * @param options - fwhmLeft, fwhmRight and area.
 * @returns the peak height.
 */
export function calculateSplitGaussianHeight(
  options: CalculateSplitGaussianHeightOptions,
) {
  const { fwhmLeft = 500, fwhmRight = 500, area = 1 } = options;
  return (4 * area) / ROOT_PI_OVER_LN2 / (fwhmLeft + fwhmRight);
}

/**
 * Evaluate the split (asymmetric) gaussian function centered at x=0.
 * The left half (x <= 0) uses `fwhmLeft`, the right half (x > 0) uses `fwhmRight`.
 * @param x - position at which to evaluate.
 * @param fwhmLeft - full width at half maximum of the left half.
 * @param fwhmRight - full width at half maximum of the right half.
 * @returns the intensity at x.
 */
export function splitGaussianFct(
  x: number,
  fwhmLeft: number,
  fwhmRight: number,
) {
  return x <= 0 ? gaussianFct(x, fwhmLeft) : gaussianFct(x, fwhmRight);
}

/**
 * Analytical value and partial derivatives of the split gaussian function centered at x=0.
 * Each half's fwhm only affects its own side, so the off-side derivative is 0.
 * @param x - position at which to evaluate.
 * @param fwhmLeft - full width at half maximum of the left half.
 * @param fwhmRight - full width at half maximum of the right half.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`), `fwhmLeft` (`dFwhmLeft`) and `fwhmRight` (`dFwhmRight`).
 */
export function splitGaussianDerivative(
  x: number,
  fwhmLeft: number,
  fwhmRight: number,
) {
  if (x <= 0) {
    const { fct, dx, dFwhm } = gaussianDerivative(x, fwhmLeft);
    return { fct, dx, dFwhmLeft: dFwhm, dFwhmRight: 0 };
  }
  const { fct, dx, dFwhm } = gaussianDerivative(x, fwhmRight);
  return { fct, dx, dFwhmLeft: 0, dFwhmRight: dFwhm };
}

/**
 * Calculate the area under a split gaussian peak.
 * @param options - fwhmLeft, fwhmRight and height.
 * @returns the area.
 */
export function getSplitGaussianArea(options: GetSplitGaussianAreaOptions) {
  const { fwhmLeft = 500, fwhmRight = 500, height = 1 } = options;
  return (height * ROOT_PI_OVER_LN2 * (fwhmLeft + fwhmRight)) / 4;
}

/**
 * Generate an intensity array for a split gaussian shape.
 * @param shape - split gaussian shape parameters (fwhm, fwhmLeft, fwhmRight).
 * @param options - sampling options (length, factor, height).
 * @returns Float64Array of intensity values.
 */
export function getSplitGaussianData(
  shape: SplitGaussianClassOptions = {},
  options: GetData1DOptions = {},
) {
  const { fwhmLeft = 500, fwhmRight = 500 } = shape;

  const {
    factor = getGaussianFactor(),
    height = calculateSplitGaussianHeight({ fwhmLeft, fwhmRight }),
  } = options;
  let { length } = options;

  if (!length) {
    length = Math.min(
      Math.ceil(Math.max(fwhmLeft, fwhmRight) * factor),
      2 ** 25 - 1,
    );
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i < length; i++) {
    data[i] = splitGaussianFct(i - center, fwhmLeft, fwhmRight) * height;
  }

  return data;
}
