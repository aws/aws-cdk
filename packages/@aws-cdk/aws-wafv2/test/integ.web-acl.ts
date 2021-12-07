import * as cdk from '@aws-cdk/core';
import * as wafv2 from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new wafv2.WebAcl(this, 'WebAcl', {
      webAclName: 'my-web-acl-name',
      scope: wafv2.Scope.CLOUDFRONT,
      defaultAction: wafv2.DefaultAction.block(),
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: 'test-metric-name',
        sampledRequestsEnabled: false,
      },
    });
  }
}

new TestStack(app, 'test-stack', {
  env: {
    region: 'us-east-1',
  },
});
app.synth();
