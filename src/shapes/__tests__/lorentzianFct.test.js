import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { lorentzianFct } from '../lorentzianFct';

expect.extend({ toBeDeepCloseTo });

describe('lorentzianFct', () => {
  it('unit test', () => {
    const func = lorentzianFct({ x: 0, y: 2, width: 0.2 });
    expect(func(0)).toBeDeepCloseTo(2, 2);
    expect(func(0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0.1)).toBeDeepCloseTo(func(-0.1, 2));
  });
});
