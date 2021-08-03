import * as gaussian from '../gaussian';
import * as lorentzian from '../lorentzian';
import * as pseudoVoigt from '../pseudoVoigt';

describe('pseudoVoigt function', () => {
  it('mu equal 0, pure lorentzian', () => {
    expect(pseudoVoigt.fct(0.2, 0, 0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.2, 0, 0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.2, 0, 0.1)).toBeCloseTo(
      pseudoVoigt.fct(0.2, 0, -0.1),
      2,
    );
    expect(pseudoVoigt.fct(0.2, 0, 0.15)).toBeCloseTo(
      lorentzian.fct(0.2, 0.15),
      2,
    );
  });
  it('mu equal 1', () => {
    expect(pseudoVoigt.fct(0.2, 1, 0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.2, 1, 0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.2, 1, 0.1)).toBeCloseTo(
      pseudoVoigt.fct(0.2, 1, -0.1),
      2,
    );
    expect(pseudoVoigt.fct(0.2, 1, 0.15)).toBeCloseTo(
      gaussian.fct(0.2, 0.15),
      2,
    );
  });
  it('mu equal 0.5 or 0.2', () => {
    expect(pseudoVoigt.fct(0.2, 0.5, 0)).toBeCloseTo(1, 2);
    expect(pseudoVoigt.fct(0.2, 0.5, 0.1)).toBeCloseTo(0.5, 2);
    expect(pseudoVoigt.fct(0.2, 0.5, 0.1)).toBeCloseTo(
      pseudoVoigt.fct(0.2, 0.5, -0.1),
      2,
    );

    expect(pseudoVoigt.fct(0.2, 0.5, 0.15)).toBeCloseTo(
      gaussian.fct(0.2, 0.15) * 0.5 + lorentzian.fct(0.2, 0.15) * 0.5,
      2,
    );
  });
});
