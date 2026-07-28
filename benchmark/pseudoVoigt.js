import Benchmark from 'benchmark';

/**
 * A pseudo-Voigt is `(1 - mu) * lorentzian + mu * gaussian`, and a renderer
 * evaluates it over a whole window. The gaussian half underflows a few line
 * widths from the centre while the lorentzian half does not, so every point past
 * that pays for a `Math.exp` whose result cannot change the sum.
 *
 * This benchmark evaluates both halves over a window of the width a spectrum
 * generator actually uses — `getFactor()` returns 6366 line widths for a
 * lorentzian-dominated shape — and compares the current implementation with one
 * that skips the gaussian half where it has underflowed.
 *
 * Run with `node benchmark/pseudoVoigt.js`.
 */

const GAUSSIAN_EXP_FACTOR = -4 * Math.LN2;

/** Beyond this z², `exp(GAUSSIAN_EXP_FACTOR * z²)` is below 1.4e-17. */
const GAUSSIAN_CUTOFF = 14;

/**
 * The current implementation, copied so both variants are measured in one
 * process against the same data.
 * @param x - distance from the centre.
 * @param fwhm - full width at half maximum.
 * @param mu - ratio of gaussian contribution.
 * @returns the value of the shape.
 */
function currentFct(x, fwhm, mu) {
  const lorentzian = fwhm ** 2 / (4 * x ** 2 + fwhm ** 2);
  const gaussian = Math.exp(GAUSSIAN_EXP_FACTOR * (x / fwhm) ** 2);
  return (1 - mu) * lorentzian + mu * gaussian;
}

/**
 * The same shape, skipping the gaussian half where it has underflowed.
 * @param x - distance from the centre.
 * @param fwhm - full width at half maximum.
 * @param mu - ratio of gaussian contribution.
 * @returns the value of the shape.
 */
function guardedFct(x, fwhm, mu) {
  const lorentzian = fwhm ** 2 / (4 * x ** 2 + fwhm ** 2);
  const z = x / fwhm;
  if (z * z > GAUSSIAN_CUTOFF) return (1 - mu) * lorentzian;
  const gaussian = Math.exp(GAUSSIAN_EXP_FACTOR * z * z);
  return (1 - mu) * lorentzian + mu * gaussian;
}

const FWHM = 1;
const MU = 0.1;
const SIZE = 100000;

// positions spanning the window a generator renders for this shape
const positions = new Float64Array(SIZE);
for (let index = 0; index < SIZE; index++) {
  positions[index] = ((index / SIZE) * 6366 - 3183) * FWHM;
}

// each variant gets its own sweep: a shared one would make the call site
// polymorphic and the two cases would contaminate each other's inline caches

/**
 * Sum the current implementation over every position.
 * @returns the sum.
 */
function sweepCurrent() {
  let total = 0;
  for (let index = 0; index < SIZE; index++) {
    total += currentFct(positions[index], FWHM, MU);
  }
  return total;
}

/**
 * Sum the guarded implementation over every position.
 * @returns the sum.
 */
function sweepGuarded() {
  let total = 0;
  for (let index = 0; index < SIZE; index++) {
    total += guardedFct(positions[index], FWHM, MU);
  }
  return total;
}

const currentTotal = sweepCurrent();
const guardedTotal = sweepGuarded();
// eslint-disable-next-line no-console
console.log(
  `sum over ${SIZE} points  current ${currentTotal.toPrecision(17)}  guarded ${guardedTotal.toPrecision(17)}  difference ${Math.abs(currentTotal - guardedTotal).toExponential(2)}`,
);

new Benchmark.Suite()
  .add('current', sweepCurrent, { minSamples: 30 })
  .add('guarded', sweepGuarded, { minSamples: 30 })
  .on('cycle', (event) => {
    const { name, hz, stats } = event.target;
    const nsPerPoint = (1e9 / hz / SIZE).toFixed(2);
    // eslint-disable-next-line no-console
    console.log(
      `${name.padEnd(8)} ${(hz * SIZE / 1e6).toFixed(1).padStart(7)} Mpoints/s  ${nsPerPoint.padStart(6)} ns/point  +-${stats.rme.toFixed(2)}%`,
    );
  })
  .on('complete', function onComplete() {
    // eslint-disable-next-line no-console
    console.log(`fastest: ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run();
