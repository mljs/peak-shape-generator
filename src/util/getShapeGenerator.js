import { Gaussian } from '../classes/Gaussian';
import { Lorentzian } from '../classes/Lorentzian';
import { PseudoVoigt } from '../classes/PseudoVoigt';

export function getShapeGenerator(options) {
  let { kind = 'Gaussian', options: shapeOptions } = options;
  switch (kind.toLowerCase().replace(/[^a-z]/g, '')) {
    case 'gaussian':
      return new Gaussian(shapeOptions);
    case 'lorentzian':
      return new Lorentzian(shapeOptions);
    case 'pseudovoigt':
      return new PseudoVoigt(shapeOptions);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
