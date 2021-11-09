import type { GaussianClassOptions } from '../shapes/1d/gaussian/Gaussian';
import type { LorentzianClassOptions } from '../shapes/1d/lorentzian/Lorentzian';
import type { PseudoVoigtClassOptions } from '../shapes/1d/pseudoVoigt/PseudoVoigt';

/**
 * kind of shape
 */
interface GaussianShape1D extends GaussianClassOptions {
  kind: 'gaussian';
}

interface LorentzianShape1D extends LorentzianClassOptions {
  kind: 'lorentzian';
}

interface PseudoVoigtShape1D extends PseudoVoigtClassOptions {
  kind: 'pseudoVoigt';
}
export type Shape1D = GaussianShape1D | LorentzianShape1D | PseudoVoigtShape1D;
