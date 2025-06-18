import { ROOT_THREE } from '../../../../util/constants';
import { LorentzianDispersive } from '../LorentzianDispersive';

describe('lorentzian', () => {
  it('default factor area', () => {
    const lorentzian = new LorentzianDispersive();
    const data = lorentzian.getData();
    expect(data).toHaveLength(3183099);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0, 5);
    const expectedArea = 0;
    const height = lorentzian.calculateHeight(expectedArea);
    const computedArea = lorentzian.getArea(height);
    expect(computedArea).toBeCloseTo(expectedArea, 2);
    expect(lorentzian.getParameters()).toStrictEqual(['fwhm']);

    const width = 20;
    expect(lorentzian.widthToFWHM(width)).toBe(width * ROOT_THREE);
    expect(lorentzian.fwhmToWidth(lorentzian.widthToFWHM(width))).toBe(width);
  });
  it('differents factor', () => {
    const lorentzian = new LorentzianDispersive({ fwhm: 1000 });
    //areas coverage by the real part of the lorentzian
    const areas = [0.98, 0.96, 0.7, 0.4, 0.2];
    for (let area of areas) {
      const data = lorentzian.getData({ factor: lorentzian.getFactor(area) });
      const sum = data.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(0, 3);
    }
  });
  it('default factor', () => {
    const fwhm = 10;
    const lorentzian = new LorentzianDispersive({ fwhm });
    const data = lorentzian.getData({ height: 1 });
    expect(data).toHaveLength(63663);
    const center = (data.length - 1) / 2;
    expect(Math.abs(data[center])).toBe(0);
    expect(data[center + fwhm / 2]).toBe(0.5);
    expect(data[center - fwhm / 2]).toBe(-0.5);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0, 5);
  });
  it('fwhm 10, factor 500', () => {
    const fwhm = 10;
    const lorentzian = new LorentzianDispersive({ fwhm });
    const length = 5001;
    const data = lorentzian.getData({ length });
    const height = lorentzian.calculateHeight();
    const center = Math.floor((length - 1) / 2);
    expect(Math.abs(data[center])).toBe(0);
    expect(data[center - fwhm / 2]).toBe(-height / 2);
    expect(data[center + fwhm / 2]).toBe(height / 2);
    expect(data).toHaveLength(length);
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(0, 2);
  });
  it('odd fwhm', () => {
    const lorentzian = new LorentzianDispersive({ fwhm: 11 });
    const data = lorentzian.getData({ length: 11, height: 2 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(0, 4);
    expect(data[center - 1]).toBeCloseTo(-data[center + 1], 4);
    expect(data[center]).toBeGreaterThan(data[center - 1]);
    expect(data[center]).toBeLessThan(data[center + 1]);
  });
  it('even fwhm', () => {
    const lorentzian = new LorentzianDispersive({ fwhm: 10 });
    const data = lorentzian.getData({ length: 10, height: 1 });
    const lenG = data.length;
    const center = Math.floor((lenG - 1) / 2);
    expect(data[center]).toBeCloseTo(-data[center + 1], 4);
    // in the infinity both should be zero but in the practice:
    expect(data[0]).toBeCloseTo(-data[data.length - 1], 4);
  });
});
