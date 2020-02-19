import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { pseudoVoigt } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('pseudoVoigt', () => {
    let vector = pseudoVoigt({ factor: 50 });
    let area = vector.reduce((a, b) => a + b, 0);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});
