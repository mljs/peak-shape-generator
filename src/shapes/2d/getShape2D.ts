import type { Shape2D } from './Shape2D.ts';
import { Gaussian2D } from './gaussian2D/Gaussian2D.ts';

/**
 * Generate a instance of a specific kind of shape.
 * @param shape - shape descriptor specifying the kind and parameters.
 * @returns an instance of the requested 2D shape class.
 */
export function getShape2D(shape: Shape2D) {
  const { kind } = shape;
  switch (kind) {
    case 'gaussian':
      return new Gaussian2D(shape);
    default: {
      const unHandled: never = kind;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown distribution ${unHandled}`);
    }
  }
}
