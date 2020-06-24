import { Test } from 'nodeunit';
import { CfnParser } from '../lib/cfn-parse';

export = {
  'FromCloudFormation class': {
    '#parseCreationPolicy': {
      'returns undefined when given a non-object as the argument'(test: Test) {
        test.equal(parseCreationPolicy('blah'), undefined);

        test.done();
      },

      'returns undefined when given an empty object as the argument'(test: Test) {
        test.equal(parseCreationPolicy({}), undefined);

        test.done();
      },

      'returns undefined when given empty sub-objects as the argument'(test: Test) {
        test.equal(parseCreationPolicy({
          AutoScalingCreationPolicy: null,
          ResourceSignal: {
            Count: undefined,
          },
        }), undefined);

        test.done();
      },
    },

    '#parseUpdatePolicy': {
      'returns undefined when given a non-object as the argument'(test: Test) {
        test.equal(parseUpdatePolicy('blah'), undefined);

        test.done();
      },

      'returns undefined when given an empty object as the argument'(test: Test) {
        test.equal(parseUpdatePolicy({}), undefined);

        test.done();
      },

      'returns undefined when given empty sub-objects as the argument'(test: Test) {
        test.equal(parseUpdatePolicy({
          AutoScalingReplacingUpdate: null,
          AutoScalingRollingUpdate: {
            PauseTime: undefined,
          },
        }), undefined);

        test.done();
      },
    },
  },
};

function parseCreationPolicy(policy: any) {
  return testCfnParser.parseCreationPolicy(policy);
}

function parseUpdatePolicy(policy: any) {
  return testCfnParser.parseUpdatePolicy(policy);
}

const testCfnParser = new CfnParser({
  finder: {
    findCondition() { return undefined; },
    findRefTarget() { return undefined; },
    findResource() { return undefined; },
  },
});
