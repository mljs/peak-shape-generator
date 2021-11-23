import { Gaussian2D } from '../shapes/2d/gaussian2D/Gaussian2D';
import type { Shape2D } from '../shapes/2d/Shape2D';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShape2D(shape: Shape2D) {
  const { kind } = shape;
  switch (kind) {
    case 'gaussian':
      return new Gaussian2D(shape);
    default: {
      const unHandled: never = kind;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw Error(`Unknown distribution ${unHandled}`);
    }
  }
}
