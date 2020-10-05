import { User } from '@aws-cdk/aws-iam';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as es from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const user = new User(this, 'User');

    new es.Domain(this, 'Domain', {
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
