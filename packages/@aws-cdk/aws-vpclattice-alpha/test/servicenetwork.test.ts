import { Template } from 'aws-cdk-lib/assertions';
import * as core from 'aws-cdk-lib';
import * as vpclattice from '../lib';

/* We allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */


describe('Example Resource', () => {
  let stack: core.Stack;

  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('created with default properties', () => {

    beforeEach(() => {
      new vpclattice.ServiceNetwork(stack, 'ServiceNetwork', {});
    });

    test('creates a lattice network', () => {
      Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::ServiceNetwork', 1);
    });

  });
});
