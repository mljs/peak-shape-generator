import type { IGaussianClassOptions } from '../shapes/1d/gaussian/Gaussian';
import type { ILorentzianClassOptions } from '../shapes/1d/lorentzian/Lorentzian';
import type { IPseudoVoigtClassOptions } from '../shapes/1d/pseudoVoigt/PseudoVoigt';

/**
 * kind of shape
 */
interface GaussianShape1D extends IGaussianClassOptions {
  kind: 'gaussian';
}

interface LorentzianShape1D extends ILorentzianClassOptions {
  kind: 'lorentzian';
}

interface PseudoVoigtShape1D extends IPseudoVoigtClassOptions {
  kind: 'pseudoVoigt';
}
export type Shape1D = GaussianShape1D | LorentzianShape1D | PseudoVoigtShape1D;
