import type { Gaussian } from './gaussian/Gaussian.ts';
import type { GeneralizedLorentzian } from './generalizedLorentzian/GeneralizedLorentzian.ts';
import type { Lorentzian } from './lorentzian/Lorentzian.ts';
import type { LorentzianDispersive } from './lorentzianDispersive/LorentzianDispersive.ts';
import type { PseudoVoigt } from './pseudoVoigt/PseudoVoigt.ts';
import type { PseudoVoigtTCH } from './pseudoVoigtTCH/PseudoVoigtTCH.ts';
import type { SplitGaussian } from './splitGaussian/SplitGaussian.ts';

export interface Shape1DKindInstanceMap {
  gaussian: Gaussian;
  lorentzian: Lorentzian;
  pseudoVoigt: PseudoVoigt;
  pseudoVoigtTCH: PseudoVoigtTCH;
  lorentzianDispersive: LorentzianDispersive;
  generalizedLorentzian: GeneralizedLorentzian;
  splitGaussian: SplitGaussian;
}

export type Shape1DInstance<
  TKind extends keyof Shape1DKindInstanceMap = keyof Shape1DKindInstanceMap,
> = Shape1DKindInstanceMap[TKind];
