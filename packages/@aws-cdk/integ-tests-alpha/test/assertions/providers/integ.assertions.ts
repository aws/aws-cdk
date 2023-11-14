import { App, CfnResource, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '../../../lib';

const app = new App();
const stack = new Stack(app, 'Assertions');

const ssmParameter = new CfnResource(stack, 'Utf8Parameter', {
  type: 'AWS::SSM::Parameter',
  properties: {
    Type: 'String',
    Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
  },
});

const integ = new IntegTest(app, 'AssertionsTest', {
  testCases: [stack],
});

const firstAssertion = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: ssmParameter.ref,
  WithDecryption: true,
}).expect(
  ExpectedResult.objectLike({
    Parameter: {
      Type: 'String',
      Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    },
  }),
);

const secondAssertion = integ.assertions.awsApiCall('SSM', 'getParameter', {
  Name: ssmParameter.ref,
  WithDecryption: true,
}).expect(
  ExpectedResult.objectLike({
    Parameter: {
      Type: 'String',
      Value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    },
  }),
);

firstAssertion.next(secondAssertion);