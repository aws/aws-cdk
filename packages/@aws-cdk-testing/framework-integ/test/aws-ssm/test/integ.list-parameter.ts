import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
const paramName = 'integ-list-param';
const paramValue = ['value1', 'value2'];

class TestCaseBase extends cdk.Stack {
  public readonly listParam: ssm.IStringListParameter;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.listParam = new ssm.StringListParameter(this, 'ListParam', {
      parameterName: paramName,
      stringListValue: paramValue,
    });
  }
}

const app = new cdk.App({
  treeMetadata: false,
});
app.node.setContext('@aws-cdk/core:newStyleStackSynthesis', true);
const base = new TestCaseBase(app, 'base');
const testCase = new cdk.Stack(app, 'list-param');

// creates the dependency between stacks
new cdk.CfnOutput(testCase, 'Output', {
  value: cdk.Fn.join(',', base.listParam.stringListValue),
});

/**
 * get the value from the `base` stack and then write it to a new parameter
 * We will then assert that the value that is written is the correct value
 * This validates that the `fromXXX` and `valueForXXX` imports the value correctly
 */

const fromAttrs = ssm.StringListParameter.fromListParameterAttributes(testCase, 'FromAttrs', {
  parameterName: paramName,
  elementType: ssm.ParameterValueType.STRING,
});
const ssmAttrsValue = new ssm.CfnParameter(testCase, 'attrs-test', {
  type: 'StringList',
  value: cdk.Fn.join(',', fromAttrs.stringListValue),
});

const value = ssm.StringListParameter.valueForTypedListParameter(testCase, paramName, ssm.ParameterValueType.STRING);
const ssmValue = new ssm.CfnParameter(testCase, 'value-test', {
  type: 'StringList',
  value: cdk.Fn.join(',', value),
});

const versionValue = ssm.StringListParameter.valueForTypedListParameter(testCase, paramName, ssm.ParameterValueType.STRING, 1);
const ssmVersionValue = new ssm.CfnParameter(testCase, 'version-value-test', {
  type: 'StringList',
  value: cdk.Fn.join(',', versionValue),
});

const integ = new IntegTest(app, 'ssm-string-param', {
  testCases: [
    testCase,
  ],
});

// list the parameters
const actualAttrs = integ.assertions.awsApiCall('SSM', 'getParameters', {
  Names: [ssmVersionValue.ref, ssmValue.ref, ssmAttrsValue.ref],
});

actualAttrs.expect(ExpectedResult.objectLike({
  Parameters: Match.arrayWith([
    Match.objectLike({
      Value: paramValue.join(','),
    }),
    Match.objectLike({
      Value: paramValue.join(','),
    }),
    Match.objectLike({
      Value: paramValue.join(','),
    }),
  ]),
}));
