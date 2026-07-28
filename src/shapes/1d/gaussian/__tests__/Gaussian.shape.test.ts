import { expect, test } from 'vitest';

import { ROOT_2LN2, ROOT_PI_OVER_LN2 } from '../../../../util/constants.ts';
import { pseudoVoigtFindFactor } from '../../pseudoVoigt/computeFactor.ts';
import {
  Gaussian,
  calculateGaussianHeight,
  gaussianFwhmToWidth,
  gaussianWidthToFWHM,
} from '../Gaussian.ts';

test('height 1', () => {
  const gaussian = new Gaussian({ fwhm: 10 });
  const data = gaussian.getData({ height: 1 });

  expect(data).toHaveLength(33);

  const center = (data.length - 1) / 2;

  expect(data[center]).toBe(1);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(((ROOT_PI_OVER_LN2 * 10) / 2) * 0.9999, 3);
  expect(gaussian.getParameters()).toStrictEqual(['fwhm']);
});

test('check gaussian continuous', () => {
  const gaussian = new Gaussian({ fwhm: 5900 });
  const y = gaussian.getData({ factor: 1 });
  const nbChanges = getNbChanges(y);

  expect(nbChanges).toBe(2);
});

test('fwhm fixed and normalized', () => {
  const gaussian = new Gaussian({ fwhm: 50 });
  const data = gaussian.getData();

  expect(data).toHaveLength(165);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(0.9999, 4);

  const computedArea = gaussian.getArea();

  expect(computedArea).toBeCloseTo(1, 2);
});

test('sd fixed', () => {
  const sd = 50;
  const height = 3;
  const gaussian = new Gaussian({ sd });
  const data = gaussian.getData({ height });
  const center = Math.floor((data.length - 1) / 2);

  expect(data[center]).toBeCloseTo(height, 2);

  const area = data.reduce((a, b) => a + b, 0);

  expect(area).toBeCloseTo(height * Math.sqrt(2 * Math.PI) * sd * 0.9999, 2);
});

test('odd fwhm', () => {
  const gaussian = new Gaussian({ fwhm: 101 });
  const data = gaussian.getData({ length: 101, height: 1 });

  expect(data).toHaveLength(101);

  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center]).toBeCloseTo(1, 4);
  expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
  expect(data[center]).toBeGreaterThan(data[center + 1]);
});

test('even fwhm', () => {
  const gaussian = new Gaussian({ fwhm: 100 });
  const data = gaussian.getData({ length: 100, height: 1 });

  expect(data).toHaveLength(100);

  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center]).toBeCloseTo(data[center + 1], 4);
  expect(data[0]).toBeCloseTo(data.at(-1), 4);
});

test('width To fwhm', () => {
  const gaussian = new Gaussian({ fwhm: 100 });
  const width = 20;

  expect(gaussian.widthToFWHM(width)).toBe(width * ROOT_2LN2);
  expect(gaussian.widthToFWHM(width)).toBe(gaussianWidthToFWHM(width));
});

test('fwhm to width', () => {
  const gaussian = new Gaussian({ fwhm: 100 });
  const fwhm = 20;

  expect(gaussian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);

  gaussian.fwhm = fwhm;

  expect(gaussian.fwhmToWidth()).toBe(gaussianFwhmToWidth(fwhm));
});

test('change height should change area', () => {
  const gaussian = new Gaussian({ fwhm: 100 });
  const area = gaussian.getArea(1);

  expect(gaussian.getArea(2)).toBeCloseTo(2 * area, 4);
});

test('height calculations', () => {
  const gaussian = new Gaussian({ fwhm: 100 });
  const heightFromShape = gaussian.calculateHeight();
  const height = calculateGaussianHeight({ fwhm: 100, area: 1 });
  const expectedHeight = 1 / ROOT_PI_OVER_LN2 / 50;

  expect(heightFromShape).toBeCloseTo(height, 4);
  expect(height).toBeCloseTo(expectedHeight, 4);
});

test('factor covers the requested area', () => {
  const gaussian = new Gaussian({ fwhm: 1000 });
  const areas = [0.98, 0.96, 0.7, 0.4, 0.2];
  for (const area of areas) {
    const data = gaussian.getData({ factor: gaussian.getFactor(area) });
    const sum = data.reduce((a, b) => a + b, 0);

    expect(sum).toBeCloseTo(area, 2);
  }
});

test('factor integrates to the requested area', () => {
  const gaussian = new Gaussian({ fwhm: 1 });
  const total = gaussian.getArea(1);
  const areas = [0.2, 0.4, 0.7, 0.9, 0.96, 0.98, 0.995, 0.9999];
  for (const area of areas) {
    const halfWidth = gaussian.getFactor(area) / 2;

    expect(integrate(gaussian, halfWidth) / total).toBeCloseTo(area, 3);
  }
});

test('factor is consistent with the pseudo-Voigt gaussian limit', () => {
  const gaussian = new Gaussian({ fwhm: 1 });
  const areas = [0.2, 0.7, 0.98];
  for (const area of areas) {
    const factor = gaussian.getFactor(area);
    const bisected = pseudoVoigtFindFactor(area, 0.999999);

    // the residual is the accuracy of the erfinv approximation
    expect(Math.abs(factor - bisected) / factor).toBeLessThan(1e-3);
  }
});

test('factor throws when the area cannot be reached', () => {
  const gaussian = new Gaussian({ fwhm: 1 });

  expect(() => gaussian.getFactor(1)).toThrow('area should be (0 - 1)');
  expect(() => gaussian.getFactor(1.2)).toThrow('area should be (0 - 1)');
});

/**
 * Numerically integrate the shape over [-halfWidth, halfWidth] with the
 * trapezoidal rule, independently of any closed-form area formula.
 * @param gaussian - the shape to integrate.
 * @param halfWidth - half of the integration window.
 * @returns the integral over the window.
 */
function integrate(gaussian: Gaussian, halfWidth: number) {
  const nbSteps = 100000;
  const step = (2 * halfWidth) / nbSteps;
  let sum = (gaussian.fct(-halfWidth) + gaussian.fct(halfWidth)) / 2;
  for (let index = 1; index < nbSteps; index++) {
    sum += gaussian.fct(-halfWidth + index * step);
  }
  return sum * step;
}

function getNbChanges(y: Float64Array) {
  const yPrime = [0];

  for (let i = 1; i < y.length; i++) {
    // first derivative
    yPrime[i] = y[i] - y[i - 1];
  }

  let positive = true;
  let nbChanges = 0;
  for (let i = 1; i < yPrime.length; i++) {
    const diff = yPrime[i] - yPrime[i - 1];

    if (diff > 0 && !positive) {
      positive = true;
      nbChanges++;
    }
    if (diff < 0 && positive) {
      positive = false;
      nbChanges++;
    }
  }
  return nbChanges;
}
