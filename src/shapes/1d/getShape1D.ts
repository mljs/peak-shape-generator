import type { Shape1D } from './Shape1D.ts';
import type { Shape1DInstance } from './Shape1DInstance.ts';
import { Gaussian } from './gaussian/Gaussian.ts';
import { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian.ts';
import { Lorentzian } from './lorentzian/Lorentzian.ts';
import { LorentzianDispersive } from './lorentzianDispersive/LorentzianDispersive.ts';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt.ts';

/**
 * Generate a instance of a specific kind of shape.
 * @param shape - shape descriptor specifying the kind and parameters.
 * @returns an instance of the requested shape class.
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
    case 'lorentzianDispersive':
      return new LorentzianDispersive(shape);
    case 'generalizedLorentzian':
      return new GeneralizedLorentzian(shape);
    default: {
      throw new Error(`Unknown distribution ${kind as string}`);
    }
  }
}
