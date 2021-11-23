import erfinv from 'compute-erfinv';

import { ROOT_2LN2, ROOT_PI_OVER_LN2 } from '../../../../util/constants';
import {
  Gaussian,
  gaussianFwhmToWidth,
  gaussianWidthToFWHM,
} from '../Gaussian';

describe('Gaussian.shape', () => {
  it('height 1', () => {
    const gaussian = new Gaussian({ fwhm: 10 });
    const data = gaussian.getData({ height: 1 });
    expect(data).toHaveLength(39);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo((ROOT_PI_OVER_LN2 * 10) / 2, 3);
  });

  it('check gaussian continuous', () => {
    const gaussian = new Gaussian({ fwhm: 5900 });
    const y = gaussian.getData({ factor: 1 });
    const nbChanges = getNbChanges(y);
    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    const gaussian = new Gaussian({ fwhm: 50 });
    const data = gaussian.getData();
    expect(data).toHaveLength(195);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 2);
    const computedArea = gaussian.getArea();
    expect(computedArea).toBeCloseTo(1, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    const gaussian = new Gaussian({ sd });
    const data = gaussian.getData({ height });
    const center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeCloseTo(height, 2);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(height * Math.sqrt(2 * Math.PI) * sd, 2);
  });

  it('odd fwhm', () => {
    const gaussian = new Gaussian({ fwhm: 101 });
    const data = gaussian.getData({ length: 101, height: 1 });
    expect(data).toHaveLength(101);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(1, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const gaussian = new Gaussian({ fwhm: 100 });
    const data = gaussian.getData({ length: 100, height: 1 });
    expect(data).toHaveLength(100);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const gaussian = new Gaussian({ fwhm: 100 });
    const width = 20;
    expect(gaussian.widthToFWHM(width)).toBe(width * ROOT_2LN2);
    expect(gaussian.widthToFWHM(width)).toBe(gaussianWidthToFWHM(width));
  });
  it('fwhm to width', () => {
    const gaussian = new Gaussian({ fwhm: 100 });
    const fwhm = 20;
    expect(gaussian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);
    gaussian.fwhm = fwhm;
    expect(gaussian.fwhmToWidth()).toBe(gaussianFwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const gaussian = new Gaussian({ fwhm: 100 });
    const area = gaussian.getArea(1);
    expect(gaussian.getArea(2)).toBeCloseTo(2 * area, 4);
  });
  it('factor should be close', () => {
    const gaussian = new Gaussian({ fwhm: 100 });
    for (let i = 1; i < 11; i++) {
      const area = i * 0.1;
      expect(gaussian.getFactor(area)).toBeCloseTo(
        Math.sqrt(2) * erfinv(area),
        1,
      );
    }
  });
});

function getNbChanges(y: Float64Array) {
  let yPrime = [0];

  for (let i = 1; i < y.length; i++) {
    // first derivative
    yPrime[i] = y[i] - y[i - 1];
  }

  let positive = true;
  let nbChanges = 0;
  for (let i = 1; i < yPrime.length; i++) {
    let diff = yPrime[i] - yPrime[i - 1];

    if (diff > 0 && positive === false) {
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
