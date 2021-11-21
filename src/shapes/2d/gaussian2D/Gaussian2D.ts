import type { GetData2DOptions } from '../../../types/GetData2DOptions';
import { GAUSSIAN_EXP_FACTOR } from '../../../util/constants';
import { Gaussian } from '../../1d/gaussian/Gaussian';
import { Shape2DClass } from '../Shape2DClass';

export interface XYNumber {
  x: number;
  y: number;
}

interface ICalculateHeightGaussian2D {
  fwhm?: number | XYNumber;
  surface?: number;
}

export interface IGaussian2DClassOptions {
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   * @default 50
   */
  fwhm?: number | XYNumber;
  /**
   * The halft width between the inflection points or standard deviation.
   * If it is defined the fwhm would be re-assigned.
   */
  sd?: number | XYNumber;
}

/**
 * Calculate the surface of gaussian shape.
 * @returns The surface of the specific shape and parameters.
 */
export interface IGetVolumeGaussian2DOptions {
  /**
   * The maximum intensity value of the shape
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   */
  fwhm?: number | XYNumber;
}

export class Gaussian2D extends Shape2DClass {
  /**
   * Full width at half maximum.
   * Could specify the value for each axis by a xy object or both by a number.
   * @default 50
   */
  public fwhmX: number;
  public fwhmY: number;
  // /**
  //  * The maximum z value of the shape, default keep surface equal 1.
  //  */
  // public height: number;

  public constructor(options: IGaussian2DClassOptions = {}) {
    super();
    let { fwhm = 50, sd } = options;

    fwhm = ensureFWHM2D(fwhm, sd);

    this.fwhmX = fwhm.x;
    this.fwhmY = fwhm.y;
  }

  public fct(x: number, y: number) {
    return Gaussian2D.fct(x, y, this.fwhmX, this.fwhmY);
  }

  public getData(options: GetData2DOptions = {}) {
    return Gaussian2D.getData(
      {
        fwhm: { x: this.fwhmX, y: this.fwhmY },
      },
      options,
    );
  }

  public getFactor(surface: number) {
    return Gaussian.getFactor(surface);
  }

  public getSurface(
    height = Gaussian2D.calculateHeight({
      fwhm: { x: this.fwhmY, y: this.fwhmY },
      surface: 1,
    }),
  ) {
    return Gaussian2D.getSurface({
      fwhm: { x: this.fwhmY, y: this.fwhmY },
      height,
    });
  }

  public widthToFWHM(width: number) {
    return Gaussian.widthToFWHM(width);
  }

  public fwhmToWidth(fwhm: number) {
    return Gaussian.fwhmToWidth(fwhm);
  }

  public static getFactor(surface: number) {
    return Gaussian.getFactor(surface);
  }

  public static widthToFWHM(width: number) {
    return Gaussian.widthToFWHM(width);
  }

  public static fwhmToWidth(fwhm: number) {
    return Gaussian.fwhmToWidth(fwhm);
  }

  public set fwhm(fwhm: number | XYNumber) {
    fwhm = ensureXYNumber(fwhm);
    this.fwhmX = fwhm.x;
    this.fwhmY = fwhm.y;
  }

  /**
   * Return a parameterized function of a Gaussian2D shape (see README for equation).
   * @param x - x value to calculate.
   * @param y - y value to calculate.
   * @param fwhmX - full width half maximum in the x axis.
   * @param fwhmY - full width half maximum in the y axis.
   * @returns - the z value of bi-dimensional gaussian with the current parameters.
   */
  public static fct = (x: number, y: number, xFWHM: number, yFWHM: number) => {
    return Math.exp(
      GAUSSIAN_EXP_FACTOR * (Math.pow(x / xFWHM, 2) + Math.pow(y / yFWHM, 2)),
    );
  };

  /**
   * Calculate the intensity matrix of a gaussian shape.
   * @returns z values.
   */

  public static getData = (
    shape: IGaussian2DClassOptions,
    options: GetData2DOptions = {},
  ) => {
    let { fwhm = 50, sd } = shape;

    fwhm = ensureFWHM2D(fwhm, sd);

    let {
      factor = Gaussian.getFactor(),
      length = { x: 0, y: 0 },
      height = Gaussian2D.calculateHeight({ fwhm, surface: 1 }),
    } = options;

    factor = ensureXYNumber(factor);

    length = ensureXYNumber(length);

    for (const axis of ['x', 'y'] as const) {
      if (!length[axis]) {
        length[axis] = Math.min(
          Math.ceil(fwhm[axis] * factor[axis]),
          Math.pow(2, 25) - 1,
        );
        if (length[axis] % 2 === 0) length[axis]++;
      }
    }

    const xCenter = (length.x - 1) / 2;
    const yCenter = (length.y - 1) / 2;
    const data = new Array(length.x);
    for (let i = 0; i < length.x; i++) {
      data[i] = new Float64Array(length.y);
    }
    for (let i = 0; i < length.x; i++) {
      for (let j = 0; j < length.y; j++) {
        data[i][j] =
          Gaussian2D.fct(i - xCenter, j - yCenter, fwhm.x, fwhm.y) * height;
      }
    }
    return data;
  };

  public static calculateHeight = (
    options: ICalculateHeightGaussian2D = {},
  ) => {
    let { surface = 1, fwhm = 1 } = options;
    fwhm = ensureXYNumber(fwhm);
    return (surface * Math.LN2 * 4) / (Math.PI * fwhm.y * fwhm.x);
  };

  public static getSurface = (options: IGetVolumeGaussian2DOptions = {}) => {
    let { fwhm = 50, height = 1 } = options;

    if (typeof fwhm !== 'object') fwhm = { x: fwhm, y: fwhm };

    return (height * Math.PI * fwhm.y * fwhm.x) / Math.LN2 / 4;
  };
}

function ensureXYNumber(input: number | XYNumber): XYNumber {
  return typeof input !== 'object' ? { x: input, y: input } : { ...input };
}

function ensureFWHM2D(fwhm?: number | XYNumber, sd?: number | XYNumber) {
  if (sd !== undefined) {
    let sdObject = ensureXYNumber(sd);
    return {
      x: Gaussian.widthToFWHM(2 * sdObject.x),
      y: Gaussian.widthToFWHM(2 * sdObject.y),
    };
  } else if (fwhm !== undefined) {
    return ensureXYNumber(fwhm);
  } else {
    throw new Error('ensureFWHM2D must have either fwhm or sd defined');
  }
}
