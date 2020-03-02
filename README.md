# ml-peak-shape-generator

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm i ml-peak-shape-generator`

## Usage

```js
import { gaussian, lorentzian, pseudoVoigt} from 'ml-peak-shape-generator';

// It's possible to specify the windows size with factor option
const gaussianVector = gaussian({factor: 3.5, sd: 500});
// or fix the number of points as Full Width at Half Maximum
const gaussianVector2 = gaussian({factor: 3.5, fwhm: 500});

// It's possible to specify the windows size with factor option
const lorenzianVector = loretzian({factor: 5, fwhm: 500});

// It's possible to specify the windows size with factor option
const pseudoVoigtVector = pseudoVoigt({{factor: 5, fwhm: 500}});
```

```js
import { getShape, GAUSSIAN, LORENTZIAN, PSEUDO_VOIGT} from 'ml-peak-shape-generator';

// If you want to dynamically select a shape you can use the `getShape` method.
const shape = getShape(LORENTZIAN, {factor: 3.5, sd: 500});

```




## [API Documentation](https://cheminfo.github.io/ml-peak-shape-generator/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-peak-shape-generator.svg
[npm-url]: https://www.npmjs.com/package/ml-peak-shape-generator
[ci-image]: https://github.com/cheminfo/ml-peak-shape-generator/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/ml-peak-shape-generator/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/ml-peak-shape-generator.svg
[download-url]: https://www.npmjs.com/package/ml-peak-shape-generator
