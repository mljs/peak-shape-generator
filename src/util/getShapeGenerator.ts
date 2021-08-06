import { Gaussian } from '../shapes/1d/gaussian/Gaussian';
import { Gaussian2D } from '../shapes/2d/gaussian2D/Gaussian2D';
import { Lorentzian } from '../shapes/Lorentzian';
import { PseudoVoigt } from '../shapes/PseudoVoigt';

export type Shape = Gaussian | Gaussian2D | Lorentzian | PseudoVoigt;

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
