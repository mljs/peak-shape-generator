import type { IShape1DClass } from './IShape1DClass';
import type { IPseudoVoigtClass } from './pseudoVoigt/PseudoVoigt';

export type IShape1DInstance = IShape1DClass | IPseudoVoigtClass;
