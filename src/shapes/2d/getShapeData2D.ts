import type { GetData2DOptions } from './GetData2DOptions';
import type { Shape2D } from './Shape2D';

import { getShape2D } from './getShape2D';

/**
 * Returns an array with the intensity values of a specific kind of shape.
 */

export function getShapeData2D(shape: Shape2D, options: GetData2DOptions = {}) {
  const shapeInstance = getShape2D(shape);
  return shapeInstance.getData(options);
}
