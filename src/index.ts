export * as gaussian from './shapes/1d/gaussian/Gaussian';
export * as lorentzian from './shapes/1d/lorentzian/Lorentzian';
export * as pseudoVoigt from './shapes/1d/pseudoVoigt/PseudoVoigt';
export * as gaussian2D from './shapes/2d/gaussian2D/Gaussian2D';
export * from './util/getShape1D';
export * from './util/getShape2D';

export * from './shapes/1d/Shape1D';
export * from './shapes/2d/Shape2D';

export { XYNumber } from './shapes/2d/gaussian2D/Gaussian2D';
export type { GaussianClassOptions } from './shapes/1d/gaussian/Gaussian';
export type { LorentzianClassOptions } from './shapes/1d/lorentzian/Lorentzian';
export type { PseudoVoigtClassOptions } from './shapes/1d/pseudoVoigt/PseudoVoigt';
export type { Gaussian2DClassOptions } from './shapes/2d/gaussian2D/Gaussian2D';