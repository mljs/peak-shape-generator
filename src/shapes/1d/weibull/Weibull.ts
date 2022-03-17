export class Weibull {
  public scale: number;
  public shape: number;

  public constructor(options: any = {}) {
    const { shape = 1, scale = 5 } = options;

    if (shape < 0 || scale < 0) {
      throw new RangeError('scale and shape must be positive or zero');
    }

    this.shape = shape;
    this.scale = scale;
  }

  public fct(x: number) {
    return weibull(x, this.scale, this.shape);
  }
}

export function weibull(x: number, scale: number, shape: number) {
  return (
    (shape / scale) *
    Math.pow(x / scale, shape - 1) *
    Math.exp(-Math.pow(x / scale, shape))
  );
}
