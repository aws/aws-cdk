import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { TOKEN_AWARE_STRINGIFY_LOGICAL_ID_FROM_TOKEN_VALUE } from 'aws-cdk-lib/cx-api';

interface TokenAwareStringifyStackProps extends cdk.StackProps {
  readonly ffEnabled: boolean;
}

class TokenAwareStringifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TokenAwareStringifyStackProps) {
    super(scope, id, props);
    this.node.setContext(TOKEN_AWARE_STRINGIFY_LOGICAL_ID_FROM_TOKEN_VALUE, props.ffEnabled);

    const queue = new sqs.Queue(this, 'queue');

    let destinationBucket = new s3.Bucket(this, 'WebsiteBucket');

    new BucketDeployment(this, 's3deploy', {
      sources: [Source.jsonData('file.json', { MyQueueArn: queue.queueArn })],
      destinationBucket,
    });
  }
}

const app = new cdk.App();
const ffEnabledStack = new TokenAwareStringifyStack(app, 'FFEnabledStack', { ffEnabled: true });
const ffDisabledStack = new TokenAwareStringifyStack(app, 'FFDisabledStack', { ffEnabled: false });

new integ.IntegTest(app, 'TokenAwareStringifyLogicalIds', {
  testCases: [ffEnabledStack, ffDisabledStack],
});
