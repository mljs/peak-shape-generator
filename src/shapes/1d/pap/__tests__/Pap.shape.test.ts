import { expect, test } from 'vitest';

import { getShape1D } from '../../getShape1D.ts';
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

/**
 * Composite Simpson rule over [lo, hi].
 * @param funct - function to integrate.
 * @param lo - lower bound.
 * @param hi - upper bound.
 * @param n - number of sample points (odd).
 * @returns the numerical integral.
 */
function simpson(
  funct: (x: number) => number,
  lo: number,
  hi: number,
  n = 200_001,
) {
  const dx = (hi - lo) / (n - 1);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const weight = i === 0 || i === n - 1 ? 1 : i % 2 === 1 ? 4 : 2;
    sum += weight * funct(lo + i * dx);
  }
  return (sum * dx) / 3;
}

/**
 * Log-exponent of the Pap area density in the log variable s, with
 * t = e^s = 1 + 2 * a * x / (D * (4 - a^2)) (the peak maximum is t = 1):
 * the area is D(4-a^2)/(2a) * exp(k + (k+1)s - k*exp(s)), whose exponent
 * peaks near 0, so `exp` never overflows even for `k` huge (a close to 0).
 * @param a - asymmetry factor.
 * @param s - logarithm of t.
 * @returns the natural logarithm of the area density.
 */
function logKernelExponent(a: number, s: number) {
  const k = (4 - a * a) / (a * a);

  return k + (k + 1) * s - k * Math.exp(s);
}

/**
 * Integration bounds in s where the log kernel is within 42 orders of
 * magnitude from its maximum, found by geometric expansion from the mode.
 * @param a - asymmetry factor.
 * @returns the lower and upper integration bounds.
 */
function kernelBounds(a: number): [number, number] {
  const exponentAt = (s: number) => logKernelExponent(a, s);
  const k = (4 - a * a) / (a * a);
  const peak = Math.log(1 + 1 / k);
  const peakExponent = exponentAt(peak);
  let step = 1;
  let lo = peak - 1;
  while (exponentAt(lo) > peakExponent - 42) {
    lo -= step;
    step *= 2;
  }
  step = 1;
  let hi = peak + 1;
  while (exponentAt(hi) > peakExponent - 42) {
    hi += step;
    step *= 2;
  }
  return [lo, hi];
}

/**
 * Numerical area from the threshold up to 40 standard deviations to the
 * right, as the s-space Simpson integral of the log kernel (smooth on its
 * whole domain, accurate for every `a` in (0, 2)).
 * @param fwhm - standard deviation.
 * @param a - asymmetry factor.
 * @returns the numerical area of a peak of height 1.
 */
function numericArea(fwhm: number, a: number) {
  const scaled = (fwhm * (4 - a * a)) / (2 * a);
  const [lo, hi] = kernelBounds(a);

  return scaled * simpson((s) => Math.exp(logKernelExponent(a, s)), lo, hi);
}

/**
 * Numerical coverage (area fraction) of the window [threshold, edge].
 * @param fwhm - standard deviation.
 * @param a - asymmetry factor.
 * @param edge - upper end of the window.
 * @returns the covered fraction of the total area.
 */
function numericCoverage(fwhm: number, a: number, edge: number) {
  const [lo] = kernelBounds(a);
  const hi = Math.log(1 + (2 * a * edge) / (fwhm * (4 - a * a)));

  if (hi <= lo) {
    return 0;
  }

  const scaled = (fwhm * (4 - a * a)) / (2 * a);
  const covered =
    scaled * simpson((s) => Math.exp(logKernelExponent(a, s)), lo, hi);

  return covered / numericArea(fwhm, a);
}

test('closed-form area matches numerical integration', () => {
  for (const a of [0.05, 0.2, 0.5, 1, 1.5, 1.9]) {
    const pap = new Pap({ fwhm: 1, a });

    expect(
      Math.abs(pap.getArea(1) - numericArea(1, a)) / numericArea(1, a),
    ).toBeLessThan(1e-5);
  }

  const scaled = new Pap({ fwhm: 2, a: 0.7 });

  expect(
    Math.abs(scaled.getArea(1) - numericArea(2, 0.7)) / numericArea(2, 0.7),
  ).toBeLessThan(1e-5);
});

test('area tends to the Gaussian limit D * sqrt(2 * PI) as a -> 0', () => {
  const pap = new Pap({ fwhm: 1, a: 0.05 });

  expect(pap.getArea(1)).toBeCloseTo(Math.sqrt(2 * Math.PI), 2);
});

test('area, factor and data stay finite for very small asymmetry', () => {
  for (const a of [0.2, 0.1, 0.05, 0.02]) {
    const pap = new Pap({ fwhm: 1, a });

    expect(Number.isFinite(pap.getArea())).toBe(true);
    expect(Number.isFinite(pap.getFactor())).toBe(true);
    expect(Number.isFinite(pap.calculateHeight(1))).toBe(true);
    expect(Number.isFinite(pap.getData()[0])).toBe(true);
  }
});

