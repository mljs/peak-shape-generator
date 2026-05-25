import { getPseudoVoigtFactor } from '../PseudoVoigt';
import { pseudoVoigtFindFactor } from '../computeFactor';

describe('pseudoVoigt factor computation', () => {
  it('returns edge values for pTarget boundaries', () => {
    expect(pseudoVoigtFindFactor(0, 0.5)).toBe(0);
    expect(pseudoVoigtFindFactor(1, 0.5)).toBe(Infinity);
  });

  it('reduces to tan for mu === 1', () => {
    const p = 0.5;
    const expected = Math.tan((Math.PI / 2) * p);
    expect(pseudoVoigtFindFactor(p, 1)).toBeCloseTo(expected, 12);
  });

  it('finds a finite factor for typical inputs', () => {
    const f = pseudoVoigtFindFactor(0.999, 0.5);
    expect(f).toBeGreaterThan(0);
    expect(Number.isFinite(f)).toBe(true);
  });

  it('getPseudoVoigtFactor returns finite values for extreme mu', () => {
    const f0 = getPseudoVoigtFactor(0.9, 0);
    const f1 = getPseudoVoigtFactor(0.9, 1);
    expect(Number.isFinite(f0)).toBe(true);
    expect(Number.isFinite(f1)).toBe(true);
    expect(f0).toBeGreaterThanOrEqual(0);
    expect(f1).toBeGreaterThanOrEqual(0);
  });
});
