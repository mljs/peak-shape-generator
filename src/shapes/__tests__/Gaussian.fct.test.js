import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { Gaussian } from '../Gaussian';

expect.extend({ toBeDeepCloseTo });

describe('Gaussian.fct', () => {
  const gaussianFct = new Gaussian().fct;
  it('unit test', () => {
    expect(gaussianFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(gaussianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(gaussianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      gaussianFct(0, 2, 0.2, -0.1),
      2,
    );
  });
});
