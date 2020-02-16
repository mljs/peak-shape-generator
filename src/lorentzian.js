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
