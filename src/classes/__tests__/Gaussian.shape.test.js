import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ROOT_PI_OVER_LN2 } from '../../util/constants';
import { Gaussian } from '../Gaussian';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian.shape', () => {
  it('height 1', () => {
    let gaussian = new Gaussian({ fwhm: 10, height: 1 });
    let data = gaussian.shape();
    expect(data).toHaveLength(39);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo((ROOT_PI_OVER_LN2 * 10) / 2, 3);
  });

  it('check gaussian continuous', () => {
    const gaussian = new Gaussian({ fwhm: 5900 });
    let y = gaussian.shape({ factor: 1 });
    const nbChanges = getNbChanges(y);
    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    const gaussian = new Gaussian({ fwhm: 50 });
    let shape = gaussian.shape();
    expect(shape).toHaveLength(195);
    let area = shape.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9999, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    const gaussian = new Gaussian({ sd, height });
    let data = gaussian.shape();
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(height, 2);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(height * Math.sqrt(2 * Math.PI) * sd, 2);
  });

  it('odd fwhm', () => {
    const gaussian = new Gaussian({ fwhm: 101, height: 1 });
    let data = gaussian.shape({ length: 101 });
    expect(data).toHaveLength(101);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const gaussian = new Gaussian({ fwhm: 100, height: 1 });
    let data = gaussian.shape({ length: 100 });
    expect(data).toHaveLength(100);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});

function getNbChanges(y) {
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
