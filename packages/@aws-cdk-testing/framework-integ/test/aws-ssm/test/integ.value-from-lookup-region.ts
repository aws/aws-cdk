import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'value-from-lookup-region', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const outputParameterName = '/IntegTest/ValueFromLookupRegionParameter';
const defaultParameterValue = 'lookup-region-default-value';
const lookupRegion = process.env.CDK_INTEG_LOOKUP_REGION ?? 'us-west-2';
const resolvedDefaultValue = ssm.StringParameter.valueFromLookup(stack, '/Missing/Parameter', defaultParameterValue, {
  region: lookupRegion,
});

new ssm.StringParameter(stack, 'regionLookupOutputParameter', {
  parameterName: outputParameterName,
  stringValue: resolvedDefaultValue,
});

new integ.IntegTest(app, 'ValueFromLookupRegionTest', {
  enableLookups: true,
  testCases: [stack],
});
