import type { Gaussian } from '../shapes/1d/gaussian/Gaussian';
import type { Lorentzian } from '../shapes/1d/lorentzian/Lorentzian';
import type { PseudoVoigt } from '../shapes/1d/pseudoVoigt/PseudoVoigt';

export type Shape1DClass = Gaussian | PseudoVoigt | Lorentzian;
