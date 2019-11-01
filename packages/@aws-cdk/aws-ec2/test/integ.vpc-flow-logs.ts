/// !cdk-integ *
import cdk = require('@aws-cdk/core');
import ec2 = require("../lib");

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    new ec2.VpcFlowLog(this, 'FlowLogsCW', {
      resourceType: {
        vpc: vpc
      }
    });

    vpc.addFlowLog('FlowLogsS3', {
      destinationType: ec2.VpcFlowLogDestinationType.S3,
    });
  }
}

new TestStack(app, 'TestStack');

app.synth();
