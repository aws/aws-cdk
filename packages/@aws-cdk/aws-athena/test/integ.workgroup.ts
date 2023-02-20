import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

import { IntegTest } from '@aws-cdk/integ-tests';
import * as athena from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-athena-workgroup-tags');

new athena.WorkGroup(stack, 'AthenaWorkgroup', {
  workGroupName: 'HelloWorld',
  description: 'A WorkGroup',
  recursiveDeleteOption: true,
  state: athena.WorkGroupState.ENABLED,
  configuration: {
    engineVersion: athena.EngineVersion.AUTO,
    enforceWorkGroupConfiguration: true,
    publishCloudWatchMetricsEnabled: true,
    bytesScannedCutoffPerQuery: 20000000,
    resultConfigurations: {
      encryptionConfiguration: {
        encryptionOption: athena.EncryptionOption.KMS,
        kmsKey: new kms.Key(stack, 'Key'),
      },
      outputLocation: {
        bucket: new s3.Bucket(stack, 'AthenaBucket'),
        s3Prefix: 'athena/results/',
      },
    },
  },
  tags: {
    key1: 'value1',
    key2: 'value2',
  },
});

new IntegTest(app, 'athena-workgroup-test', {
  testCases: [stack],
});

app.synth();
