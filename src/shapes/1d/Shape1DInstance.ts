import { Gaussian } from './gaussian/Gaussian';
import { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian';
import { Lorentzian } from './lorentzian/Lorentzian';
import { LorentzianDispersive } from './lorentzianDispersive/LorentzianDispersive';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt';
import { PseudoVoigtTCH } from './pseudoVoigtTCH/PseudoVoigtTCH';

export type Shape1DInstance =
  | Gaussian
  | Lorentzian
  | PseudoVoigt
  | PseudoVoigtTCH
  | LorentzianDispersive
  | GeneralizedLorentzian;
