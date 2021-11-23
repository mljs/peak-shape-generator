export { Gaussian } from './shapes/1d/gaussian/Gaussian';
export { Lorentzian } from './shapes/1d/lorentzian/Lorentzian';
export { PseudoVoigt } from './shapes/1d/pseudoVoigt/PseudoVoigt';
export { Gaussian2D, XYNumber } from './shapes/2d/gaussian2D/Gaussian2D';

export * from './util/getShape1D';
export * from './util/getShape2D';
export * from './util/getShapeData1D';
export * from './util/getShapeData2D';

export type { Shape1D } from './shapes/1d/Shape1D';
export type { Shape2D } from './shapes/2d/Shape2D';
export type { IShape1DInstance } from './shapes/1d/IShape1DInstance';
export type { IShape2DInstance } from './shapes/2d/IShape2DInstance';
