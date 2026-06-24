import { ROOT_THREE } from '../../../util/constants.ts';
import type { GetData1DOptions } from '../GetData1DOptions.ts';
import type {
  Parameter,
  Shape1DClass,
  Shape1DDerivative,
} from '../Shape1DClass.ts';

export interface GeneralizedLorentzianClassOptions {
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  /**
   * kurtosis parameter of the shape, between -1 to 2
   * @default 1
   */
  gamma?: number;
}

interface GetGeneralizedLorentzianAreaOptions {
  /**
   * The maximum intensity value of the shape
   * @default 1
   */
  height?: number;
  /**
   * Full width at half maximum.
   * @default 500
   */
  fwhm?: number;
  gamma?: number;
  x?: number;
}

/**
 * This shape is a linear combination of rational function (n|n+2), for n = 0 (lorentzian function) and n = 2
 * the parameter that combines those two functions is `gamma` and it is called the kurtosis parameter, it is an
 * implementation of generalized lorentzian shape published by Stanislav Sykora in the SMASH 2010. DOI:10.3247/SL3nmr10.006
 * {@link https://www.ebyte.it/stan/Talk_ML_UserMeeting_SMASH_2010_GeneralizedLorentzian.html}
 */
export class GeneralizedLorentzian implements Shape1DClass {
  /**
   * Full width at half maximum.
   * @default 500
   */
  public fwhm: number;
  /**
   * kurtosis parameter of the shape, between -1 to 2
   * @default 1
   */
  public gamma: number;

  public constructor(options: GeneralizedLorentzianClassOptions = {}) {
    const { fwhm = 500, gamma = 0.5 } = options;

    this.fwhm = fwhm;
    this.gamma = gamma;
  }

  public fwhmToWidth(fwhm = this.fwhm) {
    return generalizedLorentzianFwhmToWidth(fwhm);
  }

  public widthToFWHM(width: number) {
    return generalizedLorentzianWidthToFWHM(width);
  }

  public fct(x: number) {
    return generalizedLorentzianFct(x, this.fwhm, this.gamma);
  }

  public getArea(height = 1) {
    return getGeneralizedLorentzianArea({
      fwhm: this.fwhm,
      height,
      gamma: this.gamma,
    });
  }

  public getFactor(area?: number) {
    return getGeneralizedLorentzianFactor(area);
  }

  public getData(options: GetData1DOptions = {}) {
    return getGeneralizedLorentzianData(this, options);
  }

  public calculateHeight(area = 1) {
    const { gamma, fwhm } = this;
    return calculateGeneralizedLorentzianHeight({ fwhm, area, gamma });
  }

  public getParameters(): Parameter[] {
    return ['fwhm', 'gamma'];
  }

  public derivative(x: number): Shape1DDerivative {
    const { fct, dx, dFwhm, dGamma } = generalizedLorentzianDerivative(
      x,
      this.fwhm,
      this.gamma,
    );
    return { fct, dx, parameters: [dFwhm, dGamma] };
  }
}

export const calculateGeneralizedLorentzianHeight = ({
  fwhm = 1,
  gamma = 1,
  area = 1,
}) => {
  return (area / fwhm / (3.14159 - 0.420894 * gamma)) * 2;
};

/**
 * Calculate the area under a generalized Lorentzian peak (integral from Mathematica).
 * @param options - shape parameters including fwhm, height, and gamma.
 * @returns the area under the peak.
 */
export const getGeneralizedLorentzianArea = (
  options: GetGeneralizedLorentzianAreaOptions,
) => {
  const { fwhm = 500, height = 1, gamma = 1 } = options;
  return (height * fwhm * (3.14159 - 0.420894 * gamma)) / 2;
};

export const generalizedLorentzianFct = (
  x: number,
  fwhm: number,
  gamma: number,
) => {
  const u = ((2 * x) / fwhm) ** 2;
  return (1 - gamma) / (1 + u) + (gamma * (1 + u / 2)) / (1 + u + u ** 2);
};

/**
 * Analytical value and partial derivatives of the generalized lorentzian function centered at x=0.
 * @param x - position at which to evaluate.
 * @param fwhm - full width at half maximum.
 * @param gamma - kurtosis parameter of the shape.
 * @returns the value `fct` and its partial derivatives with respect to `x` (`dx`), `fwhm` (`dFwhm`) and `gamma` (`dGamma`).
 */
export function generalizedLorentzianDerivative(
  x: number,
  fwhm: number,
  gamma: number,
) {
  const u = ((2 * x) / fwhm) ** 2;
  const lorentzian = 1 / (1 + u); // A
  const rational = (1 + u / 2) / (1 + u + u * u); // B
  const fct = (1 - gamma) * lorentzian + gamma * rational;

  // dA/du and dB/du
  const dLorentzianDu = -1 / ((1 + u) * (1 + u));
  const denominator = 1 + u + u * u;
  const dRationalDu =
    -(0.5 + 2 * u + 0.5 * u * u) / (denominator * denominator);
  const dFctDu = (1 - gamma) * dLorentzianDu + gamma * dRationalDu;

  const duDx = (8 * x) / (fwhm * fwhm);
  const duDfwhm = (-8 * x * x) / (fwhm * fwhm * fwhm);

  const dx = dFctDu * duDx;
  const dFwhm = dFctDu * duDfwhm;
  const dGamma = rational - lorentzian; // B - A
  return { fct, dx, dFwhm, dGamma };
}

export const generalizedLorentzianWidthToFWHM = (width: number) => {
  return width * ROOT_THREE;
};

export const generalizedLorentzianFwhmToWidth = (fwhm: number) => {
  return fwhm / ROOT_THREE;
};

const generalizedLorentzianQuantile = (p: number) =>
  Math.tan(Math.PI * (p - 0.5));

export const getGeneralizedLorentzianFactor = (area = 0.9999) => {
  if (area >= 1) {
    throw new Error('area should be (0 - 1)');
  }
  const halfResidual = (1 - area) * 0.5;
  return (
    (generalizedLorentzianQuantile(1 - halfResidual) -
      generalizedLorentzianQuantile(halfResidual)) /
    2
  );
};

export type GetGeneralizedLorentzianData = GetData1DOptions & {
  gamma?: number;
};

export const getGeneralizedLorentzianData = (
  shape: GeneralizedLorentzianClassOptions = {},
  options: GetGeneralizedLorentzianData = {},
) => {
  const { fwhm = 500, gamma = 1 } = shape;
  const {
    factor = getGeneralizedLorentzianFactor(),
    height = calculateGeneralizedLorentzianHeight({ fwhm, area: 1, gamma }),
  } = options;
  let { length } = options;

  if (!length) {
    length = Math.min(Math.ceil(fwhm * factor), 2 ** 25 - 1);
    if (length % 2 === 0) length++;
  }

  const center = (length - 1) / 2;
  const data = new Float64Array(length);
  for (let i = 0; i <= center; i++) {
    const value = generalizedLorentzianFct(i - center, fwhm, gamma) * height;
    data[i] = value;
    data[length - 1 - i] = value;
  }

  return data;
};
