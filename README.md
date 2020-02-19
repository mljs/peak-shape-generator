# ml-peak-shape-generator

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm i ml-peak-shape-generator`

## Usage

```js
import { gaussian, lorentzian, pseudoVoigt } from 'ml-peak-shape-generator';

let gaussianVector;
// It's possible to specify the windows size with factor option
gaussianVector = gaussian({factor: 3.5, SD: 500});
// or fix the number of points as Full Width at Half Maximum
gaussianVector = gaussian({factor: 3.5, FWHM: 500});

let lorentzianVector;
// It's possible to specify the windows size with factor option
lorenzianVector = loretzian({factor: 5, FWHM: 500});

let pseudoVoigtVector;
// It's possible to specify the windows size with factor option
pseudoVoigtVector = pseudoVoigt({{factor: 5, FWHM: 500}});  
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
