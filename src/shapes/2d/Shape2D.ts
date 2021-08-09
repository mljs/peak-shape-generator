import { XYNumber } from './gaussian2D/Gaussian2D';

export interface GetData2DOptions {
  length?: number | XYNumber;
  factor?: number | XYNumber;
}

export abstract class Shape2D {
  public abstract fwhmX: number;
  public abstract fwhmY: number;
  public abstract height: number;

  abstract fwhmToWidth(fwhm: number): number;
  abstract widthToFWHM(width: number): number;
  abstract fct(x: number, y: number): number;
  abstract getSurface(): number;
  abstract getFactor(area?: number): number;
  abstract getData(options: GetData2DOptions): Float64Array[];
}
