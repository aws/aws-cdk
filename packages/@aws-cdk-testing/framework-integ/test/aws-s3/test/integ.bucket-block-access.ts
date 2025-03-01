import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { BlockPublicAccess, BlockPublicAccessV2, Bucket } from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-s3-block-access');

new Bucket(stack, 'deprecatedBlockAcl', {
  blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
});

new Bucket(stack, 'deprecatedBlock', {
  blockPublicAccess: new BlockPublicAccess({
    blockPublicAcls: false,
  }),
});

new Bucket(stack, 'newBlockAcl', {
  blockPublicAccessV2: BlockPublicAccessV2.BLOCK_ACLS_ONLY,
});

new Bucket(stack, 'newBlock', {
  blockPublicAccessV2: {
    blockPublicAcls: false,
  },
});

new IntegTest(app, 'blockAccessTest', {
  testCases: [stack],
});
