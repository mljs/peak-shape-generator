import type { XYNumber } from '../XYNumber.ts';

/**
 * Normalize a scalar or XYNumber to an XYNumber, duplicating the scalar to both axes.
 * @param input - scalar number or existing XYNumber.
 * @returns an XYNumber with x and y components.
 */
export function ensureXYNumber(input: number | XYNumber): XYNumber {
  return typeof input !== 'object' ? { x: input, y: input } : { ...input };
}
