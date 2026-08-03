import { expectTypeOf, test } from 'vitest';

import type { Shape1DWithFWHM } from '../shape_1d.ts';

test('Shape1DWithFWHM should only contain types with a `fwhm` property', () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function test(shape: Shape1DWithFWHM) {
    // If this test fails, update Shape1DWithFWHM to exclude other shapes that don't have a `fwhm` property.
    expectTypeOf(shape).toExtend<{ fwhm?: number }>();
  }
  test({ kind: 'gaussian' });
});
