import * as gaussian from '../shapes/gaussian';
import * as gaussian2D from '../shapes/gaussian2D';
import * as lorentzian from '../shapes/lorentzian';
import * as pseudoVoigt from '../shapes/pseudoVoigt';

/**
 * Get the complete set of function for a specific kind of shape.
 * @param [kind='gaussian'] kind of shape.
 * @returns
 */

export function getShapeGenerator(kind = 'gaussian') {
  switch (kind.toLowerCase().replace(/[^a-z^0-9]/g, '')) {
    case 'gaussian':
      return gaussian;
    case 'lorentzian':
      return lorentzian;
    case 'pseudovoigt':
      return pseudoVoigt;
    case 'gaussian2d':
      return gaussian2D;
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
