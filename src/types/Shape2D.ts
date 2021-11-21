import type { IGaussian2DClassOptions } from '../shapes/2d/gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
interface IGaussianShape2D extends IGaussian2DClassOptions {
  kind: 'gaussian';
}

export type Shape2D = IGaussianShape2D;
