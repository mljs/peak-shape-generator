import hashObject from 'hash-object';
import { getShape } from './getShape';

/**
 * Allows to generate and cache shapes
 *
 */
export class PeakShapeGenerator {
  constructor(options = {}) {
    const { cacheSize = 20 } = options;
    this.cache = [];
    this.cacheSize = cacheSize;
  }

  getShape(kind, options) {
    let uuid = hashObject({ kind, options });
    if (this.cache[uuid]) return this.cache[uuid];
    const shape = getShape(kind, options);
    if (Object.keys(this.cache) < this.cacheSize) {
      this.cache[uuid] = shape;
    }
    return shape;
  }
}
