import { ROOT_2LN2, GAUSSIAN_EXP_FACTOR } from '../../util/constants';
import erfinv from '../../util/erfinv';
import * as gaussian2D from '../Gaussian2D';

describe('Gaussian2D.shape', () => {
  it('height 1', () => {
    const data = gaussian2D.getData({ fwhm: 10, height: 1 });
    expect(data).toHaveLength(39);
    const xCenter = (data.length - 1) / 2;
    const yCenter = (data[0].length - 1) / 2;
    expect(data[xCenter][yCenter]).toBe(1);

    const surface = getSurface(data);
    expect(surface).toBeCloseTo((100 * Math.PI) / Math.LN2 / 4, 2);
  });

  it('check gaussian2D continuous', () => {
    const y = gaussian2D.getData({ fwhm: 590, factor: 1 });
    const nbChanges = getNbChanges(y[(y.length - 1) / 2]);
    expect(nbChanges).toBe(2);
  });

  it('fwhm fixed and normalized', () => {
    const fwhm = 50;
    const data = gaussian2D.getData({ fwhm });
    expect(data).toHaveLength(195);
    const surface = data.reduce(
      (a, b) => a + b.reduce((c: number, d: number) => c + d, 0),
      0,
    );
    expect(surface).toBeCloseTo(0.9999, 2);
    const height = -GAUSSIAN_EXP_FACTOR / Math.PI / 50 / 50;
    const computeSurface = gaussian2D.getSurface({ fwhm, height });
    expect(computeSurface).toBeCloseTo(1, 2);
  });

  it('sd fixed', () => {
    const sd = 50;
    const height = 3;
    const data = gaussian2D.getData({ sd, height });
    const center = (data.length - 1) / 2;
    expect(data[center][center]).toBeCloseTo(3, 3);
    const fwhm = gaussian2D.widthToFWHM(sd);
    expect(data[center][0]).toBeCloseTo(
      gaussian2D.fct(0, -center, fwhm, fwhm) * height,
    );
    expect(data[center][center]).toBeCloseTo(height, 2);
    const surface = getSurface(data);
    expect(surface).toBeCloseTo(height * 2 * Math.PI * sd * sd, 0);
  });

  it('odd fwhm', () => {
    const data = gaussian2D.getData({ fwhm: 101, height: 1, length: 101 });
    expect(data).toHaveLength(101);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center][center]).toBeCloseTo(1, 4);
    expect(data[center - 1][center]).toBeCloseTo(data[center + 1][center], 4);
    expect(data[center][center]).toBeGreaterThan(data[center + 1][center]);
  });
  it('even fwhm', () => {
    const data = gaussian2D.getData({ length: 100, fwhm: 100, height: 1 });
    expect(data).toHaveLength(100);
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center][center]).toBeCloseTo(data[center + 1][center], 4);
    expect(data[0][center]).toBeCloseTo(data[data.length - 1][center], 4);
  });
  it('width To fwhm', () => {
    const width = 20;
    expect(gaussian2D.widthToFWHM(width)).toBe(width * ROOT_2LN2);
  });
  it('fwhm to width', () => {
    const fwhm = 20;
    expect(gaussian2D.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_2LN2);
  });
  it('change height should change area', () => {
    const surface = gaussian2D.getSurface({ fwhm: 100, height: 1 });
    expect(gaussian2D.getSurface({ fwhm: 100, height: 2 })).toBeCloseTo(
      2 * surface,
      4,
    );
  });
  it('factor should be close', () => {
    for (let i = 1; i < 11; i++) {
      const surface = i * 0.1;
      expect(gaussian2D.getFactor(surface)).toBeCloseTo(
        Math.sqrt(2) * erfinv(surface),
        1,
      );
    }
  });
});

function getSurface(data: Array<Float64Array>) {
  let surface = 0;
  for (const row of data) {
    for (let j = 0; j < data[0].length; j++) {
      surface += row[j];
    }
  }
  return surface;
}

function getNbChanges(y: Array<number>) {
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
