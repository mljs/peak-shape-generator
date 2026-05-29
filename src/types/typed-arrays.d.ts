// Float64Array.at() is typed as T|undefined in TypeScript lib, but is safe for
// in-bounds access. Override to avoid per-call type assertions in hot paths.
interface Float64Array {
  at(index: number): number;
}
