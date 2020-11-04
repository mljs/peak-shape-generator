import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussianFct as funcG } from '../gaussianFct';
import { lorentzianFct as funcL } from '../lorentzianFct';
import { pseudovoigtFct as func } from '../pseudovoigtFct';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigtFct', () => {
  it('mu equal 0', () => {
    expect(func(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(func(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      func(0, 2, 0.2, 0, -0.1),
      2,
    );
    expect(func(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(funcL(0, 2, 0.2, 0.1), 2);
  });
  it('mu equal 1', () => {
    expect(func(0, 2, 0.2, 1, 0)).toBeDeepCloseTo(2, 2);
    expect(func(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(
      func(0, 2, 0.2, 1, -0.1),
      2,
    );
    expect(func(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(funcG(0, 2, 0.2, 0.1), 2);
  });
  it('mu equal 0.5', () => {
    expect(func(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(func(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      func(0, 2, 0.2, 0, -0.1),
      2,
    );
  });
});
