import { expect, expectTypeOf, test } from 'vitest';

import { Gaussian2D } from '../gaussian2D/Gaussian2D.ts';
import { getShape2D } from '../getShape2D.ts';

test('returns a Gaussian2D instance for gaussian input', () => {
  const shape = getShape2D({ kind: 'gaussian', fwhm: 10 });

  expectTypeOf(shape).toEqualTypeOf<Gaussian2D>();

  expect(shape).toBeInstanceOf(Gaussian2D);
});
