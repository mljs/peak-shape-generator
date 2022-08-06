import type { Gaussian2DClassOptions } from './gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
export interface GaussianShape2D extends Gaussian2DClassOptions {
  kind: 'gaussian';
}

export type Shape2D = GaussianShape2D;
