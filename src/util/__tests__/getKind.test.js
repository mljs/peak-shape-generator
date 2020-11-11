import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT, getKind } from '../getKind';

expect.extend({ toBeDeepCloseTo });

describe('gaussan', () => {
  it('kind as a string', () => {
    let kindString = ['gaussian', 'lorentzian', 'pseudovoigt'];
    let kindValues = [GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT];
    for (let i = 0; i < kindString.length; i++) {
      let kind = getKind(kindString[i]);
      expect(kind).toBeDeepCloseTo(kindValues[i], 2);
    }
  });
  it('throw error', () => {
    expect(() => {
      getKind('gausian');
    }).toThrow('Unknown kind: gausian');
  });
});
