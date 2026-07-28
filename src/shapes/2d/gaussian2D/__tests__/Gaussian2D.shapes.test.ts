import { expect, test } from 'vitest';

import { ROOT_2LN2 } from '../../../../util/constants.ts';
import {
  gaussianFwhmToWidth,
  gaussianWidthToFWHM,
  getGaussianFactor,
} from '../../../1d/gaussian/Gaussian.ts';
import { Gaussian2D } from '../Gaussian2D.ts';

test('height 1', () => {
  const gaussian2D = new Gaussian2D({
    fwhm: 10,
  });
  const data = gaussian2D.getData({ height: 1 });

  expect(data).toHaveLength(35);

  const xCenter = (data.length - 1) / 2;
  const yCenter = (data[0].length - 1) / 2;

  expect(data[xCenter][yCenter]).toBe(1);

  const volume = getVolume(data);

  expect(volume).toBeCloseTo(((100 * Math.PI) / Math.LN2 / 4) * 0.9999, 2);
});

test('check gaussian2D continuous', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 59 });
  const y = gaussian2D.getData({ factor: 1 });
  const nbChanges = getNbChanges(y[(y.length - 1) / 2]);

  expect(nbChanges).toBe(2);
});

test('fwhm fixed and normalized', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 50 });
  const data = gaussian2D.getData();

  expect(data).toHaveLength(173);

  const volume = getVolume(data);

  expect(volume).toBeCloseTo(0.9999, 4);

  const computeSurface = gaussian2D.getVolume();

  expect(computeSurface).toBeCloseTo(1, 2);
});

test('sd fixed', () => {
  const sd = 50;
  const height = 3;
  const gaussian2D = new Gaussian2D({ sd });
  const data = gaussian2D.getData({ height });
  const center = (data.length - 1) / 2;

  expect(data[center][center]).toBeCloseTo(3, 3);
  expect(data[center][0]).toBeCloseTo(gaussian2D.fct(0, -center) * height);
  expect(data[center][center]).toBeCloseTo(height, 2);

  const volume = getVolume(data);

  expect(volume).toBeCloseTo(height * 2 * Math.PI * sd * sd * 0.9999, 0);
});

test('odd fwhm', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 101 });
  const data = gaussian2D.getData({ length: 101, height: 1 });

  expect(data).toHaveLength(101);

  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center][center]).toBeCloseTo(1, 4);
  expect(data[center - 1][center]).toBeCloseTo(data[center + 1][center], 4);
  expect(data[center][center]).toBeGreaterThan(data[center + 1][center]);
});

test('even fwhm', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });
  const data = gaussian2D.getData({ length: 100, height: 1 });

  expect(data).toHaveLength(100);

  const lenG = data.length;
  const center = Math.floor((lenG - 1) / 2);

  expect(data[center][center]).toBeCloseTo(data[center + 1][center], 4);
  expect(data[0][center]).toBeCloseTo(data.at(-1)[center], 4);
});

test('width To fwhm', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });
  const width = 20;

  expect(gaussian2D.widthToFWHM(width)).toBe(width * ROOT_2LN2);
  expect(gaussian2D.widthToFWHM(width)).toBe(gaussianWidthToFWHM(width));
});

test('fwhm to width', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });
  const fwhm = 20;

  expect(gaussian2D.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);

  gaussian2D.fwhm = fwhm;

  expect(gaussian2D.fwhmToWidth(fwhm)).toBe(gaussianFwhmToWidth(fwhm));
});

test('change height should change area', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });
  const volume = gaussian2D.getVolume(1);

  expect(gaussian2D.getVolume(2)).toBeCloseTo(2 * volume, 4);
});

test('factor covers the requested volume', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });
  const volumes = [0.98, 0.96, 0.7, 0.4, 0.2];
  for (const volume of volumes) {
    const data = gaussian2D.getData({
      factor: gaussian2D.getFactor(volume),
    });

    expect(getVolume(data)).toBeCloseTo(volume, 2);
  }
});

test('factor covers the square root of the volume on each axis', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });

  expect(gaussian2D.getFactor(0.9)).toBeCloseTo(
    getGaussianFactor(Math.sqrt(0.9)),
    10,
  );
});

test('default factor is finite', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });

  expect(gaussian2D.getFactor()).toBeCloseTo(3.4383781513674276);
});

test('factor throws when the volume cannot be reached', () => {
  const gaussian2D = new Gaussian2D({ fwhm: 100 });

  expect(() => gaussian2D.getFactor(1)).toThrow('volume should be (0 - 1)');
});

function getVolume(data: Float64Array[]) {
  let volume = 0;
  for (const row of data) {
    for (let j = 0; j < data[0].length; j++) {
      volume += row[j];
    }
  }
  return volume;
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
