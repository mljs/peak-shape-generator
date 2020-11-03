import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { pseudovoigtFct } from '../pseudovoigtFct';
import { lorentzianFct } from '../lorentzianFct';
import { gaussianFct } from '../gaussianFct';

expect.extend({ toBeDeepCloseTo });

describe('pseudoVoigtFct', () => {
  it('mu equal 0', () => {
    const func = pseudovoigtFct({ x: 0, y: 2, width: 0.2, mu: 0 });
    const funcL = lorentzianFct({ x: 0, y: 2, width: 0.2 });
    expect(func(0)).toBeDeepCloseTo(2, 2);
    expect(func(0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0.1)).toBeDeepCloseTo(func(-0.1, 2));
    expect(func(0.1)).toBeDeepCloseTo(funcL(0.1, 2));
  });
  it('mu equal 1', () => {
    const func = pseudovoigtFct({ x: 0, y: 2, width: 0.2, mu: 1 });
    const funcG = gaussianFct({ x: 0, y: 2, width: 0.2 });
    expect(func(0)).toBeDeepCloseTo(2, 2);
    expect(func(0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0.1)).toBeDeepCloseTo(func(-0.1, 2));
    expect(func(0.1)).toBeDeepCloseTo(funcG(0.1, 2));
  });
  it('mu equal 0.5', () => {
    const func = pseudovoigtFct({ x: 0, y: 2, width: 0.2, mu: 0.5 });
    expect(func(0)).toBeDeepCloseTo(2, 2);
    expect(func(0.1)).toBeDeepCloseTo(1, 2);
    expect(func(0.1)).toBeDeepCloseTo(func(-0.1, 2));
  });
});
