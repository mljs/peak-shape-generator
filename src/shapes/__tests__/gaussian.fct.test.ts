
import * as gaussian from '../gaussian';

describe('Gaussian function', () => {
  it('gaussian.fct', () => {
    expect(gaussian.fct(0.2, 0)).toBeCloseTo(1);
    expect(gaussian.fct(0.2, 0.1)).toBeCloseTo(0.5);
  });
});
