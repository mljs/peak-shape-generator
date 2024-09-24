import type { Shape1D } from './Shape1D';
import { Shape1DInstance } from './Shape1DInstance';
import { Gaussian } from './gaussian/Gaussian';
import { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian';
import { Lorentzian } from './lorentzian/Lorentzian';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt';

/**
 * Generate a instance of a specific kind of shape.
 */
export function getShape1D(shape: Shape1D): Shape1DInstance {
  const { kind } = shape;

  switch (kind) {
    case 'gaussian':
      return new Gaussian(shape);
    case 'lorentzian':
      return new Lorentzian(shape);
    case 'pseudoVoigt':
      return new PseudoVoigt(shape);
    case 'generalizedLorentzian':
      return new GeneralizedLorentzian(shape);
    default: {
      throw Error(`Unknown distribution ${kind as string}`);
    }
  }
}
