import type { Gaussian } from './gaussian/Gaussian';
import type { Lorentzian } from './lorentzian/Lorentzian';
import type { PseudoVoigt } from './pseudoVoigt/PseudoVoigt';

export type Shape1DClass = Gaussian | PseudoVoigt | Lorentzian;
