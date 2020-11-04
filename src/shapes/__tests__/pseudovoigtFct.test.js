import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussianFct } from '../gaussianFct';
import { lorentzianFct } from '../lorentzianFct';
import { pseudovoigtFct } from '../pseudovoigtFct';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigtFct', () => {
  it('mu equal 0', () => {
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      pseudovoigtFct(0, 2, 0.2, 0, -0.1),
      2,
    );
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      lorentzianFct(0, 2, 0.2, 0.1),
      2,
    );
  });
  it('mu equal 1', () => {
    expect(pseudovoigtFct(0, 2, 0.2, 1, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(
      pseudovoigtFct(0, 2, 0.2, 1, -0.1),
      2,
    );
    expect(pseudovoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(
      gaussianFct(0, 2, 0.2, 0.1),
      2,
    );
  });
  it('mu equal 0.5', () => {
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudovoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      pseudovoigtFct(0, 2, 0.2, 0, -0.1),
      2,
    );
  });
});
