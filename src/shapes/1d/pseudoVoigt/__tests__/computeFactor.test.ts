import { describe, expect, it } from 'vitest';

import { getGaussianFactor } from '../../gaussian/Gaussian.ts';
import { getLorentzianFactor } from '../../lorentzian/Lorentzian.ts';
import { getPseudoVoigtFactor } from '../PseudoVoigt.ts';
import { pseudoVoigtFindFactor } from '../computeFactor.ts';

describe('pseudoVoigtFindFactor', () => {
  describe('input validation', () => {
    it.each([
      [-0.1, 0.5],
      [0, 0.5],
      [1, 0.5],
      [1.1, 0.5],
    ])('throws for invalid pTarget=%p', (pTarget, mu) => {
      expect(() => pseudoVoigtFindFactor(pTarget, mu)).toThrow(RangeError);
    });
  });

  describe('special mu behavior', () => {
    it('falls back to gaussian factor when mu === 1', () => {
      const pTarget = 0.5;

      expect(pseudoVoigtFindFactor(pTarget, 1)).toBeCloseTo(
        getGaussianFactor(pTarget),
        12,
      );
    });

    it('falls back to lorentzian factor when mu === 0', () => {
      const pTarget = 0.5;

      expect(pseudoVoigtFindFactor(pTarget, 0)).toBeCloseTo(
        getLorentzianFactor(pTarget),
        12,
      );
    });
  });

  describe('typical factor values', () => {
    it.each([
      [0.001, 0.25],
      [0.25, 0.5],
      [0.75, 0.75],
      [0.999, 0.5],
    ])(
      'returns a finite positive factor for pTarget=%p mu=%p',
      (pTarget, mu) => {
        const factor = pseudoVoigtFindFactor(pTarget, mu);

        expect(factor).toBeGreaterThan(0);
        expect(Number.isFinite(factor)).toBe(true);
      },
    );
  });
});

describe('getPseudoVoigtFactor', () => {
  it('returns finite values for extreme mu values', () => {
    const f0 = getPseudoVoigtFactor(0.9, 0);
    const f1 = getPseudoVoigtFactor(0.9, 1);

    expect(Number.isFinite(f0)).toBe(true);
    expect(Number.isFinite(f1)).toBe(true);
    expect(f0).toBeGreaterThanOrEqual(0);
    expect(f1).toBeGreaterThanOrEqual(0);
  });
});
