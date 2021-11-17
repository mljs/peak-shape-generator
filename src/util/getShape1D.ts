import { Gaussian } from '../shapes/1d/gaussian/Gaussian';
import { Lorentzian } from '../shapes/1d/lorentzian/Lorentzian';
import { PseudoVoigt } from '../shapes/1d/pseudoVoigt/PseudoVoigt';
import type { Shape1D } from '../types/Shape1D';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShape1D(shape: Shape1D) {
  const { kind } = shape;

  switch (kind) {
    case 'gaussian':
      return new Gaussian(shape);
    case 'lorentzian':
      return new Lorentzian(shape);
    case 'pseudoVoigt':
      return new PseudoVoigt(shape);
    default: {
      const unHandled: never = kind;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw Error(`Unknown distribution ${unHandled}`);
    }
  }
}
