import * as gaussian2D from '../gaussian2D';

describe('Gaussian2D function', () => {
  it('gaussian2D.fct', () => {
    expect(gaussian2D.fct(0.2, 0.4, 0, 0)).toBeCloseTo(1);
    expect(gaussian2D.fct(0.2, 0.4, 0.1, 0)).toBeCloseTo(0.5);
    expect(gaussian2D.fct(0.2, 0.4, 0, 0.2)).toBeCloseTo(0.5);
  });
});
