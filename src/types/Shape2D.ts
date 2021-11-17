import type { IGaussian2DClassOptions } from '../shapes/2d/gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
interface GaussianShape2D extends IGaussian2DClassOptions {
  kind: 'gaussian';
}

export type Shape2D = GaussianShape2D;
