import * as cdk from '../../core';
import * as ec2 from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope:cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.VpcEndpointService(this, 'vpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [],
      acceptanceRequired: true,
      contributorInsightsEnabled: true,
    });
  }

}

new TestStack(app, 'TestStack');

app.synth();
