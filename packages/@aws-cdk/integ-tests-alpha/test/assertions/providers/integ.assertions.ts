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

// use v3 package name and command class name
const thirdAssertion = integ.assertions.awsApiCall('@aws-sdk/client-ssm', 'GetParameterCommand', {
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

// use v3 client name and command class name
const forthAssertion = integ.assertions.awsApiCall('ssm', 'GetParameterCommand', {
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

firstAssertion.next(secondAssertion).next(thirdAssertion).next(forthAssertion);
