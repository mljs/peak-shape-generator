import { ROOT_THREE } from '../../util/constants';
import { Lorentzian, fwhmToWidth, widthToFWHM } from '../Lorentzian';

describe('lorentzian', () => {
  it('default factor area', () => {
    let lorentzian = new Lorentzian({});
    let data = lorentzian.getData();
    expect(data).toHaveLength(3183099);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0.9999, 5);
    let computedArea = lorentzian.getArea();
    expect(computedArea).toBeCloseTo(1, 2);
  });
  it('default factor', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.getData();
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo((0.9999 * Math.PI * 10) / 2, 3);
  });
  it('fwhm 10, factor 500', () => {
    let lorentzian = new Lorentzian({ fwhm: 10 });
    let data = lorentzian.getData({ length: 5000 });
    expect(data).toHaveLength(5000);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 11, height: 2 });
    let data = lorentzian.getData({ length: 11 });
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(2, 4);
    expect(data[center - 1]).toBeCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.getData({ length: 10 });
    let lenG = data.length;
    let center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(data[center + 1], 4);
    expect(data[0]).toBeCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const width = 20;
    expect(lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
    expect(lorentzian.widthToFWHM(width)).toBe(widthToFWHM(width));
  });
  it('fwhm to width', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const fwhm = 20;
    expect(lorentzian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_THREE);
    lorentzian.fwhm = fwhm;
    expect(lorentzian.fwhmToWidth()).toBe(fwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const area = lorentzian.getArea();
    lorentzian.height = 2;
    expect(lorentzian.getArea()).toBeCloseTo(2 * area, 4);
  });
});
