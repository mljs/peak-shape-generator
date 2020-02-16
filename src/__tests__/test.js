import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { gaussian, lorentzian, pseudoVoigt } from '..';

expect.extend({ toBeDeepCloseTo });

describe('Normalization', () => {
  it('gaussian', () => {
    let vector = gaussian({ factor: 50 });
    let area = getArea(vector);
    expect(area).toBeDeepCloseTo(1, 2);
  });

  it('lorentzian', () => {
    let vector = lorentzian({ factor: 500 });
    let area = getArea(vector);
    expect(area).toBeDeepCloseTo(1, 2);
  });

  it('pseudoVoigt', () => {
    let vector = pseudoVoigt({ factor: 50 });
    let area = getArea(vector);
    expect(area).toBeDeepCloseTo(1, 2);
  });
});

function getArea(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
