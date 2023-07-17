import { User } from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const user = new User(this, 'User');

    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      fineGrainedAccessControl: {
        masterUserArn: user.userArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-opensearch-advancedsecurity');
app.synth();
