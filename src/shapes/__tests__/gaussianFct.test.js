import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussianFct } from '../gaussianFct';

expect.extend({ toBeDeepCloseTo });

describe('gaussianFct', () => {
  it('unit test', () => {
    const func = gaussianFct({ x: 0, y: 2, width: 0.2 });
    expect(func(0)).toBeDeepCloseTo(2, 2);
    expect(func(0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0.1)).toBeDeepCloseTo(func(-0.1, 2));
  });
});
