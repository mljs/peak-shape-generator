import type { DoubleArray } from 'cheminfo-types';

import type { GetData1DOptions } from './GetData1DOptions.ts';

export type Parameter = 'fwhm' | 'mu' | 'gamma' | 'fwhmG' | 'fwhmL';

export interface Shape1DDerivative {
  /** Value of `fct(x)`. */
  fct: number;
  /** Partial derivative of `fct` with respect to `x`, evaluated at `x`. */
  dx: number;
  /**
   * Partial derivatives of `fct` with respect to each shape parameter,
   * in the same order as `getParameters()`.
   */
  parameters: number[];
}

export interface Shape1DClass {
  fwhm: number;
  /**
   * Calculate the height depending of fwhm and area.
   */
  calculateHeight(area?: number): number;
  /**
   * Return a parameterized function of a gaussian shape (see README for equation).
   * @returns - the y value of gaussian with the current parameters.
   */
  fct(x: number): number;
  /**
   * Compute the value of Full Width at Half Maximum (FWHM) from the width between the inflection points.
   * for more information check the [mathworld page](https://mathworld.wolfram.com/GaussianFunction.html)
   * @returns fwhm
   */
  widthToFWHM(width: number): number;
  /**
   * Compute the value of width between the inflection points from Full Width at Half Maximum (FWHM).
   * for more information check the [mathworld page](https://mathworld.wolfram.com/GaussianFunction.html)
   * @param fwhm - Full Width at Half Maximum.
   * @returns width
   */
  fwhmToWidth(fwhm?: number): number;
  /**
   * Calculate the area of a specific shape.
   * @returns returns the area of the specific shape and parameters.
   */
  getArea(height?: number): number;
  /**
   * Calculate the number of times FWHM allows to reach a specific area coverage.
   * @param [area=0.9999] - Expected area to be covered.
   */
  getFactor(area?: number): number;
  /**
   * Calculate intensity array of a gaussian shape.
   * @returns Intensity values.
   */
  getData(options?: GetData1DOptions): DoubleArray;
  /**
   * Returns an array of the different parameters characterizing the shape
   */
  getParameters(): Parameter[];
  /**
   * Analytical partial derivatives of `fct` at `x`, with respect to `x` and to
   * each shape parameter (in the same order as `getParameters()`). Every shape
   * provides a closed-form Jacobian, so consumers (e.g. curve fitting) can use
   * it directly instead of numerical differentiation.
   * @param x - position at which to evaluate the derivatives.
   */
  derivative(x: number): Shape1DDerivative;
}
