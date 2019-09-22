const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);

export const {assert, expect} = chai;
export { describe, it } from 'mocha';

