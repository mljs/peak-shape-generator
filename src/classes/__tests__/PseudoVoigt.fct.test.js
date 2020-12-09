import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';
import { Lorentzian } from '../Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

expect.extend({ toBeDeepCloseTo });

describe('PseudoVoigt function', () => {
  it('mu equal 0, pure lorentzian', () => {
    expect(PseudoVoigt.fct(0, 0.2, 0)).toBeDeepCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0)).toBeDeepCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0)).toBeDeepCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 0),
      2,
    );
    expect(PseudoVoigt.fct(0.15, 0.2, 0)).toBeDeepCloseTo(
      Lorentzian.fct(0.15, 0.2),
      2,
    );
    const pseudoVoigt = new PseudoVoigt({ mu: 0, fwhm: 0.2 });
    expect(pseudoVoigt.fct(0.15)).toBeDeepCloseTo(Lorentzian.fct(0.15, 0.2), 2);
  });
  it('mu equal 1', () => {
    expect(PseudoVoigt.fct(0, 0.2, 1)).toBeDeepCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 1)).toBeDeepCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 1)).toBeDeepCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 1),
      2,
    );
    expect(PseudoVoigt.fct(0.15, 0.2, 1)).toBeDeepCloseTo(
      Gaussian.fct(0.15, 0.2),
      2,
    );
    const pseudoVoigt = new PseudoVoigt({ mu: 1, fwhm: 0.2 });
    expect(pseudoVoigt.fct(0.15)).toBeDeepCloseTo(Gaussian.fct(0.15, 0.2), 2);
  });
  it('mu equal 0.5 or 0.2', () => {
    expect(PseudoVoigt.fct(0, 0.2, 0.5)).toBeDeepCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0.5)).toBeDeepCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0.5)).toBeDeepCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 0.5),
      2,
    );

    expect(PseudoVoigt.fct(0.15, 0.2, 0.5)).toBeDeepCloseTo(
      Gaussian.fct(0.15, 0.2) * 0.5 + Lorentzian.fct(0.15, 0.2) * 0.5,
      2,
    );

    const pseudoVoigt = new PseudoVoigt({ mu: 0.2, fwhm: 0.2 });
    expect(pseudoVoigt.fct(0.15)).toBeDeepCloseTo(
      Gaussian.fct(0.15, 0.2) * 0.2 + Lorentzian.fct(0.15, 0.2) * 0.8,
      2,
    );
  });
});
