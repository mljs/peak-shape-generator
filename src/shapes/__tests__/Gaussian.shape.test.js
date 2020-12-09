import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian.shape', () => {
  it('check gaussian continuous', () => {
    let gaussianShape = gaussianShape({ factor: 1, fwhm: 5900 });

    let y = Array.from(gaussianShape.data);
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

    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    let shape = shape({ fwhm: 50, normalized: true });
    expect(shape.fwhm).toBe(50);
    expect(shape.data).toHaveLength(195);
    let area = shape.data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9999, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    let data = shape({ sd, height }).data;
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(height, 2);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(height * Math.sqrt(2 * Math.PI) * sd, 2);
  });

  it('odd fwhm', () => {
    let data = shape({ fwhm: 101, length: 101 }).data;
    expect(data).toHaveLength(101);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let data = shape({ fwhm: 100, length: 100 }).data;
    expect(data).toHaveLength(100);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
});
