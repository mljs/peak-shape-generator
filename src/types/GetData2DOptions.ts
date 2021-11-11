import type { XYNumber } from './XYNumber';

export interface GetData2DOptions {
  /**
   * number of points along an specific axis.
   * Could specify the value for each axis by a xy object or the same value by a number
   * @default 'fwhm[axis] * factor[axis]'
   */
  length?: number | XYNumber;
  /**
   * Number of time to take fwhm to calculate length.
   * @default 'covers 99.99 % of volume'
   */
  factor?: number | XYNumber;
}
