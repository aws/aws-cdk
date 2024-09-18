import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'value-from-lookup-with-defaults', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const outputParameterName = '/IntegTest/DefaultValueParameter';
// a default value, this is what we'll be looking for at the end
const defaultParameterValue = 'lookup-default-value';
// resolvedDefaultValue should === defaultParameterValue if the code is working correctly
const resolvedDefaultValue = ssm.StringParameter.valueFromLookup(stack, '/Missing/Parameter', defaultParameterValue);

// Output the value to a parameter so that we can look it up for confirmation
new ssm.StringParameter(stack, 'defaultValueOutputParameter', {
  parameterName: outputParameterName,
  stringValue: resolvedDefaultValue,
});

const integrationTest = new integ.IntegTest(app, 'ValueFromLookupWithDefaultTest', {
  enableLookups: true,
  testCases: [stack],
});

// The result of looking up the parameter
const getParameterResult = integrationTest.assertions.awsApiCall('ssm', 'GetParameter', {
  Name: outputParameterName,
});

// We expect there to be parameter which has the defaultParameterValue as its value
getParameterResult.expect(integ.ExpectedResult.objectLike({
  Parameter: {
    Name: outputParameterName,
    Value: defaultParameterValue,
  },
}));

