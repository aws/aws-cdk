import cdk = require('@aws-cdk/cdk');

export class TestStack extends cdk.Stack {
  public testInvokeAspects() {
    this.invokeAspects();
  }
}
