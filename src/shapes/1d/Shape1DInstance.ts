import { Gaussian } from './gaussian/Gaussian';
import { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian';
import { Lorentzian } from './lorentzian/Lorentzian';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt';

export type Shape1DInstance =
  | Gaussian
  | Lorentzian
  | PseudoVoigt
  | GeneralizedLorentzian;
