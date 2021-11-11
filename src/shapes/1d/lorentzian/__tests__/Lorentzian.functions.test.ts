import { ROOT_THREE } from '../../../../util/constants';
import * as lorentzian from '../Lorentzian';

describe('lorentzian', () => {
  it('default factor area', () => {
    const data = lorentzian.getData();
    expect(data).toHaveLength(3183099);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 5);
    const fwhm = 500;
    const height = 2 / Math.PI / fwhm;
    const computedArea = lorentzian.getArea({ fwhm, height });
    expect(computedArea).toBeCloseTo(1, 2);
  });
  it('default factor', () => {
    const data = lorentzian.getData({ fwhm: 10, height: 1 });
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo((0.9999 * Math.PI * 10) / 2, 3);
  });
  it('fwhm 10, factor 500', () => {
    const data = lorentzian.getData({ fwhm: 10 }, { length: 5000 });
    expect(data).toHaveLength(5000);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    const data = lorentzian.getData({ fwhm: 11, height: 2 }, { length: 11 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(2, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const data = lorentzian.getData({ fwhm: 10, height: 1 }, { length: 10 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const width = 20;
    expect(lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
  });
  it('fwhm to width', () => {
    const fwhm = 20;
    expect(lorentzian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_THREE);
  });
  it('change height should change area', () => {
    const area = lorentzian.getArea({ fwhm: 100, height: 1 });
    expect(lorentzian.getArea({ fwhm: 100, height: 2 })).toBeCloseTo(
      2 * area,
      4,
    );
  });
});
