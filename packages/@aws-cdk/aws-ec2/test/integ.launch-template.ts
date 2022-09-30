import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.LaunchTemplate(this, 'LT', {
      httpEndpoint: true,
      httpProtocolIpv6: true,
      httpPutResponseHopLimit: 2,
      httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
      instanceMetadataTags: true,
    });
  }
}

new TestStack(app, 'TestStack');

app.synth();

