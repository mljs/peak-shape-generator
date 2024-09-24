import type { GaussianClassOptions } from './gaussian/Gaussian';
import { GeneralizedLorentzianClassOptions } from './generalizedLorentzian/GeneralizedLorentzian';
import type { LorentzianClassOptions } from './lorentzian/Lorentzian';
import type { PseudoVoigtClassOptions } from './pseudoVoigt/PseudoVoigt';

/**
 * kind of shape
 */
export interface GaussianShape1D extends GaussianClassOptions {
  kind: 'gaussian';
}

export interface LorentzianShape1D extends LorentzianClassOptions {
  kind: 'lorentzian';
}

export interface PseudoVoigtShape1D extends PseudoVoigtClassOptions {
  kind: 'pseudoVoigt';
}

export interface GeneralizedLorentzianShape1D
  extends GeneralizedLorentzianClassOptions {
  kind: 'generalizedLorentzian';
}

export type Shape1D =
  | GaussianShape1D
  | LorentzianShape1D
  | PseudoVoigtShape1D
  | GeneralizedLorentzianShape1D;
