import type { GetData1DOptions } from './GetData1DOptions';
import type { Shape1D } from './Shape1D';

import { getShape1D } from './getShape1D';

/**
 * Returns an array with the intensity values of a specific kind of shape.
 */

export function getShapeData1D(shape: Shape1D, options: GetData1DOptions = {}) {
  const shapeInstance = getShape1D(shape);
  return shapeInstance.getData(options);
}
