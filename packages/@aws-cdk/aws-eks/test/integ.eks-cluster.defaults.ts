import cdk = require('@aws-cdk/core');
import eks = require('../lib');

class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new eks.Cluster(this, 'Cluster');
  }
}

const app = new cdk.App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-defaults', {
  env: {
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  }
});

app.synth();