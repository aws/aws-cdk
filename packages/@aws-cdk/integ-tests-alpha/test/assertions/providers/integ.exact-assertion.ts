import { App, CfnResource, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '../../../lib';

const app = new App();
const stack = new Stack(app, 'ExactAssertion');

const parameterValue = 'exact-value';
const parameter = new CfnResource(stack, 'Parameter', {
  type: 'AWS::SSM::Parameter',
  properties: {
    Type: 'String',
    Value: parameterValue,
  },
});

const integ = new IntegTest(app, 'ExactAssertionTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: parameter.ref,
}).assertAtPath('Parameter.Value', ExpectedResult.exact(parameterValue));
