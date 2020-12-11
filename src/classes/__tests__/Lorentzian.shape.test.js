import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ROOT_THREE } from '../../util/constants';
import { Lorentzian } from '../Lorentzian';

expect.extend({ toBeDeepCloseTo });

describe('lorentzian', () => {
  it('default factor area', () => {
    let lorentzian = new Lorentzian({});
    let data = lorentzian.getData();
    expect(data).toHaveLength(3183099);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(0.9999, 5);
    let computedArea = lorentzian.getArea();
    expect(computedArea).toBeDeepCloseTo(1, 2);
  });
  it('default factor', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.getData();
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(data[center]).toBe(1);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo((0.9999 * Math.PI * 10) / 2, 3);
  });
  it('fwhm 10, factor 500', () => {
    let lorentzian = new Lorentzian({ fwhm: 10 });
    let data = lorentzian.getData({ length: 5000 });
    expect(data).toHaveLength(5000);
    let area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
  it('odd fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 11, height: 2 });
    let data = lorentzian.getData({ length: 11 });
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(2, 4);
    expect(data[center - 1]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center + 1]);
  });
  it('even fwhm', () => {
    let lorentzian = new Lorentzian({ fwhm: 10, height: 1 });
    let data = lorentzian.getData({ length: 10 });
    let lenG = data.length;
    let center = parseInt((lenG - 1) / 2, 10);
    expect(data[center]).toBeDeepCloseTo(data[center + 1], 4);
    expect(data[0]).toBeDeepCloseTo(data[data.length - 1], 4);
  });
  it('width To fwhm', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const width = 20;
    expect(lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
    expect(lorentzian.widthToFWHM(width)).toBe(Lorentzian.widthToFWHM(width));
  });
  it('fwhm to width', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const fwhm = 20;
    expect(lorentzian.fwhmToWidth(fwhm)).toBe(fwhm / ROOT_THREE);
    lorentzian.setFWHM(fwhm);
    expect(lorentzian.fwhmToWidth()).toBe(Lorentzian.fwhmToWidth(fwhm));
  });
  it('change height should change area', () => {
    const lorentzian = new Lorentzian({ fwhm: 100, height: 1 });
    const area = lorentzian.getArea();
    lorentzian.setHeight(2);
    expect(lorentzian.getArea()).toBeDeepCloseTo(2 * area, 4);
  });
});
