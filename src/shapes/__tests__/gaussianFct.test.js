import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussianFct } from '../gaussianFct';

expect.extend({ toBeDeepCloseTo });

describe('gaussianFct', () => {
  it('unit test', () => {
    expect(gaussianFct(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(gaussianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(gaussianFct(0, 2, 0.2, 0.1)).toBeDeepCloseTo(
      gaussianFct(0, 2, 0.2, -0.1),
      2,
    );
  });
});
