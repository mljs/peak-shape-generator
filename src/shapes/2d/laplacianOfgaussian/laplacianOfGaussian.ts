// import { GAUSSIAN_EXP_FACTOR } from '../../../util/constants';
// import erfinv from '../../../util/erfinv';
// import { widthToFWHM, fwhmToWidth } from '../../1d/gaussian/Gaussian';
// import { Shape2DClass } from '../Shape2DClass';

// import type { XYNumber } from '../../../types/XYNumber';

// export { widthToFWHM, fwhmToWidth } from '../../1d/gaussian/Gaussian';

// export interface Gaussian2DClassOptions {
//   /**
//    * Full width at half maximum.
//    * Could specify the value for each axis by a xy object or both by a number.
//    */
//   fwhm?: number | XYNumber;
//   /**
//    * Full width at half maximum.
//    * Could specify the value for each axis by a xy object or both by a number.
//    * @default 1.4
//    */
//   sd?: number | XYNumber;
// }

// export interface GetData1DOptions extends Gaussian2DClassOptions {
//   /**
//    * number of points along an specific axis.
//    * Could specify the value for each axis by a xy object or the same value by a number
//    * @default '9'
//    */
//   length?: number | XYNumber;
// }

// export class Gaussian2D extends Shape2DClass {
//   /**
//    * Full width at half maximum.
//    * Could specify the value for each axis by a xy object or both by a number.
//    * @default 50
//    */
//   public fwhmX: number;
//   public fwhmY: number;
//   /**
//    * The maximum z value of the shape, default keep surface equal 1.
//    */
//   public height: number;

//   public constructor(options: Gaussian2DClassOptions = {}) {
//     super();
//     let { fwhm, sd = 1.4 } = options;

//     fwhm = ensureFWHM2D(fwhm, sd);

//     this.fwhmX = fwhm.x;
//     this.fwhmY = fwhm.y;

//     this.height =
//       height === undefined
//         ? -GAUSSIAN_EXP_FACTOR / Math.PI / this.fwhmY / this.fwhmX
//         : height;
//   }

//   public fct(x: number, y: number) {
//     return fct(x, y, this.fwhmX, this.fwhmY);
//   }

//   public getData(options: GetData1DOptions = {}) {
//     const { factor, length } = options;
//     return getData({
//       fwhm: { x: this.fwhmY, y: this.fwhmY },
//       height: this.height,
//       factor,
//       length,
//     });
//   }

//   public getFactor(surface: number) {
//     return getFactor(surface);
//   }

//   public getSurface() {
//     return getSurface({
//       fwhm: { x: this.fwhmY, y: this.fwhmY },
//       height: this.height,
//     });
//   }

//   public widthToFWHM(width: number) {
//     return widthToFWHM(width);
//   }

//   public fwhmToWidth(fwhm: number) {
//     return fwhmToWidth(fwhm);
//   }

//   public set fwhm(fwhm: number | XYNumber) {
//     fwhm = ensureXYNumber(fwhm);
//     this.fwhmX = fwhm.x;
//     this.fwhmY = fwhm.y;
//   }
// }

// /**
//  * Return a parameterized function of a Gaussian2D shape (see README for equation).
//  * @param x - x value to calculate.
//  * @param y - y value to calculate.
//  * @param fwhmX - full width half maximum in the x axis.
//  * @param fwhmY - full width half maximum in the y axis.
//  * @returns - the z value of bi-dimensional gaussian with the current parameters.
//  */
// export function fct(x: number, y: number, xFWHM: number, yFWHM: number) {
//   return Math.exp(
//     GAUSSIAN_EXP_FACTOR * (Math.pow(x / xFWHM, 2) + Math.pow(y / yFWHM, 2)),
//   );
// }

// /**
//  * Calculate the intensity matrix of a gaussian shape.
//  * @returns z values.
//  */

// export function getData(options: GetData1DOptions = {}) {
//   let { sigma = 1.4, length = { x: 0, y: 0 } } = options;

//   length = ensureXYNumber(length);

//   for (const axis of ['x', 'y'] as const) {
//     if (!length[axis]) {
//       length[axis] = Math.min(
//         Math.ceil(fwhm[axis] * factor[axis]),
//         Math.pow(2, 25) - 1,
//       );
//       if (length[axis] % 2 === 0) length[axis]++;
//     }
//   }

//   const xCenter = (length.x - 1) / 2;
//   const yCenter = (length.y - 1) / 2;
//   const data = new Array(length.x);
//   for (let i = 0; i < length.x; i++) {
//     data[i] = new Float64Array(length.y);
//   }
//   for (let i = 0; i < length.x; i++) {
//     for (let j = 0; j < length.y; j++) {
//       data[i][j] = fct(i - xCenter, j - yCenter, fwhm.x, fwhm.y) * height;
//     }
//   }
//   return data;
// }

// /**
//  * Calculate the number of times FWHM allows to reach a specific surface coverage.
//  * @param [surface=0.9999] Expected volume to be covered.
//  * @returns
//  */
// export function getFactor() {
//   return Math.sqrt(2) * erfinv(surface);
// }

// /**
//  * Calculate the surface of gaussian shape.
//  * @returns The surface of the specific shape and parameters.
//  */

// export function getSurface() {
//   throw new Error('function not implemented');
// }
