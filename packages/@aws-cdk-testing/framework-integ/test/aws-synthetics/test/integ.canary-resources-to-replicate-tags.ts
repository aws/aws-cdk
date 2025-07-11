import * as path from 'node:path';
import { App, Duration, Size, Stack, StackProps, Tags } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public canary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.canary = new synthetics.Canary(this, 'TagReplicationCanary', {
      canaryName: 'tag-replication',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
      }),
      memory: Size.mebibytes(1024),
      timeout: Duration.minutes(3),
      resourcesToReplicateTags: [synthetics.ResourceToReplicateTags.LAMBDA_FUNCTION],
    });

    Tags.of(this.canary).add('Environment', 'test');
    Tags.of(this.canary).add('Owner', 'cdk-team');
    Tags.of(this.canary).add('Project', 'synthetics-tag-replication');
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryResourcesToReplicateTagsStack');

new IntegTest(app, 'SyntheticsCanaryResourcesToReplicateTags', {
  testCases: [testStack],
});