test('getFactor returns the number of times fwhm covering the requested area', () => {
  for (const a of [0.5, 1, 1.9]) {
    const pap = new Pap({ fwhm: 1, a });
    const factor = pap.getFactor();

    expect(
      Math.abs(numericCoverage(1, a, (factor * 1) / 2) - 0.9999),
    ).toBeLessThan(1e-4);
  }
});

test('getFactor increases with the requested area', () => {
  const pap = new Pap({ fwhm: 1, a: 1 });

  expect(pap.getFactor(0.99)).toBeLessThan(pap.getFactor(0.999));
  expect(pap.getFactor(0.999)).toBeLessThan(pap.getFactor(0.9999));
});

test('getFactor throws for area >= 1', () => {
  const pap = new Pap({ fwhm: 1, a: 1 });

  expect(() => pap.getFactor(1)).toThrow('area should be (0 - 1)');
});

test('default getData window covers 99.99 % of the area (grid precision)', () => {
  for (const a of [1, 1.9]) {
    const pap = new Pap({ fwhm: 1, a });
    const data = pap.getData();
    const edge = (data.length - 1) / 2;

    expect(numericCoverage(1, a, edge)).toBeGreaterThan(0.999);
  }
});

interface Moments {
  mean: number;
  variance: number;
  skewness: number;
  excess: number;
}

function measureMoments(pap: Pap, lo: number, hi: number, n: number): Moments {
  const h = pap.calculateHeight(1);
  const dx = (hi - lo) / (n - 1);
  let area = 0;
  let m1 = 0;
  for (let i = 0; i < n; i++) {
    const x = lo + i * dx;
    const y = pap.fct(x) * h;
    area += y * dx;
    m1 += x * y * dx;
  }
  m1 /= area;
  let m2 = 0;
  let m3 = 0;
  let m4 = 0;
  for (let i = 0; i < n; i++) {
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

  return {
    mean: m1,
    variance: m2,
    skewness: m3 / m2 ** 1.5,
    excess: m4 / (m2 * m2) - 3,
  };
}

test('moments match the paper', () => {
  const a = 1.2;
  const pap = new Pap({ fwhm: 1, a });
  const { mean, variance, skewness, excess } = measureMoments(
    pap,
    -20,
    20,
    400001,
  );

  expect(mean).toBeCloseTo(a / 2, 2);
  expect(variance).toBeCloseTo(1, 2);
  expect(skewness).toBeCloseTo(a, 2);
  expect(excess).toBeCloseTo(1.5 * a * a, 2);
});

test('moments match the paper across the asymmetry range', () => {
  for (const a of [0.3, 1.8]) {
    const pap = new Pap({ fwhm: 1, a });
    const { mean, variance, skewness, excess } = measureMoments(
      pap,
      -40,
      40,
      400001,
    );

    expect(mean).toBeCloseTo(a / 2, 2);
    expect(variance).toBeCloseTo(1, 2);
    expect(skewness).toBeCloseTo(a, 2);
    expect(excess).toBeCloseTo(1.5 * a * a, 2);
  }
});

test('pap has a single peak: rising before M, falling after M', () => {
  for (const a of [0.6, 1.4]) {
    const pap = new Pap({ fwhm: 1, a });
    const threshold = -(4 - a * a) / (2 * a);
    const risings = 200;
    const fallings = 600;

    let previous = 0;
    for (let i = 1; i <= risings; i++) {
      const x = threshold + (-threshold * i) / risings;
      const y = pap.fct(x);

      expect(y).toBeGreaterThan(previous);

      previous = y;
    }

    previous = 1;
    for (let i = 1; i <= fallings; i++) {
      const x = (6 * i) / fallings;
      const y = pap.fct(x);

      expect(y).toBeLessThanOrEqual(previous);

      previous = y;
    }
  }
});

test('constructor validates a in (0, 2) and fwhm > 0', () => {
  expect(() => new Pap({ fwhm: 1, a: 0 })).toThrow('a should be (0 - 2)');
  expect(() => new Pap({ fwhm: 1, a: 2 })).toThrow('a should be (0 - 2)');
  expect(() => new Pap({ fwhm: 1, a: -0.5 })).toThrow('a should be (0 - 2)');
  expect(() => new Pap({ fwhm: 1, a: 2.5 })).toThrow('a should be (0 - 2)');
  expect(() => new Pap({ fwhm: 0, a: 1 })).toThrow('fwhm should be > 0');
  expect(() => new Pap({ fwhm: -3, a: 1 })).toThrow('fwhm should be > 0');
});

test('round trip through getShape1D', () => {
  const pap = new Pap({ fwhm: 7, a: 0.7 });
  const restored = getShape1D(pap.toJSON());

  expect(restored).toBeInstanceOf(Pap);
  expect(restored.fct(3)).toBeCloseTo(pap.fct(3), 12);
  expect(restored.toJSON()).toStrictEqual(pap.toJSON());
});

test('calculatePapHeight consistent', () => {
  const h = calculatePapHeight({ fwhm: 3, a: 0.8, area: 2 });
  const pap = new Pap({ fwhm: 3, a: 0.8 });

  expect(pap.getArea(h)).toBeCloseTo(2, 6);
});
