import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';
import { Lorentzian } from '../Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

expect.extend({ toBeDeepCloseTo });

describe('PseudoVoigt.fct', () => {
  const gaussianFct = new Gaussian().fct;
  const lorentzianFct = new Lorentzian().fct;
  it('mu equal 0', () => {
    const pseudoVoigtFct = new PseudoVoigt(0);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      pseudoVoigtFct(0, 2, 0.2, 0, -0.1),
      2,
    );
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      lorentzianFct(0, 2, 0.2, 0.1),
      2,
    );
  });
  it('mu equal 1', () => {
    const pseudoVoigtFct = new PseudoVoigt(1);
    expect(pseudoVoigtFct(0, 2, 0.2, 1, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(
      pseudoVoigtFct(0, 2, 0.2, 1, -0.1),
      2,
    );
    expect(pseudoVoigtFct(0, 2, 0.2, 1, 0.1)).toBeDeepCloseTo(
      gaussianFct(0, 2, 0.2, 0.1),
      2,
    );
  });
  it('mu equal 0.5', () => {
    const pseudoVoigtFct = new PseudoVoigt(0.5);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0)).toBeDeepCloseTo(2, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(1, 2);
    expect(pseudoVoigtFct(0, 2, 0.2, 0, 0.1)).toBeDeepCloseTo(
      pseudoVoigtFct(0, 2, 0.2, 0, -0.1),
      2,
    );
  });
});
