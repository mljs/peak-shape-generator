import { Gaussian } from '../classes/Gaussian';
import { Gaussian2D } from '../classes/Gaussian2D';
import { Lorentzian } from '../classes/Lorentzian';
import { PseudoVoigt } from '../classes/PseudoVoigt';

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
