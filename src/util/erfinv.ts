// https://en.wikipedia.org/wiki/Error_function#Inverse_functions
// This code yields to a good approximation

// If needed a better implementation using polynomial can be found on https://en.wikipedia.org/wiki/Error_function#Inverse_functions

export default function erfinv(x: number): number {
  let a = 0.147;
  if (x === 0) return 0;
  let ln1MinusXSqrd = Math.log(1 - x * x);
  let lnEtcBy2Plus2 = ln1MinusXSqrd / 2 + 2 / (Math.PI * a);
  let firstSqrt = Math.sqrt(lnEtcBy2Plus2 ** 2 - ln1MinusXSqrd / a);
  let secondSqrt = Math.sqrt(firstSqrt - lnEtcBy2Plus2);
  return secondSqrt * (x > 0 ? 1 : -1);
}
