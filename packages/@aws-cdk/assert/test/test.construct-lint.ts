import { Construct, Resource, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { expect, haveNoConstructLints, SynthUtils } from '../lib';

class DefaultChildResource extends Resource {
  constructor(scope: Construct, id: string, defaultChild?: Construct) {
    super(scope, id);
    this.node.defaultChild = defaultChild; // intentionally passing through undefined
  }
}

export = {
  'does not fail if all resources are good'(test: Test) {
    const stack = new Stack();
    new DefaultChildResource(stack, 'good', new Construct(stack, 'child'));
    expect(stack).to(haveNoConstructLints());
    test.done();
  },

  'catches resource with defaultChild undefined'(test: Test) {
    const stack = new Stack();
    new DefaultChildResource(stack, 'good', new Construct(stack, 'child'));
    new DefaultChildResource(stack, 'bad');
    test.throws(() => expect(stack).to(haveNoConstructLints()), /found constructs/);
    test.done();
  },

  'ignores missing defaultChild for constructs (that are not resources)'(test: Test) {
    const stack = new Stack();
    const construct = new Construct(stack, 'construct');
    construct.node.defaultChild = undefined;
    expect(stack).to(haveNoConstructLints());
    test.done();
  },

  'fails if a synthesizedstack is passed in'(test: Test) {
    const stack = new Stack();
    new Construct(stack, 'construct');
    test.throws(() => expect(SynthUtils.synthesize(stack)).to(haveNoConstructLints()), /original CDK stack/);
    test.done();
  }
};