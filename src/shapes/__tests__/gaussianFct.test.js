import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussianFct as func } from '../gaussianFct';

expect.extend({ toBeDeepCloseTo });

describe('gaussianFct', () => {
  it('unit test', () => {
    expect(func(0, 2, 0.2, 0)).toBeDeepCloseTo(2, 2);
    expect(func(0, 2, 0.2, 0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0, 2, 0.2, 0.1)).toBeDeepCloseTo(func(0, 2, 0.2, -0.1), 2);
  });
});
