import { ROOT_THREE } from '../../../../util/constants';
import { Lorentzian } from '../Lorentzian';

describe('lorentzian', () => {
  it('default factor area', () => {
    const data = Lorentzian.getData();
    expect(data).toHaveLength(3183099);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 5);
    const fwhm = 500;
    const height = 2 / Math.PI / fwhm;
    const computedArea = Lorentzian.getArea({ fwhm, height });
    expect(computedArea).toBeCloseTo(1, 2);
  });
  it('default factor', () => {
    const data = Lorentzian.getData({ fwhm: 10 }, { height: 1 });
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo((0.9999 * Math.PI * 10) / 2, 3);
  });
  it('fwhm 10, factor 500', () => {
    const data = Lorentzian.getData({ fwhm: 10 }, { length: 5000 });
    expect(data).toHaveLength(5000);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    const data = Lorentzian.getData({ fwhm: 11 }, { length: 11, height: 2 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(2, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const data = Lorentzian.getData({ fwhm: 10 }, { length: 10, height: 1 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const width = 20;
    expect(Lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
  });
  it('fwhm to width', () => {
    const fwhm = 20;
    expect(Lorentzian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_THREE);
  });
  it('change height should change area', () => {
    const area = Lorentzian.getArea({ fwhm: 100, height: 1 });
    expect(Lorentzian.getArea({ fwhm: 100, height: 2 })).toBeCloseTo(
      2 * area,
      4,
    );
  });
});
