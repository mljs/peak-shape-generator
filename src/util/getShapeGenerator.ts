import { Gaussian } from '../classes/Gaussian';
import { Gaussian2D } from '../classes/Gaussian2D';
import { Lorentzian } from '../classes/Lorentzian';
import { PseudoVoigt } from '../classes/PseudoVoigt';

/**
 * kind of shape
 */
type ShapeKind = 'gaussian' | 'gaussian2D' | 'lorentzian' | 'pseudoVoigt';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShapeGenerator(kind: shapeKind, shapeOptions = {}) {
  switch (kind.toLowerCase().replace(/[^a-z^0-9]/g, '')) {
    case 'gaussian':
      return new Gaussian(shapeOptions);
    case 'lorentzian':
      return new Lorentzian(shapeOptions);
    case 'pseudovoigt':
      return new PseudoVoigt(shapeOptions);
    case 'gaussian2d':
      return new Gaussian2D(shapeOptions);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
