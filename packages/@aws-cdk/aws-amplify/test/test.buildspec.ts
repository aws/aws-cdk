import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { BuildSpec, mergeBuildSpecs } from '../lib';

export = {
  'Test ObjectBuildSpec'(test: Test) {
    const stack = new Stack();
    const bs = BuildSpec.fromObject({
      version: 0.2
    });

    test.equals(stack.resolve(bs.toBuildSpec()), '{\n  "version": 0.2\n}', 'Creates object');

    test.done();
  },

  'Test merge'(test: Test) {
    const stack = new Stack();
    const left = BuildSpec.fromObject({version: 0.2});
    const right = BuildSpec.fromObject({
      phases: {
        build: {
          commands: [
            'echo "Hello, world"'
          ]
        }
      }
    });

    const raw = {
      spec: {
        version: 0.2,
        phases: { build: { commands: [ 'echo "Hello, world"' ] } }
      },
      isImmediate: true
    };

    const center = mergeBuildSpecs(left, right);
    test.deepEqual(stack.resolve(center), raw, 'Merged');

    test.done();
  }
};