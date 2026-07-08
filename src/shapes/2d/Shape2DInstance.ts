import type { Gaussian2D } from './gaussian2D/Gaussian2D.ts';

export interface Shape2DKindInstanceMap {
  gaussian: Gaussian2D;
}

export type Shape2DInstance<
  TKind extends keyof Shape2DKindInstanceMap = keyof Shape2DKindInstanceMap,
> = Shape2DKindInstanceMap[TKind];
