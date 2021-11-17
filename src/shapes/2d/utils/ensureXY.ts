import type { XYNumber } from '../../../types/XYNumber';

export function ensureXYNumber(input: number | XYNumber): XYNumber {
  return typeof input !== 'object' ? { x: input, y: input } : { ...input };
}
