// this code can be executed with `node -r esm examples/example.js``

import { writeFileSync } from 'fs';
import { join } from 'path';

import { Gaussian, Lorentzian } from '../src';

let myFct = new Gaussian();
let ys = myFct.shape();
let xs = new Array(ys.length).fill(0).map((a, index) => index);

writeFileSync(
    join(__dirname, 'data.json'),
    JSON.stringify({ x: xs, y: Array.from(ys) }),
    'utf8',
);
