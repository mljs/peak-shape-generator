import type { Shape2D } from './Shape2D.ts';
import type { Shape2DInstance } from './Shape2DInstance.ts';
import { Gaussian2D } from './gaussian2D/Gaussian2D.ts';

/**
 * Generate an instance of a specific kind of shape.
 * @param shape - shape descriptor specifying the kind and parameters.
 * @returns an instance of the requested 2D shape class.
 */
export function getShape2D<TShape extends Shape2D>(
  shape: TShape,
): Shape2DInstance<TShape['kind']>;
export function getShape2D(shape: Shape2D) {
  const { kind } = shape;
  switch (kind) {
    case 'gaussian':
      return new Gaussian2D(shape);
    default:
      throw new Error(`Unknown distribution ${kind as string}`);
  }
}
