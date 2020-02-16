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
