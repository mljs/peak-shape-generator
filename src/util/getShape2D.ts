import { Gaussian } from '../shapes/1d/gaussian/Gaussian';
import { Lorentzian } from '../shapes/1d/lorentzian/Lorentzian';
import { PseudoVoigt } from '../shapes/1d/pseudoVoigt/PseudoVoigt';
import { Gaussian2D } from '../shapes/2d/gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
export type Shape2DKind = 'gaussian2D';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShape2D(kind: Shape2DKind, shapeOptions = {}) {
  switch (kind) {
    case 'gaussian2D':
      return new Gaussian2D(shapeOptions);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`getShape2D: unknown shape kind: ${kind}`);
  }
}
