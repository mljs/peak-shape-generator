/**
 * Returns a very important number
 * @return {number}
 */

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
