import erfinv from 'compute-erfinv';

import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from './constants';
import { getKind } from './getKind';

export function getFactor(kind, options = {}) {
  const { area = 0.9999 } = options;

  kind = getKind(kind);
  switch (kind) {
    case GAUSSIAN:
      return Math.sqrt(2) * erfinv(area);
    case LORENTZIAN:
      return 2 * Math.tan(Math.PI * (area - 0.5));
    case PSEUDO_VOIGT:
      return 2 * Math.tan(Math.PI * (area - 0.5));
    default:
      throw new Error(`Unknown shape kind: ${kind}`);
  }
}
