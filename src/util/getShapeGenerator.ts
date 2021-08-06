import { Gaussian } from '../shapes/1d/gaussian/Gaussian';
import { Lorentzian } from '../shapes/1d/lorentzian/Lorentzian';
import { PseudoVoigt } from '../shapes/1d/pseudoVoigt/PseudoVoigt';
import { Gaussian2D } from '../shapes/2d/gaussian2D/Gaussian2D';

/**
 * kind of shape
 */
export type ShapeKind =
  | 'gaussian'
  | 'gaussian2D'
  | 'lorentzian'
  | 'pseudoVoigt';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShapeGenerator(kind: ShapeKind, shapeOptions = {}) {
  switch (kind) {
    case 'gaussian':
      return new Gaussian(shapeOptions);
    case 'lorentzian':
      return new Lorentzian(shapeOptions);
    case 'pseudoVoigt':
      return new PseudoVoigt(shapeOptions);
    case 'gaussian2D':
      return new Gaussian2D(shapeOptions);
    default:
  }
}
