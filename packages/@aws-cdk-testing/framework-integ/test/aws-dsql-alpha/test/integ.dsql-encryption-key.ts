import { App, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as dsql from '@aws-cdk/aws-dsql-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'DSQLEncryptionKeyStack');

// Create a KMS key and pass it as the encryptionKey for the DSQL Cluster.
// This exercises the new encryptionKey property on the L2 construct.
const key = new kms.Key(stack, 'DSQLKey', {
  enableKeyRotation: true,
});

new dsql.Cluster(stack, 'DSQLCluster', {
  encryptionKey: key,
});

new IntegTest(app, 'DSQLEncryptionKeyTest', {
  testCases: [stack],
});

app.synth();
