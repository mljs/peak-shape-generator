import type { Shape1D } from './Shape1D.ts';
import type { Shape1DInstance } from './Shape1DInstance.ts';
import { Gaussian } from './gaussian/Gaussian.ts';
import { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian.ts';
import { Lorentzian } from './lorentzian/Lorentzian.ts';
import { LorentzianDispersive } from './lorentzianDispersive/LorentzianDispersive.ts';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt.ts';
import { PseudoVoigtTCH } from './pseudoVoigtTCH/PseudoVoigtTCH.ts';

/**
 * Generate a instance of a specific kind of shape.
 * @param shape - shape descriptor specifying the kind and parameters.
 * @returns an instance of the requested shape class.
 */
export function getShape1D<TShape extends Shape1D>(
  shape: TShape,
): Shape1DInstance<TShape['kind']> {
  const { kind } = shape;

  switch (kind) {
    case 'gaussian':
      return new Gaussian(shape) as Shape1DInstance<TShape['kind']>;
    case 'lorentzian':
      return new Lorentzian(shape) as Shape1DInstance<TShape['kind']>;
    case 'pseudoVoigt':
      return new PseudoVoigt(shape) as Shape1DInstance<TShape['kind']>;
    case 'pseudoVoigtTCH':
      return new PseudoVoigtTCH(shape) as Shape1DInstance<TShape['kind']>;
    case 'lorentzianDispersive':
      return new LorentzianDispersive(shape) as Shape1DInstance<TShape['kind']>;
    case 'generalizedLorentzian':
      return new GeneralizedLorentzian(shape) as Shape1DInstance<
        TShape['kind']
      >;
    default: {
      const unHandled: never = kind;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown distribution ${unHandled}`);
    }
  }
}
