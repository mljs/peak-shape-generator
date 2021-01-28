import erfinv from 'compute-erfinv';
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ROOT_2LN2 } from '../../util/constants';
import { Gaussian2D } from '../Gaussian2D';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian2D.shape', () => {
  it('height 1', () => {
    let gaussian2D = new Gaussian2D({
      x: { fwhm: 10 },
      y: { fwhm: 10 },
      height: 1,
    });
    let data = gaussian2D.getData();
    expect(data).toHaveLength(39);
    const xCenter = (data.length - 1) / 2;
    const yCenter = (data[0].length - 1) / 2;
    expect(data[xCenter][yCenter]).toBe(1);

    let volume = getVolume(data);
    expect(volume).toBeDeepCloseTo((100 * Math.PI) / Math.LN2 / 4, 3);
  });

  it('check gaussian2D continuous', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 5900 });
    let y = gaussian2D.getData({ factor: 1 });
    const nbChanges = getNbChanges(y[(y.length - 1) / 2]);
    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    const gaussian2D = new Gaussian2D({ x: { fwhm: 50 }, y: { fwhm: 50 } });
    let data = gaussian2D.getData();
    expect(data).toHaveLength(195);
    let volume = data.reduce((a, b) => a + b.reduce((c, d) => c + d, 0), 0);
    expect(volume).toBeDeepCloseTo(0.9999, 2);
    let computedVolume = gaussian2D.getVolume();
    expect(computedVolume).toBeDeepCloseTo(1, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    const gaussian2D = new Gaussian2D({ x: { sd }, y: { sd }, height });
    let data = gaussian2D.getData();
    let center = Math.floor((data.length - 1) / 2);
    expect(data[center][center]).toBeDeepCloseTo(height, 2);
    let volume = getVolume(data);
    expect(volume).toBeDeepCloseTo(height * 2 * Math.PI * sd * sd, 2);
  });

  it('odd fwhm', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 101, height: 1 });
    let data = gaussian2D.getData({ length: 101 });
    expect(data).toHaveLength(101);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center][center]).toBeDeepCloseTo(1, 4);
    expect(data[center - 1][center]).toBeDeepCloseTo(
      data[center + 1][center],
      4,
    );
    expect(data[center][center]).toBeGreaterThan(data[center + 1][center]);
  });
  it('even fwhm', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 100, height: 1 });
    let data = gaussian2D.getData({ length: 100 });
    expect(data).toHaveLength(100);
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center][center]).toBeDeepCloseTo(data[center + 1][center], 4);
    expect(data[0][center]).toBeDeepCloseTo(data[data.length - 1][center], 4);
  });
  it('width To fwhm', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 100, height: 1 });
    const width = 20;
    expect(gaussian2D.widthToFWHM(width)).toBe(width * ROOT_2LN2);
    expect(gaussian2D.widthToFWHM(width)).toBe(Gaussian2D.widthToFWHM(width));
  });
  it('fwhm to width', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 100, height: 1 });
    const fwhm = 20;
    expect(gaussian2D.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);
    gaussian2D.setFWHM(fwhm);
    expect(gaussian2D.fwhmToWidth()).toBe(Gaussian2D.fwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 100, height: 1 });
    const volume = gaussian2D.getVolume();
    gaussian2D.setHeight(2);
    expect(gaussian2D.getVolume()).toBeDeepCloseTo(2 * volume, 4);
  });
  it('factor should be close', () => {
    const gaussian2D = new Gaussian2D({ fwhm: 100, height: 1 });
    for (let i = 1; i < 11; i++) {
      let volume = i * 0.1;
      expect(gaussian2D.getFactor(volume)).toBeDeepCloseTo(
        Math.sqrt(2) * erfinv(volume),
        1,
      );
    }
  });
});

function getVolume(data) {
  let volume = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      volume += data[i][j];
    }
  }
  return volume;
}

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
