import { ROOT_2LN2_MINUS_ONE, GAUSSIAN_EXP_FACTOR } from '../../util/constants';
import * as gaussian from '../Gaussian';
import * as lorentzian from '../Lorentzian';
import { PseudoVoigt, widthToFWHM, fwhmToWidth } from '../PseudoVoigt';

describe('PseudoVoigt', () => {
  it('height of 5', () => {
    let data = new PseudoVoigt({ fwhm: 10, height: 5 }).getData();
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeCloseTo(5, 4);
  });
  it('area with fix fwhm', () => {
    let shape = new PseudoVoigt({ fwhm: 50, mu: 0.5 });
    let data = shape.getData();
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 2);
    let computedArea = shape.getArea();
    expect(computedArea).toBeCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 11, height: 1 }).getData({ length: 11 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeCloseTo(1, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = new PseudoVoigt({ fwhm: 10 }).getData({ length: 10 });
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const mu = 0.5;
    const width = 20;
    expect(pseudoVoigt.widthToFWHM(width)).toBe(
      width * (mu * ROOT_2LN2_MINUS_ONE + 1),
    );
    expect(pseudoVoigt.widthToFWHM(width)).toBe(widthToFWHM(width));
  });
  it('fwhm to width', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const mu = 0.5;
    const fwhm = 20;
    expect(pseudoVoigt.fwhmToWidth(fwhm)).toBe(
      fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1),
    );
    pseudoVoigt.fwhm = fwhm;
    expect(pseudoVoigt.fwhmToWidth()).toBe(fwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1 });
    const area = pseudoVoigt.getArea();
    pseudoVoigt.height = 2;
    expect(pseudoVoigt.getArea()).toBeCloseTo(2 * area, 4);
  });
  it('change mu should change area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 100, height: 1, mu: 0 });
    expect(pseudoVoigt.getArea()).toBeCloseTo(
      lorentzian.getArea({ fwhm: 100 }),
      4,
    );
    pseudoVoigt.mu = 1;
    expect(pseudoVoigt.getArea()).toBeCloseTo(
      gaussian.getArea({ fwhm: 100 }),
      4,
    );
  });
  it('A change in mu should keep the same area', () => {
    const pseudoVoigt = new PseudoVoigt({ fwhm: 5, mu: 0 });
    for (let i = 0; i < 11; i++) {
      let mu = i * 0.1;
      pseudoVoigt.mu = mu;
      pseudoVoigt.height =
        1 /
        ((pseudoVoigt.mu / Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI)) *
          pseudoVoigt.fwhm +
          ((1 - pseudoVoigt.mu) * pseudoVoigt.fwhm * Math.PI) / 2);
      let data = pseudoVoigt.getData();
      let area = data.reduce((a, b) => a + b, 0);
      expect(area).toBeCloseTo(0.9999, 3);
    }
  });
});
