import { gaussianFct } from '../../gaussian/Gaussian';
import { lorentzianFct } from '../../lorentzian/Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

describe('pseudoVoigt function', () => {
  it('mu equal 0, pure lorentzian', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 0.2, mu: 0 });
    expect(pseudoVoigt.fct(0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(pseudoVoigt.fct(-0.1), 2);
    expect(pseudoVoigt.fct(0.15)).toBeCloseTo(lorentzianFct(0.15, 0.2), 2);
  });
  it('mu equal 1', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 0.2, mu: 1 });
    expect(pseudoVoigt.fct(0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(pseudoVoigt.fct(-0.1), 2);
    expect(pseudoVoigt.fct(0.15)).toBeCloseTo(
      gaussianFct(0.15, 0.2),
      2,
    );
  });
  it('mu equal 0.5 or 0.2', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 0.2, mu: 0.5 });
    expect(pseudoVoigt.fct(0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1)).toBeCloseTo(pseudoVoigt.fct(-0.1), 2);

    expect(pseudoVoigt.fct(0.15)).toBeCloseTo(
      gaussianFct(0.15, 0.2) * 0.5 + lorentzianFct(0.15, 0.2) * 0.5,
      2,
    );
  });
});
