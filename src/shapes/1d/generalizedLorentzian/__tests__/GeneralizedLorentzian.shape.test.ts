import { GeneralizedLorentzian } from '../GeneralizedLorentzian';

describe('lorentzian', () => {
  it('default factor area', () => {
    const lorentzian = new GeneralizedLorentzian({ fwhm: 1.5, gamma: -1 });
    const data = lorentzian.getData({
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
