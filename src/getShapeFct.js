import { gaussianFct } from './shapes/gaussianFct';
import { lorentzianFct } from './shapes/lorentzianFct';
import { pseudovoigtFct } from './shapes/pseudovoigtFct';
import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from './util/constants';
import { getKind } from './util/getKind';

export function getShapeFct(kind = GAUSSIAN) {
  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      return gaussianFct;
    case LORENTZIAN:
      return lorentzianFct;
    case PSEUDO_VOIGT:
      return pseudovoigtFct;
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
