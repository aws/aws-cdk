import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc-azs');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

new ec2.Vpc(stack, 'MyVpc', {
  availabilityZones: [stack.availabilityZones[1]],
});

app.synth();
