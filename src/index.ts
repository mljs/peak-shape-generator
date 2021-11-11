import * as gaussian from './shapes/1d/gaussian/Gaussian';
import * as lorentzian from './shapes/1d/lorentzian/Lorentzian';
import * as pseudoVoigt from './shapes/1d/pseudoVoigt/PseudoVoigt';
import * as gaussian2D from './shapes/2d/gaussian2D/Gaussian2D';

export * from './util/getShape1D';
export * from './util/getShape2D';
export * from './util/getShapeData1D';

export * from './shapes/1d/Shape1DClass';
export * from './shapes/2d/Shape2DClass';

export { gaussian, gaussian2D, lorentzian, pseudoVoigt };

export type { Shape1D } from './types/Shape1D';
export type { Shape2D } from './types/Shape2D';
export type { XYNumber } from './shapes/2d/gaussian2D/Gaussian2D';
export type { GaussianClassOptions } from './shapes/1d/gaussian/Gaussian';
export type { LorentzianClassOptions } from './shapes/1d/lorentzian/Lorentzian';
export type { PseudoVoigtClassOptions } from './shapes/1d/pseudoVoigt/PseudoVoigt';
export type { Gaussian2DClassOptions } from './shapes/2d/gaussian2D/Gaussian2D';
