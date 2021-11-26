import { DoubleArray } from 'cheminfo-types';

import { GetData2DOptions } from './GetData2DOptions';
import { XYNumber } from './XYNumber';

export interface Shape2DClass {
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   * @default 50
   */
  fwhmX: number;
  fwhmY: number;
  /**
   * setter to parameters fwhmX and fwhmY
   */
  fwhm: number | XYNumber;
  /**
   * Calculate the height depending of fwhm and volumen.
   */
  calculateHeight(volume?: number): number;
  /**
   * Return a parameterized function of a Gaussian2D shape (see README for equation).
   * @param x - x value to calculate.
   * @param y - y value to calculate.
   * @param fwhmX - full width half maximum in the x axis.
   * @param fwhmY - full width half maximum in the y axis.
   * @returns - the z value of bi-dimensional gaussian with the current parameters.
   */
  fct(x: number, y: number): number;
  widthToFWHM(width: number): number;
  fwhmToWidth(fwhm?: number): number;
  getVolume(height?: number): number;
  getFactor(volume?: number): number;
  /**
   * Calculate the intensity matrix of a gaussian shape.
   * @returns z values.
   */
  getData(options?: GetData2DOptions): DoubleArray[];
}
