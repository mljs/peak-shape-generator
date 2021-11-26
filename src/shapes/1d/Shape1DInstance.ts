import { Gaussian } from './gaussian/Gaussian';
import { Lorentzian } from './lorentzian/Lorentzian';
import { PseudoVoigt } from './pseudoVoigt/PseudoVoigt';

export type Shape1DInstance = Gaussian | Lorentzian | PseudoVoigt;
