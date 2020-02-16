/**
 * Returns a very important number
 * @return {number}
 */

export function lorentzian(options = {}) {
  const { factor = 8, width = 1000 } = options;
  const halfWidth = width / 2;
  const center = factor * halfWidth;
  const vector = [];
  for (let i = 0; i <= width * factor; i++) {
    vector.push(
      ((1 / Math.PI) * halfWidth) /
        (Math.pow(i - center, 2) + Math.pow(halfWidth, 2)),
    );
  }
  return vector;
}

export function gaussian(options = {}) {
  const { factor = 5, width = 1000 } = options;
  const vector = [];
  const center = (factor * width) / 2;
  const ratio = Math.sqrt(Math.log(4));
  const normalConstant = ratio / Math.sqrt(2 * Math.PI) / width;
  for (let i = 0; i <= width * factor; i++) {
    vector.push(
      normalConstant *
        Math.exp(-(1 / 2) * Math.pow(((i - center) / width) * ratio, 2)),
    );
  }
  return vector;
}

export function pseudoVoigt(options = {}) {
  const { factor = 8, width = 1000, mu = 0.5 } = options;

  const ratio = Math.sqrt(4 * Math.log(2));
  const halfWidth = width / 2;
  const center = factor * halfWidth;

  const rootHalfWidth = Math.pow(halfWidth, 2);
  const lFactor = (mu * halfWidth * 2) / Math.PI;
  const gFactor = (1 - mu) * (ratio / Math.sqrt(Math.PI) / width);
  const vector = [];
  for (let i = 0; i <= width * factor; i++) {
    vector.push(
      lFactor / (4 * Math.pow(i - center, 2) + rootHalfWidth) +
        gFactor * Math.exp(-1 * Math.pow(((i - center) / width) * ratio, 2)),
    );
  }
  return vector;
}
