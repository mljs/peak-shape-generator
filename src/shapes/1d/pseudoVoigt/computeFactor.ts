/**
 * Find the k factor for a pseudo-Voigt distribution such that the
 * cumulative probability pPseudoVoigt(k, mu) equals `pTarget`.
 *
 * Uses a simple bisection search (with exponential bracketing) to
 * invert the pseudo-Voigt cumulative function. Special cases:
 * - pTarget <= 0 -> returns 0
 * - pTarget >= 1 -> returns Infinity
 * - mu === 1 -> reduces to the gaussian case and returns tan((pi/2)*pTarget)
 *
 * @param pTarget - Target cumulative probability in (0,1)
 * @param mu - Gaussian fraction in [0,1]
 * @param tol - Convergence tolerance
 * @param maxIter - Maximum number of bisection iterations
 * @returns the factor k such that pPseudoVoigt(k, mu) ~= pTarget
 */
export function pseudoVoigtFindFactor(
  pTarget: number,
  mu: number,
  tol = 1e-9,
  maxIter = 200,
) {
  if (pTarget <= 0) return 0;
  if (pTarget >= 1) return Infinity;
  if (mu === 1) return Math.tan((Math.PI / 2) * pTarget);
  // bisection
  let lo = 0;
  let hi = 10;
  let it = 0;
  while (pPseudoVoigt(hi, mu) < pTarget && it++ < 200) hi *= 2;
  for (let i = 0; i < maxIter; i++) {
    const mid = 0.5 * (lo + hi);
    const val = pPseudoVoigt(mid, mu);
    if (Math.abs(val - pTarget) < tol) return mid;
    if (val < pTarget) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

function erf(x: number) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

const sqrtLn2 = Math.sqrt(Math.log(2));
function pGaussian(k: number) {
  return erf(k * sqrtLn2);
}
function pLorentz(k: number) {
  return (2 / Math.PI) * Math.atan(k);
}
function pPseudoVoigt(k: number, mu: number) {
  return (1 - mu) * pLorentz(k) + mu * pGaussian(k);
}
