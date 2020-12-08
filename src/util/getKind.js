import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from './constants';

export function getKind(kind) {
  if (typeof kind !== 'string') return kind;
  switch (kind.toLowerCase().replace(/[^a-z]/g, '')) {
    case 'gaussian':
      return GAUSSIAN;
    case 'lorentzian':
      return LORENTZIAN;
    case 'pseudovoigt':
      return PSEUDO_VOIGT;
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}
