import type { GaussianClassOptions } from './gaussian/Gaussian.ts';
import type { GeneralizedLorentzianClassOptions } from './generalizedLorentzian/GeneralizedLorentzian.ts';
import type { LorentzianClassOptions } from './lorentzian/Lorentzian.ts';
import type { PseudoVoigtClassOptions } from './pseudoVoigt/PseudoVoigt.ts';

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

export interface LorentzianDispersiveShape1D extends LorentzianClassOptions {
  kind: 'lorentzianDispersive';
}

export interface GeneralizedLorentzianShape1D extends GeneralizedLorentzianClassOptions {
  kind: 'generalizedLorentzian';
}

export type Shape1D =
  | GaussianShape1D
  | LorentzianShape1D
  | PseudoVoigtShape1D
  | LorentzianDispersiveShape1D
  | GeneralizedLorentzianShape1D;
