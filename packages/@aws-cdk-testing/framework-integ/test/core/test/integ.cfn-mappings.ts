import * as cdk from 'aws-cdk-lib/core';
//import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

// we associate this stack with an explicit environment since this is required by the
// environmental context provider used in `fromLookup`. CDK_INTEG_XXX are set
// when producing the .expected file and CDK_DEFAULT_XXX is passed in through from
// the CLI in actual deployment.
/*
const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};
*/

const stack = new cdk.Stack(app, 'core-cfn-mapping-1'/*,{ env }*/);

const backing = {
  TopLevelKey1: {
    SecondLevelKey1: [1, 2, 3],
    SecondLevelKey2: { Hello: 'World' },
  },
};

const mapping = new cdk.CfnMapping(stack, 'Lazy Mapping', {
  mapping: backing,
  //lazy: true,
});

const defValue = 'foo';
const m1 = mapping.findInMap('TopLevelKey1', 'SecondLevelKey3', defValue);

new cdk.CfnOutput(stack, 'Output', { value: m1.toString() });

/*
new Bucket(stack, 'buck', {
  bucketName: 'buck1',
});
*/

new IntegTest(app, 'CfnMappingTest', {
  testCases: [stack],
});

app.synth();