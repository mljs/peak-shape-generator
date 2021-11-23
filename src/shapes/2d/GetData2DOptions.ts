import type { XYNumber } from './XYNumber';

export interface GetData2DOptions {
  /**
   * The maximum z value of the shape, default keep surface equal 1.
   */
  height?: number;
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
