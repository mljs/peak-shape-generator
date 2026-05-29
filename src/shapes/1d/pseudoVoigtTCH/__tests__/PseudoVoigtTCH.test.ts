import { expect, test } from 'vitest';

import { PseudoVoigtTCH } from '../PseudoVoigtTCH.ts';

test('constructor with fwhmG and fwhmL derives effectiveFwhm and mu', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 100 });

  // TCH formula: (1 + 2.69269 + 2.42843 + 4.47163 + 0.07842 + 1)^0.2 * 100 ≈ 163.46
  expect(shape.fwhm).toBeCloseTo(163.46, 1);
  expect(shape.fwhmG).toBe(100);
  expect(shape.fwhmL).toBe(100);
  expect(shape.mu).toBeGreaterThan(0);
  expect(shape.mu).toBeLessThan(1);
});

test('constructor with fwhm only uses mu default 0.5', () => {
  const shape = new PseudoVoigtTCH({ fwhm: 200 });

  expect(shape.fwhm).toBe(200);
  expect(shape.fwhmG + shape.fwhmL).toBeCloseTo(200, 4);
});

test('pure gaussian (fwhmL = 0) gives mu close to 1', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 0.0001 });

  expect(shape.mu).toBeCloseTo(1, 1);
});

test('pure lorentzian (fwhmG = 0) gives mu close to 0', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 0.0001, fwhmL: 100 });

  expect(shape.mu).toBeCloseTo(0, 1);
});

test('setting fwhmG updates effectiveFwhm, mu, and fwhmL stays', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 50 });
  const prevFwhmL = shape.fwhmL;
  shape.fwhmG = 200;

  expect(shape.fwhmL).toBe(prevFwhmL);
  expect(shape.fwhm).toBeGreaterThan(200);
});

test('setting fwhmL updates effectiveFwhm and mu', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 50 });
  shape.fwhmL = 100;

  expect(shape.fwhmL).toBe(100);
  expect(shape.fwhmG).toBe(100);
});

test('setting mu redistributes fwhmG and fwhmL', () => {
  const shape = new PseudoVoigtTCH({ fwhm: 100 });
  shape.mu = 0.8;

  expect(shape.mu).toBeCloseTo(0.8, 4);
  expect(shape.fwhmG + shape.fwhmL).toBeCloseTo(100, 4);
});

test('setting fwhm scales fwhmG and fwhmL proportionally', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 60, fwhmL: 40 });
  const prevRatio = shape.fwhmL / shape.fwhm;
  shape.fwhm = 200;

  expect(shape.fwhm).toBe(200);
  expect(shape.fwhmL / shape.fwhm).toBeCloseTo(prevRatio, 4);
});

test('getParameters returns fwhmG and fwhmL', () => {
  expect(new PseudoVoigtTCH().getParameters()).toStrictEqual([
    'fwhmG',
    'fwhmL',
  ]);
});

test('fct is normalised to 1 at x=0', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 100 });

  expect(shape.fct(0)).toBeCloseTo(1, 5);
});

test('getData produces symmetric array with peak at centre', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 50, fwhmL: 50 });
  const data = shape.getData({ height: 1 });
  const center = Math.floor((data.length - 1) / 2);

  expect(data[center]).toBeCloseTo(1, 4);
  expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
});

test('getArea and calculateHeight are consistent', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 80, fwhmL: 40 });
  const height = shape.calculateHeight(1);

  expect(shape.getArea(height)).toBeCloseTo(1, 4);
});

test('widthToFWHM and fwhmToWidth are inverses', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 60 });
  const width = shape.fwhmToWidth();

  expect(shape.widthToFWHM(width)).toBeCloseTo(shape.fwhm, 4);
});

test('getFactor returns a finite positive number', () => {
  const shape = new PseudoVoigtTCH({ fwhmG: 100, fwhmL: 100 });

  expect(shape.getFactor(0.9)).toBeGreaterThan(0);
  expect(Number.isFinite(shape.getFactor(0.9))).toBe(true);
  expect(shape.getFactor(0.5)).toBeLessThan(shape.getFactor(0.99));
});
