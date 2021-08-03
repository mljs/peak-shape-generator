import gaussian from 'ml-peak-shape-generator';

const currifiedGaussian = curry(gaussian.fct);

const gaussianFct = currifiedGaussian(10);

console.log(currifiedGaussian(10, 0));
console.log(gaussianFct(0));
consoel.log(gaussian.fct(10, 0));


function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind({}, ...args);
    }

    return fn.call({}, ...args);
  };
}
