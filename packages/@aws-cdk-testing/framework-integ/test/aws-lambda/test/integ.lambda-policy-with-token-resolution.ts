import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'stack');

const mappingName = 'testmapping';
const mapping = new cdk.CfnMapping(stack, 'testmapping', {
  mapping: {
    us: {
      regionalModels:
        'arn:aws:bedrock:us-west-2::foundation-model/amazon.nova-lite-v1:0',
    },
  },
});
mapping.overrideLogicalId(mappingName);

const func = new lambda.Function(stack, 'test-function', {
  code: new lambda.InlineCode('exports.handler = async (event) => { console.log(event); return {\'statusCode\': 200, \'body\': \'\'}; }'),
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
});

// Literal resources in statement
func.addToRolePolicy(new iam.PolicyStatement({
  actions: ['bedrock:Invoke*'],
  resources: [
    '*',
  ],
}));

// Array token resources in statement
func.addToRolePolicy(new iam.PolicyStatement({
  actions: ['bedrock:Invoke*'],
  resources: cdk.Fn.split(',', cdk.Fn.findInMap(mappingName, 'us', 'regionalModels')),
}));

new integ.IntegTest(app, 'lambda-policy-with-token-resolution', {
  testCases: [stack],
});
