import type { IGaussianClassOptions } from '../shapes/1d/gaussian/Gaussian';
import type { ILorentzianClassOptions } from '../shapes/1d/lorentzian/Lorentzian';
import type { IPseudoVoigtClassOptions } from '../shapes/1d/pseudoVoigt/PseudoVoigt';

/**
 * kind of shape
 */
interface IGaussianShape1D extends IGaussianClassOptions {
  kind: 'gaussian';
}

interface ILorentzianShape1D extends ILorentzianClassOptions {
  kind: 'lorentzian';
}

interface IPseudoVoigtShape1D extends IPseudoVoigtClassOptions {
  kind: 'pseudoVoigt';
}
export type Shape1D = IGaussianShape1D | ILorentzianShape1D | IPseudoVoigtShape1D;
