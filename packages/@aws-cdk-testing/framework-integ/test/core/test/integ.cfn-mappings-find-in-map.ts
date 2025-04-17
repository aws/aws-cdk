import * as cdk from 'aws-cdk-lib/core';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'core-cfn-mapping-1'/* ,{ env }*/);

const backing = {
  TopLevelKey1: {
    SecondLevelKey1: 'Yes',
    SecondLevelKey2: 'No',
  },
};

const mapping = new cdk.CfnMapping(stack, 'Regular mapping', {
  mapping: backing,
});

const lazyMapping = new cdk.CfnMapping(stack, 'Lazy mapping', {
  mapping: backing,
  lazy: true,
});

const defValue = 'foob';
const defValue2 = 'bart';

const mapYes = mapping.findInMap('TopLevelKey1', 'SecondLevelKey1', defValue); // resolve to 'Yes'
const mapDefault = mapping.findInMap('TopLevelKey1', cdk.Aws.REGION, defValue); // resolve to 'foob'
const mapFn = cdk.Fn.findInMap(mapping.logicalId, 'TopLevelKey1', 'SecondLevelKey3', defValue); // resolve to 'foob'

const lazyNo = lazyMapping.findInMap('TopLevelKey1', 'SecondLevelKey2', defValue2); // short circuit to 'No'
const lazyDefault = lazyMapping.findInMap('TopLevelKey2', 'SecondLevelKey2', defValue2); // short circuit to 'bart'
const lazyResolve = lazyMapping.findInMap(cdk.Aws.REGION, 'SecondLevelKey2', defValue2); // resolve to 'bart'

new cdk.CfnOutput(stack, 'Output0', { value: mapYes });
new cdk.CfnOutput(stack, 'Output1', { value: mapDefault });
new cdk.CfnOutput(stack, 'Output2', { value: mapFn });
new cdk.CfnOutput(stack, 'Output3', { value: lazyNo });
new cdk.CfnOutput(stack, 'Output4', { value: lazyDefault });
new cdk.CfnOutput(stack, 'Output5', { value: lazyResolve });

new Bucket(stack, 'CfnMappingFindInMapBucket');

new IntegTest(app, 'CfnMappingFindInMapTest', {
  testCases: [stack],
});

app.synth();
