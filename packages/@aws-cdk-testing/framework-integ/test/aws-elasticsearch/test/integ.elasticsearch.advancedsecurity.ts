import { User } from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as es from 'aws-cdk-lib/aws-elasticsearch';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const user = new User(this, 'User');

    new es.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: es.ElasticsearchVersion.V7_1,
      fineGrainedAccessControl: {
        masterUserArn: user.userArn,
      },
      encryptionAtRest: {
        enabled: true,
      },
      nodeToNodeEncryption: true,
      enforceHttps: true,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch-advancedsecurity');
app.synth();
