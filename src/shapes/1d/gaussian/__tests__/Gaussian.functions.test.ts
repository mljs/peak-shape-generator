import {
  ROOT_2LN2,
  ROOT_PI_OVER_LN2,
  GAUSSIAN_EXP_FACTOR,
} from '../../../../util/constants';
import erfinv from '../../../../util/erfinv';
import * as gaussian from '../Gaussian';

describe('Gaussian.shape', () => {
  it('height 1', () => {
    const data = gaussian.getData({ fwhm: 10, height: 1 });
    expect(data).toHaveLength(39);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo((ROOT_PI_OVER_LN2 * 10) / 2, 3);
  });

  it('check gaussian continuous', () => {
    const y = gaussian.getData({ fwhm: 5900, factor: 1 });
    const nbChanges = getNbChanges(y);
    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    const fwhm = 50;
    const data = gaussian.getData({ fwhm });
    expect(data).toHaveLength(195);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 2);
    const height = Math.sqrt(-GAUSSIAN_EXP_FACTOR / Math.PI) / fwhm;
    const computedArea = gaussian.getArea({ fwhm, height });
    expect(computedArea).toBeCloseTo(1, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    const data = gaussian.getData({ sd, height });
    const center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeCloseTo(height, 2);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(height * Math.sqrt(2 * Math.PI) * sd, 2);
  });

  it('odd fwhm', () => {
    const data = gaussian.getData({ length: 101, fwhm: 101, height: 1 });
    expect(data).toHaveLength(101);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(1, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const data = gaussian.getData({ length: 100, fwhm: 100, height: 1 });
    expect(data).toHaveLength(100);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const width = 20;
    expect(gaussian.widthToFWHM(width)).toBe(width * ROOT_2LN2);
    expect(gaussian.widthToFWHM(width)).toBe(width * ROOT_2LN2);
  });
  it('fwhm to width', () => {
    const fwhm = 20;
    expect(gaussian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);
  });
  it('change height should change area', () => {
    const area = gaussian.getArea({ fwhm: 100, height: 1 });
    expect(gaussian.getArea({ fwhm: 100, height: 2 })).toBeCloseTo(2 * area, 4);
  });
  it('factor should be close', () => {
    for (let i = 1; i < 11; i++) {
      const area = i * 0.1;
      expect(gaussian.getFactor(area)).toBeCloseTo(
        Math.sqrt(2) * erfinv(area),
        1,
      );
    }
  });
});

function getNbChanges(y: Float64Array | number[]) {
  let yPrime = [0];

  for (let i = 1; i < y.length; i++) {
    // first derivative
    yPrime[i] = y[i] - y[i - 1];
  }

  let positive = true;
  let nbChanges = 0;
  for (let i = 1; i < yPrime.length; i++) {
    let diff = yPrime[i] - yPrime[i - 1];

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
