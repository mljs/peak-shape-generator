import { expect, test } from 'vitest';

import { Pap, calculatePapHeight } from '../Pap.ts';

test('parameters', () => {
  const pap = new Pap({ fwhm: 10, a: 1 });

  expect(pap.getParameters()).toStrictEqual(['fwhm', 'a']);
});

test('height 1 keeps peak height 1', () => {
  const pap = new Pap({ fwhm: 10, a: 1 });
  const data = pap.getData({ height: 1 });
  const center = (data.length - 1) / 2;

  expect(data[center]).toBe(1);
});

test('area matches height', () => {
  const pap = new Pap({ fwhm: 2, a: 1 });
  const h = pap.calculateHeight(1);
  const area = pap.getArea(h);

  expect(area).toBeCloseTo(1, 6);
});

test('round trip through JSON', () => {
  const pap = new Pap({ fwhm: 7, a: 0.7 });
  const restored = new Pap(structuredClone(pap.toJSON()));

  expect(restored.fct(0)).toBeCloseTo(pap.fct(0), 6);
  expect(restored.fct(3)).toBeCloseTo(pap.fct(3), 6);
});

test('threshold: zero below M - D(4-a^2)/(2a)', () => {
  const pap = new Pap({ fwhm: 1, a: 1 });
  const thr = -(4 - 1) / 2;

  expect(pap.fct(thr - 0.1)).toBe(0);
  expect(pap.fct(thr + 0.1)).toBeGreaterThan(0);
});

test('moments match the paper', () => {
  const a = 1.2;
  const pap = new Pap({ fwhm: 1, a });
  const h = pap.calculateHeight(1);
  const N = 400001;
  const lo = -20;
  const hi = 20;
  const dx = (hi - lo) / (N - 1);
  let area = 0;
  let m1 = 0;
  for (let i = 0; i < N; i++) {
    const x = lo + i * dx;
    const y = pap.fct(x) * h;
    area += y * dx;
    m1 += x * y * dx;
  }
  m1 /= area;
  let m2 = 0;
  let m3 = 0;
  let m4 = 0;
  for (let i = 0; i < N; i++) {
    const x = lo + i * dx;
    const y = pap.fct(x) * h;
    const d = x - m1;
    m2 += d * d * y * dx;
    m3 += d * d * d * y * dx;
    m4 += d * d * d * d * y * dx;
  }
  m2 /= area;
  m3 /= area;
  m4 /= area;
  const skew = m3 / m2 ** 1.5;
  const excess = m4 / (m2 * m2) - 3;

  expect(m1).toBeCloseTo(a / 2, 2);
  expect(m2).toBeCloseTo(1, 2);
  expect(skew).toBeCloseTo(a, 2);
  expect(excess).toBeCloseTo(1.5 * a * a, 2);
});

test('calculatePapHeight consistent', () => {
  const h = calculatePapHeight({ fwhm: 3, a: 0.8, area: 2 });
  const pap = new Pap({ fwhm: 3, a: 0.8 });

  expect(pap.getArea(h)).toBeCloseTo(2, 6);
});
