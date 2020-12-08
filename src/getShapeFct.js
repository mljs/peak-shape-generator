import { gaussianFct } from './shapes/gaussianFct';
import { lorentzianFct } from './shapes/lorentzianFct';
import { pseudovoigtFct } from './shapes/pseudovoigtFct';
import {
  GAUSSIAN,
  LORENTZIAN,
  PSEUDO_VOIGT,
  LORENTZIAN_WIDTH_FACTOR,
  GAUSSIAN_WIDTH_FACTOR,
} from './util/constants';
import { getKind } from './util/getKind';

export function getShapeFct(kind = GAUSSIAN, options = {}) {
  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      return {
        shapeFct: gaussianFct,
        factor: options.factor || GAUSSIAN_WIDTH_FACTOR,
      };
    case LORENTZIAN:
      return {
        shapeFct: lorentzianFct,
        factor: options.factor || LORENTZIAN_WIDTH_FACTOR,
      };
    case PSEUDO_VOIGT:
      return {
        shapeFct: pseudovoigtFct,
        factor: options.factor || LORENTZIAN_WIDTH_FACTOR,
      };
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
