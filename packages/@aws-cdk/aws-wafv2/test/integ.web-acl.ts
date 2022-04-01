import * as cdk from '@aws-cdk/core';
import * as wafv2 from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new wafv2.WebAcl(this, 'WebAcl', {
      webAclName: 'my-web-acl-name',
      scope: wafv2.Scope.CLOUDFRONT,
      defaultAction: wafv2.DefaultAction.block(),
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'web-acl-integ-stack');
app.synth();
