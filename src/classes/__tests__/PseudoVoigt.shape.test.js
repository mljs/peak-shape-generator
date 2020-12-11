import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ROOT_2LN2_MINUS_ONE, GAUSSIAN_EXP_FACTOR } from '../../util/constants';
import { Gaussian } from '../Gaussian';
import { Lorentzian } from '../Lorentzian';
import { PseudoVoigt } from '../PseudoVoigt';

expect.extend({ toBeDeepCloseTo });

describe('PseudoVoigt', () => {
  it('height of 5', () => {
    let data = new PseudoVoigt({ fwhm: 10, height: 5 }).getData();
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(5, 4);
  });
  it('area with fix fwhm', () => {
    let shape = new PseudoVoigt({ fwhm: 50, mu: 0.5 });
    let data = shape.getData();
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.99, 2);
    let computedArea = shape.getArea();
    expect(computedArea).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 11, height: 1 }).getData({ length: 11 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 10 }).getData({ length: 10 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const mu = 0.5;
    const width = 20;
    expect(pseudoVoigt.widthToFWHM(width)).toBe(
      width * (mu * ROOT_2LN2_MINUS_ONE + 1),
    );
    expect(pseudoVoigt.widthToFWHM(width)).toBe(PseudoVoigt.widthToFWHM(width));
  });
  it('fwhm to width', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const mu = 0.5;
    const fwhm = 20;
    expect(pseudoVoigt.fwhmToWidth(fwhm)).toBe(
      fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1),
    );
    pseudoVoigt.setFWHM(fwhm);
    expect(pseudoVoigt.fwhmToWidth()).toBe(PseudoVoigt.fwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const area = pseudoVoigt.getArea();
    pseudoVoigt.setHeight(2);
    expect(pseudoVoigt.getArea()).toBeDeepCloseTo(2 * area, 4);
  });
  it('change mu should change area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1, mu: 0 });
    expect(pseudoVoigt.getArea()).toBeDeepCloseTo(Lorentzian.getArea(100), 4);
    pseudoVoigt.setMu(1);
    expect(pseudoVoigt.getArea()).toBeDeepCloseTo(Gaussian.getArea(100), 4);
  });
  it('A change in mu should keep the same area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 5, mu: 0 });
    for (let i = 0; i < 11; i++) {
      let mu = i * 0.1;
      pseudoVoigt.setMu(mu);
      pseudoVoigt.setHeight(
        1 /
          ((pseudoVoigt.mu / Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI)) *
            pseudoVoigt.fwhm +
            ((1 - pseudoVoigt.mu) * pseudoVoigt.fwhm * Math.PI) / 2),
      );
      let data = pseudoVoigt.getData();
      let area = data.reduce((a, b) => a + b, 0);
      expect(area).toBeDeepCloseTo(0.9999, 4);
    }
  });
});
