/**
 * Returns a very important number
 * @return {number}
 */

export function lorentzian(options = {}) {
  const {
    factor = 8,
    width = 1000
  } = options;
  const halfWidth = width / 2;
  const center = factor * halfWidth;
  const lorentzian = [];
  for(let i = 0; i <= width * factor; i++) {
    lorentzian.push( halfWidth/(Math.pow( i - center, 2) + Math.pow(halfWidth, 2)) );
  }
  return lorentzian;
}

export function gaussian(options = {}) {
  const {
    factor = 5,
    width = 1000
  } = options;

  const gaussian = [];
  const ratio = Math.sqrt(Math.log(4));
  for (let i = 0; i <= width * factor; i++) {
    gaussian.push(
      Math.exp(
        (-1 / 2) *
          Math.pow(
            (((i - (factor * width) / 2) * 2) / width) *
              ratio,
            2,
          ),
      ),
    );
  }
  return gaussian;
}

export function pseudoVoigt(options = {}) {
  
}