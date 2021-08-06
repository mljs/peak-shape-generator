import * as gaussian from '../../gaussian/Gaussian';
import * as lorentzian from '../../lorentzian/Lorentzian';
import * as pseudoVoigt from '../PseudoVoigt';

describe('pseudoVoigt function', () => {
  it('mu equal 0, pure lorentzian', () => {
    expect(pseudoVoigt.fct(0, 0.2, 0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 0)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 0)).toBeCloseTo(
      pseudoVoigt.fct(-0.1, 0.2, 0),
      2,
    );
    expect(pseudoVoigt.fct(0.15, 0.2, 0)).toBeCloseTo(
      lorentzian.fct(0.15, 0.2),
      2,
    );
  });
  it('mu equal 1', () => {
    expect(pseudoVoigt.fct(0, 0.2, 1)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 1)).toBeCloseTo(
      pseudoVoigt.fct(-0.1, 0.2, 1),
      2,
    );
    expect(pseudoVoigt.fct(0.15, 0.2, 1)).toBeCloseTo(
      gaussian.fct(0.15, 0.2),
      2,
    );
  });
  it('mu equal 0.5 or 0.2', () => {
    expect(pseudoVoigt.fct(0, 0.2, 0.5)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 0.5)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.1, 0.2, 0.5)).toBeCloseTo(
      pseudoVoigt.fct(-0.1, 0.2, 0.5),
      2,
    );

    expect(pseudoVoigt.fct(0.15, 0.2, 0.5)).toBeCloseTo(
      gaussian.fct(0.15, 0.2) * 0.5 + lorentzian.fct(0.15, 0.2) * 0.5,
      2,
    );
  });
});
