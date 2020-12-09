import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getShapeFct } from '..';
import { GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT } from '../util/constants';

expect.extend({ toBeDeepCloseTo });

describe('getShapeFct', () => {
  it('gaussianFct', () => {
    let shapeFct = getShapeFct(GAUSSIAN);
    expect(shapeFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(shapeFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(shapeFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      shapeFct(0, 2, 0.2, -0.1),
      2,
    );
  });
  it('lorentzianFct', () => {
    let shapeFct = getShapeFct(LORENTZIAN);
    expect(shapeFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(shapeFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(shapeFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      shapeFct(0, 2, 0.2, -0.1),
      2,
    );
  });
  it('pseudovoigtFct', () => {
    let shapeFct = getShapeFct(PSEUDO_VOIGT);
    expect(shapeFct(0, 2, 0.2, 0.5, 0)).toBeDeepCloseTo(2, 2);
    expect(shapeFct(0, 2, 0.2, 0.5, 0.1)).toBeDeepCloseTo(1, 2);
    expect(shapeFct(0, 2, 0.2, 0.5, 0.1)).toBeDeepCloseTo(
      shapeFct(0, 2, 0.2, 0.5, -0.1),
      2,
    );
  });
  it('throw error', () => {
    expect(() => {
      getShapeFct(4);
    }).toThrow('Unknown kind: 4');
  });
});
