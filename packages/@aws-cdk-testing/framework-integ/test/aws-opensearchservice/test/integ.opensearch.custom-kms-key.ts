import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'Key');

    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      encryptionAtRest: {
        enabled: true,
        kmsKey: key,
      },
      accessPolicies: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['es:ESHttp*'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-custom-kms-key');

new IntegTest(app, 'OpenSearchCustomKmsInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
