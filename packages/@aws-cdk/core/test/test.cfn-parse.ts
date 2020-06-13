import { Test } from 'nodeunit';
import { FromCloudFormation, ParseCfnOptions } from '../lib/cfn-parse';

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
  return FromCloudFormation.parseCreationPolicy(policy, dummyOptions);
}

function parseUpdatePolicy(policy: any) {
  return FromCloudFormation.parseUpdatePolicy(policy, dummyOptions);
}

const dummyOptions: ParseCfnOptions = {
  finder: {
    findCondition() { return undefined; },
    findRefTarget() { return undefined; },
    findResource() { return undefined; },
  },
};
