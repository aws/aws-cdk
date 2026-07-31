/// !cdk-integ STACK SameRegionWeakStringListTestDefaultTestDeployAssertF89EBA7F

import * as cdk from 'aws-cdk-lib/core';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'weak' },
});

const producingStack = new cdk.Stack(app, 'SameRegionWeakStringListProducer', {
  env: {
    region: 'eu-central-1',
  },
});

const vpc = new ec2.CfnVPC(producingStack, 'Vpc', {
  cidrBlock: '10.0.0.0/16',
});

new ec2.CfnVPCCidrBlock(producingStack, 'SecondaryCidr', {
  vpcId: vpc.ref,
  cidrBlock: '10.1.0.0/16',
});

const consumingStack = new cdk.Stack(app, 'SameRegionWeakStringListConsumer', {
  env: {
    region: 'eu-central-1',
  },
});

new ssm.StringParameter(consumingStack, 'ParamFromList', {
  parameterName: 'WEAK_STRING_LIST_TEST',
  stringValue: cdk.Fn.select(1, vpc.attrCidrBlockAssociations),
});

consumingStack.addDependency(producingStack);

new IntegTest(app, 'SameRegionWeakStringListTest', {
  testCases: [consumingStack],
  regions: ['eu-central-1'],
  diffAssets: true,
});
