import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

class LogRetentionRetriesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    for (let i = 0; i < 25; i++) {
      new lambda.Function(this, `hello_${i}`, {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('export async handler() { return; }'),
        logRetention: logs.RetentionDays.ONE_WEEK,
      });
    }
  }
}

const app = new App();
const numberOfStacks = 3;
const stacks = [...Array(numberOfStacks).keys()].map((i) => new LogRetentionRetriesStack(app, 'aws-cdk-log-retention-integ-retries' + i));

/**
 * Deploys multiple stacks in parallel, which causes the LogRetention Custom Resource to fail with `ThrottlingException: Rate exceeded`
 * This test ensures that the CRs correctly retry on ThrottlingException
 * When deploying a single stack at a time, throttling is not an issue because resources are created by CFN with a slight delay
 */
new IntegTest(app, 'LogRetentionIntegRetries', {
  testCases: stacks,
  cdkCommandOptions: {
    deploy: {
      args: {
        concurrency: numberOfStacks,
      },
    },
  },
});

app.synth();
