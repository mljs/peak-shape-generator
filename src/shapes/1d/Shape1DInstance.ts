import type { Gaussian } from './gaussian/Gaussian.ts';
import type { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian.ts';
import type { Lorentzian } from './lorentzian/Lorentzian.ts';
import type { LorentzianDispersive } from './lorentzianDispersive/LorentzianDispersive.ts';
import type { PseudoVoigt } from './pseudoVoigt/PseudoVoigt.ts';
import type { PseudoVoigtTCH } from './pseudoVoigtTCH/PseudoVoigtTCH.ts';

export type Shape1DInstance =
  | Gaussian
  | Lorentzian
  | PseudoVoigt
  | PseudoVoigtTCH
  | LorentzianDispersive
  | GeneralizedLorentzian;
