import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Key } from 'aws-cdk-lib/aws-kms';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import * as cxapi from 'aws-cdk-lib/cx-api';

class LogGroupEncryptionKeyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new Key(this, 'Key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // With the feature flag enabled, the LogGroup adds the required grant to the
    // key policy automatically. Reaching CREATE_COMPLETE proves the grant works:
    // without it, CloudWatch Logs rejects the CreateLogGroup call.
    new LogGroup(this, 'LogGroup', {
      encryptionKey: key,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App({
  context: { [cxapi.LOG_GROUP_GRANT_ENCRYPTION_KEY]: true },
});
const stack = new LogGroupEncryptionKeyStack(app, 'aws-cdk-log-group-encryption-key-integ');

new IntegTest(app, 'LogGroupEncryptionKeyInteg', { testCases: [stack] });
