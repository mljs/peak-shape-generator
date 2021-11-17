import { Gaussian } from '../../gaussian/Gaussian';
import { Lorentzian } from '../../lorentzian/Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

describe('pseudoVoigt function', () => {
  it('mu equal 0, pure lorentzian', () => {
    expect(PseudoVoigt.fct(0, 0.2, 0)).toBeCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0)).toBeCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0)).toBeCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 0),
      2,
    );
    expect(PseudoVoigt.fct(0.15, 0.2, 0)).toBeCloseTo(
      Lorentzian.fct(0.15, 0.2),
      2,
    );
  });
  it('mu equal 1', () => {
    expect(PseudoVoigt.fct(0, 0.2, 1)).toBeCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 1)).toBeCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 1)).toBeCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 1),
      2,
    );
    expect(PseudoVoigt.fct(0.15, 0.2, 1)).toBeCloseTo(
      Gaussian.fct(0.15, 0.2),
      2,
    );
  });
  it('mu equal 0.5 or 0.2', () => {
    expect(PseudoVoigt.fct(0, 0.2, 0.5)).toBeCloseTo(1, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0.5)).toBeCloseTo(0.5, 2);
    expect(PseudoVoigt.fct(0.1, 0.2, 0.5)).toBeCloseTo(
      PseudoVoigt.fct(-0.1, 0.2, 0.5),
      2,
    );

    expect(PseudoVoigt.fct(0.15, 0.2, 0.5)).toBeCloseTo(
      Gaussian.fct(0.15, 0.2) * 0.5 + Lorentzian.fct(0.15, 0.2) * 0.5,
      2,
    );
  });
});
