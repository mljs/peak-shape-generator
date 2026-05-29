import { expect, test } from 'vitest';

import { ROOT_2LN2_MINUS_ONE } from '../../../../util/constants.ts';
import { getGaussianArea } from '../../gaussian/Gaussian.ts';
import { getLorentzianArea } from '../../lorentzian/Lorentzian.ts';
import {
  PseudoVoigt,
  pseudoVoigtFwhmToWidth,
  pseudoVoigtWidthToFWHM,
} from '../PseudoVoigt.ts';

test('height of 5', () => {
  const data = new PseudoVoigt({ fwhm: 10 }).getData({ height: 5 });
  const center = Math.floor((data.length - 1) / 2);

  expect(data[center]).toBeCloseTo(5, 4);
});

test('area with fix fwhm', () => {
  const shape = new PseudoVoigt({ fwhm: 50, mu: 0.5 });
  const data = shape.getData();
  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(0.9999, 2);

  const height = shape.calculateHeight();
  const computedArea = shape.getArea(height);

  expect(computedArea).toBeCloseTo(1, 2);
  expect(shape.getParameters()).toStrictEqual(['fwhm', 'mu']);
});

test('odd fwhm', () => {
  const data = new PseudoVoigt({ fwhm: 11 }).getData({
    length: 11,
    height: 1,
  });
  const center = Math.floor((data.length - 1) / 2);

  expect(data[center]).toBeCloseTo(1, 4);
  expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
  expect(data[center]).toBeGreaterThan(data[center + 1]);
});

test('even fwhm', () => {
  const data = new PseudoVoigt({ fwhm: 10 }).getData({ length: 10 });
  const center = Math.floor((data.length - 1) / 2);

  expect(data[center]).toBeCloseTo(data[center + 1], 4);
  expect(data[0]).toBeCloseTo(data.at(-1), 4);
});

test('width To fwhm', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm: 100 });
  const mu = 0.5;
  const width = 20;

  expect(pseudoVoigt.widthToFWHM(width)).toBe(
    width * (mu * ROOT_2LN2_MINUS_ONE + 1),
  );
  expect(pseudoVoigt.widthToFWHM(width)).toBe(pseudoVoigtWidthToFWHM(width));
});

test('fwhm to width', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm: 100 });
  const mu = 0.5;
  const fwhm = 20;

  expect(pseudoVoigt.fwhmToWidth(fwhm)).toBe(
    fwhm / (mu * ROOT_2LN2_MINUS_ONE + 1),
  );

  pseudoVoigt.fwhm = fwhm;

  expect(pseudoVoigt.fwhmToWidth()).toBe(pseudoVoigtFwhmToWidth(fwhm));
});

test('change height should change area', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm: 100 });
  const area = pseudoVoigt.getArea();

  expect(pseudoVoigt.getArea(2)).toBeCloseTo(2 * area, 4);
});

test('change mu should change area', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm: 100, mu: 0 });

  expect(pseudoVoigt.getArea()).toBeCloseTo(
    getLorentzianArea({ fwhm: 100 }),
    4,
  );

  pseudoVoigt.mu = 1;

  expect(pseudoVoigt.getArea()).toBeCloseTo(getGaussianArea({ fwhm: 100 }), 4);
});

test('A change in mu should keep the same area', () => {
  const pseudoVoigt = new PseudoVoigt({ fwhm: 5, mu: 0 });
  for (let i = 0; i < 11; i++) {
    const mu = i * 0.1;
    pseudoVoigt.mu = mu;
    const height = pseudoVoigt.calculateHeight();
    const data = pseudoVoigt.getData({ height });
    const area = data.reduce((a, b) => a + b, 0);

    expect(area).toBeCloseTo(0.9999, 2);
  }
});
