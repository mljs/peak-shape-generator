# ml-peak-shape-generator

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Generate various peak shapes.

The current supported kinds of shapes:

| Name         |                                                                                                                           Equation                                                                                                                            |
| ------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Gaussian     |                                                          <img src="https://tex.cheminfo.org/?tex=y%5Ccdot%20exp%5Cleft%5B-%5Cfrac%7B1%7D%7B2%7D%5Cfrac%7B%5Cdelta%7D%7B%5Csigma%5E2%7D%5Cright%5D"/>                                                          |
| Lorentzian   |                                                                       <img src="https://tex.cheminfo.org/?tex=y%5Ccdot%5Cfrac%7B%5Comega%5E2%7D%7B4%5Cdelta%20%2B%20%5Comega%5E2%7D"/>                                                                        |
| Pseudo Voigt | <img src="https://tex.cheminfo.org/?tex=y%20%5Ccdot%5Cleft%5Bx_g%5Ccdot%20exp%5Cleft%5B-%5Cfrac%7B1%7D%7B2%7D%5Cfrac%7B%5Cdelta%7D%7B%5Csigma%5E2%7D%5Cright%5D%20%2B%20x_l%5Ccdot%5Cfrac%7B%5Comega%5E2%7D%7B4%5Cdelta%20%2B%20%5Comega%5E2%7D%5Cright%5D"/> |

where

| <img src="https://tex.cheminfo.org/?tex=%5Cdelta%20%3D%20%5Cleft(t%20-%20x%5Cright)%5E2%0A"/> | <img src="https://tex.cheminfo.org/?tex=%5Csigma%20%3D%20%5Cfrac%7BFWHM%7D%7B2%5Csqrt%7B2%20%5Ccdot%20ln(2)%7D%7D"/> | <img src="https://tex.cheminfo.org/?tex=%5Comega%20%3D%20FWHM"/> |
| --------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------- |

## Installation

`$ npm i ml-peak-shape-generator`

## Usage

```js
import {
  getGaussianData,
  getLorentzianData,
  getPseudoVoigtData,
} from 'ml-peak-shape-generator';

// It's possible to specify the windows size with factor option
let data = getGaussianData({ sd: 500 }, { factor: 3.5 });
// or fix the number of points as Full Width at Half Maximum
let data = getGaussianData({ fwhm: 500 }, { factor: 3.5 });

// It's possible to specify the windows size with factor option
let data = getLorentzianData({ fwhm: 500 }, { factor: 5 });

// It's possible to specify the windows size with factor option
let data = getPseudoVoigtData({ fwhm: 500 }, { factor: 5 });
```

It is also possible to take an instance of each kind of shape:

```js
import { Gaussian, gaussianFct, Gaussian2D } from 'ml-peak-shape-shape';

const gaussianShape = new Gaussian({ fwhm: 500 });
// It is possible to set a new value for fwhm
gaussianShape.fwhm = 300;

// By default the height value ensure a volume equal 1.
const gaussian2DShape = new Gaussian2D({ fwhm: 500 });

// It is possible to set values for sd, fwhm and factor for each axes.
const gaussian2DShape = new Gaussian2D({ fwhm: { x: 300, y: 500 } });

// It is possible to set new value for fwhm by:
gaussian2D.fwhm = { x: 300, y: 500 };
// or set the same value for both axes.
gaussian2D.fwhm = 400;

//An instance of any shape has the same methods accessible for each
//shape e.g. fct or getData, but these use the internal parameters. e.g:

const gaussianShape = new Gaussian({ fwhm: 500 });
gaussianShape.fct(5);
gaussianFct(5, 500);
// getData
gaussianShape.getData({ factor: 3.5 });
```

```js
import { getShape1D, getShape2D } from 'ml-peak-shape-generator';

// If you want to dynamically select a shape you can use the `getShapeGenerator` method. It returns a instance of required kind of shape.

let shapeGenerator = getShape1D({ kind: 'lorentzian', sd: 500 });
let shapeGenerator = getShape2D({ kind: 'gaussian', sd: 500 });
```

It is also possible to get a function that allows to calculate y for any x

```js
import { gaussianFct } from 'ml-peak-shape-generator';
const func = gaussianFct(x - mean, fwhm);
```

## [API Documentation](https://mljs.github.io/peak-shape-generator/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-peak-shape-generator.svg
[npm-url]: https://www.npmjs.com/package/ml-peak-shape-generator
[ci-image]: https://github.com/mljs/peak-shape-generator/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/mljs/peak-shape-generator/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/peak-shape-generator.svg
[codecov-url]: https://codecov.io/gh/mljs/peak-shape-generator
[download-image]: https://img.shields.io/npm/dm/ml-peak-shape-generator.svg
[download-url]: https://www.npmjs.com/package/ml-peak-shape-generator
