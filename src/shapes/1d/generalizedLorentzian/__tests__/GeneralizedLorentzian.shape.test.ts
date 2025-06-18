import {
  GeneralizedLorentzian,
  calculateGeneralizedLorentzianHeight,
  getGeneralizedLorentzianArea,
  generalizedLorentzianFct,
  generalizedLorentzianFwhmToWidth,
  generalizedLorentzianWidthToFWHM,
  getGeneralizedLorentzianFactor,
  getGeneralizedLorentzianData,
} from '../GeneralizedLorentzian';

describe('lorentzian', () => {
  it('default factor area', () => {
    const lorentzian = new GeneralizedLorentzian({ fwhm: 3, gamma: 2 });
    const data = lorentzian.getData({
      length: 256,
      height: lorentzian.calculateHeight(),
    });
    const area = data.reduce((a, b) => a + b, 0);
    expect(area).toBeCloseTo(1);
    const data2 = lorentzian.getData({
      height: lorentzian.calculateHeight(2),
    });
    const area2 = data2.reduce((a, b) => a + b, 0);
    expect(area2).toBeCloseTo(2);
    const expectedArea = 1;
    const height = lorentzian.calculateHeight(expectedArea);
    const computedArea = lorentzian.getArea(height);
    expect(computedArea).toBeCloseTo(expectedArea, 2);
  });
});

describe('GeneralizedLorentzian class and utilities', () => {
  it('constructor sets defaults and custom values', () => {
    const def = new GeneralizedLorentzian();
    expect(def.fwhm).toBe(500);
    expect(def.gamma).toBe(0.5);
    const custom = new GeneralizedLorentzian({ fwhm: 10, gamma: 1.5 });
    expect(custom.fwhm).toBe(10);
    expect(custom.gamma).toBe(1.5);
  });

  it('fwhmToWidth and widthToFWHM are inverses', () => {
    const gLorentzian = new GeneralizedLorentzian({ fwhm: 9 });
    const width = gLorentzian.fwhmToWidth();
    expect(gLorentzian.widthToFWHM(width)).toBeCloseTo(9);
  });

  it('fct returns expected value for known input', () => {
    const gLorentzian = new GeneralizedLorentzian({ fwhm: 2, gamma: 1 });
    const val = gLorentzian.fct(0);
    expect(typeof val).toBe('number');
    expect(val).toBeGreaterThan(0);
  });

  it('getArea and calculateHeight are consistent', () => {
    const gLorentzian = new GeneralizedLorentzian({ fwhm: 3, gamma: 0.5 });
    const area = 1;
    expect(gLorentzian.getArea(gLorentzian.calculateHeight(area))).toBe(area);
    const height = 1;
    expect(gLorentzian.calculateHeight(gLorentzian.getArea(height))).toBe(
      height,
    );
    // area and height should be proportional
    expect(gLorentzian.getArea(2) / gLorentzian.getArea(1)).toBe(2);
  });

  it('getGeneralizedLorentzianFactor throws for area >= 1', () => {
    expect(() => getGeneralizedLorentzianFactor(1)).toThrow();
    expect(() => getGeneralizedLorentzianFactor(1.1)).toThrow();
  });

  it('getGeneralizedLorentzianFactor returns number for area < 1', () => {
    expect(typeof getGeneralizedLorentzianFactor(0.5)).toBe('number');
    const gLorentzian = new GeneralizedLorentzian({ fwhm: 3, gamma: 0.5 });
    expect(typeof gLorentzian.getFactor(0.5)).toBe('number');
  });

  it('getGeneralizedLorentzianData returns symmetric data', () => {
    const data = getGeneralizedLorentzianData(
      { fwhm: 5, gamma: 1 },
      { length: 11 },
    );
    expect(data.length).toBe(11);
    for (let i = 0; i < data.length / 2; i++) {
      expect(data[i]).toBeCloseTo(data[data.length - 1 - i]);
    }
  });

  it('getGeneralizedLorentzianData computes length if not provided', () => {
    const data = getGeneralizedLorentzianData({ fwhm: 2, gamma: 0.5 }, {});
    expect(data.length % 2).toBe(1); // should be odd
    expect(data.length).toBeGreaterThan(0);
  });

  it('getParameters returns correct parameter names', () => {
    const gLorentzian = new GeneralizedLorentzian();
    expect(gLorentzian.getParameters()).toEqual(['fwhm', 'gamma']);
  });

  it('utility functions: fwhm/width conversion', () => {
    const fwhm = 7;
    const width = generalizedLorentzianFwhmToWidth(fwhm);
    expect(generalizedLorentzianWidthToFWHM(width)).toBeCloseTo(fwhm);
  });

  it('generalizedLorentzianFct returns finite number', () => {
    expect(Number.isFinite(generalizedLorentzianFct(0, 1, 1))).toBe(true);
    expect(Number.isFinite(generalizedLorentzianFct(1, 2, 0.5))).toBe(true);
  });

  it('getGeneralizedLorentzianArea matches manual calculation', () => {
    const area = getGeneralizedLorentzianArea({ fwhm: 2, height: 3, gamma: 1 });
    expect(area).toBeCloseTo((3 * 2 * (3.14159 - 0.420894 * 1)) / 2);
  });

  it('calculateGeneralizedLorentzianHeight matches manual calculation', () => {
    const h = calculateGeneralizedLorentzianHeight({
      fwhm: 2,
      area: 3,
      gamma: 1,
    });
    expect(h).toBeCloseTo((3 / 2 / (3.14159 - 0.420894 * 1)) * 2);
  });
});
