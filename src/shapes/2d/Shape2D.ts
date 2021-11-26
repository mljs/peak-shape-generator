import type { Gaussian2DClassOptions } from './gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
interface IGaussianShape2D extends Gaussian2DClassOptions {
  kind: 'gaussian';
}

export type Shape2D = IGaussianShape2D;
