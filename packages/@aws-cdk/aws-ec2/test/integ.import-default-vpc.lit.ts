import cdk = require('@aws-cdk/cdk');
import ec2 = require("../lib");

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-import');

/// !show
const vpc = ec2.VpcNetwork.importFromContext(stack, 'VPC', {
  // This imports the default VPC but you can also
  // specify a 'vpcName' or 'tags'.
  isDefault: true
});
/// !hide

// The only thing in this library that takes a VPC as an argument :)
new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc
});

// Try subnet selection
new cdk.Output(stack, 'PublicSubnets', { value: 'ids:' + vpc.subnets({ subnetsToUse: ec2.SubnetType.Public }).map(s => s.subnetId).join(',') });
new cdk.Output(stack, 'PrivateSubnets', { value: 'ids:' + vpc.subnets({ subnetsToUse: ec2.SubnetType.Private }).map(s => s.subnetId).join(',') });

app.run();
