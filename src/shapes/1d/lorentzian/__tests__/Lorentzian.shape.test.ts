import { expect, test } from 'vitest';

import { ROOT_THREE } from '../../../../util/constants.ts';
import {
  Lorentzian,
  lorentzianFwhmToWidth,
  lorentzianWidthToFWHM,
} from '../Lorentzian.ts';

test('default factor area', () => {
  const lorentzian = new Lorentzian();
  const data = lorentzian.getData();

  expect(data).toHaveLength(3183099);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(0.9999, 5);

  const expectedArea = 1;
  const height = lorentzian.calculateHeight(expectedArea);
  const computedArea = lorentzian.getArea(height);

  expect(computedArea).toBeCloseTo(expectedArea, 2);
  expect(lorentzian.getParameters()).toStrictEqual(['fwhm']);
});

test('differents factor', () => {
  const lorentzian = new Lorentzian({ fwhm: 1000 });
  const areas = [0.98, 0.96, 0.7, 0.4, 0.2];
  for (const area of areas) {
    const data = lorentzian.getData({ factor: lorentzian.getFactor(area) });
    const sum = data.reduce((a, b) => a + b, 0);

    expect(sum).toBeCloseTo(area, 3);
  }
});

test('default factor', () => {
  const lorentzian = new Lorentzian({ fwhm: 10 });
  const data = lorentzian.getData({ height: 1 });

  expect(data).toHaveLength(63663);

  const center = (data.length - 1) / 2;

  expect(data[center]).toBe(1);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo((0.9999 * Math.PI * 10) / 2, 3);
});

test('fwhm 10, factor 500', () => {
  const lorentzian = new Lorentzian({ fwhm: 10 });
  const data = lorentzian.getData({ length: 5000 });

  expect(data).toHaveLength(5000);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(1, 2);
});

test('odd fwhm', () => {
  const lorentzian = new Lorentzian({ fwhm: 11 });
  const data = lorentzian.getData({ length: 11, height: 2 });
  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center]).toBeCloseTo(2, 4);
  expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
  expect(data[center]).toBeGreaterThan(data[center + 1]);
});

test('even fwhm', () => {
  const lorentzian = new Lorentzian({ fwhm: 10 });
  const data = lorentzian.getData({ length: 10, height: 1 });
  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center]).toBeCloseTo(data[center + 1], 4);
  expect(data[0]).toBeCloseTo(data.at(-1), 4);
});

test('width To fwhm', () => {
  const lorentzian = new Lorentzian({ fwhm: 100 });
  const width = 20;

  expect(lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
  expect(lorentzian.widthToFWHM(width)).toBe(lorentzianWidthToFWHM(width));
});

test('fwhm to width', () => {
  const lorentzian = new Lorentzian({ fwhm: 100 });
  const fwhm = 20;

  expect(lorentzian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_THREE);

  lorentzian.fwhm = fwhm;

  expect(lorentzian.fwhmToWidth()).toBe(lorentzianFwhmToWidth(fwhm));
});

test('change height should change area', () => {
  const lorentzian = new Lorentzian({ fwhm: 100 });
  const area = lorentzian.getArea();

  expect(lorentzian.getArea(2)).toBeCloseTo(2 * area, 4);
});
