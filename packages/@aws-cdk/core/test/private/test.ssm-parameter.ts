import { Test } from 'nodeunit';
import { Stack } from '../../lib';
import { SsmStringParameter } from '../../lib/private/ssm-parameter';
import { toCloudFormation } from '../util';

export = {
  'ssm string parameter construct is correctly rendered'(test: Test) {
    const stack = new Stack();
    new SsmStringParameter(stack, 'string-param', {
      name: 'ParamName',
      value: 'ParamValue',
      description: 'ParamDescription',
    });

    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        stringparam5E4312EC: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Name: 'ParamName',
            Description: 'ParamDescription',
            Type: 'String',
            Value: 'ParamValue',
          },
        },
      },
    });

    test.done();
  },
};