export interface GetDataOptions {
  length?: number;
  factor?: number;
}

export abstract class Shape1DClass
 {
  public abstract height: number;
  public abstract fwhm: number;

  public abstract fwhmToWidth(fwhm: number): number;
  public abstract widthToFWHM(width: number): number;
  public abstract fct(x: number): number;
  public abstract getArea(): number;
  public abstract getFactor(area?: number): number;
  public abstract getData(options: GetDataOptions): Float64Array;
}
