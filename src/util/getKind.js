export const GAUSSIAN = 1;
export const LORENTZIAN = 2;
export const PSEUDO_VOIGT = 3;

export function getKind(kind) {
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
