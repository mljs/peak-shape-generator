export interface GetData1DOptions {
  /**
   * The maximum intensity value of the shape, by default the height is calculated
   * to get a normalized shape.
   */
  height?: number;
  /**
   * number of points of the shape.
   * @default 'fwhm * factor'
   */
  length?: number;
  /**
   * Number of times of fwhm to calculate length..
   * @default 'covers 99.99 % of volume'
   */
  factor?: number;
}
