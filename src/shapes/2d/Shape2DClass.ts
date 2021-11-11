import { XYNumber } from './gaussian2D/Gaussian2D';

export interface GetData2DOptions {
  length?: number | XYNumber;
  factor?: number | XYNumber;
}

export abstract class Shape2DClass {
  public abstract fwhmX: number;
  public abstract fwhmY: number;
  public abstract height: number;

  public abstract fwhmToWidth(fwhm: number): number;
  public abstract widthToFWHM(width: number): number;
  public abstract fct(x: number, y: number): number;
  public abstract getSurface(): number;
  public abstract getFactor(area?: number): number;
  public abstract getData(options: GetData2DOptions): Float64Array[];
}
