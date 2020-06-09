import { Test } from 'nodeunit';
import { FromCloudFormation } from '../lib/cfn-parse';

export = {
  'FromCloudFormation class': {
    '#parseCreationPolicy': {
      'returns undefined when given a non-object as the argument'(test: Test) {
        test.equal(FromCloudFormation.parseCreationPolicy('blah'), undefined);

        test.done();
      },

      'returns undefined when given an empty object as the argument'(test: Test) {
        test.equal(FromCloudFormation.parseCreationPolicy({}), undefined);

        test.done();
      },

      'returns undefined when given empty sub-objects as the argument'(test: Test) {
        test.equal(FromCloudFormation.parseCreationPolicy({
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
        test.equal(FromCloudFormation.parseUpdatePolicy('blah'), undefined);

        test.done();
      },

      'returns undefined when given an empty object as the argument'(test: Test) {
        test.equal(FromCloudFormation.parseUpdatePolicy({}), undefined);

        test.done();
      },

      'returns undefined when given empty sub-objects as the argument'(test: Test) {
        test.equal(FromCloudFormation.parseUpdatePolicy({
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
