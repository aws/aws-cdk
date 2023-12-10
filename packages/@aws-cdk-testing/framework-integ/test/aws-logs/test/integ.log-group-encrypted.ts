import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Key } from 'aws-cdk-lib/aws-kms';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'Key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
      encryptionKey: key,
    });
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-encrypted-integ');

new IntegTest(app, 'LogGroupEncryptedInteg', { testCases: [stack] });

app.synth();