import cdk = require('@aws-cdk/core');
import ec2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');

const vpc = new ec2.Vpc(stack, 'MyVpc');

// Test NetworkAcl and rules

const nacl1 = new ec2.NetworkAcl(stack, 'myNACL1', {vpc});

new ec2.NetworkAclEntry(stack, 'AllowDNSEgress', {
      networkAcl: nacl1,
      ruleNumber: 100,
      protocol: 17,
      ruleAction: 'allow',
      egress: true,
      cidrBlock: '172.16.0.0/24',
      icmp: {code: -1, type: -1},
      portRange: {from: 53, to: 53}
      } );

new ec2.NetworkAclEntry(stack, 'AllowDNSIngress', {
        networkAcl: nacl1,
        ruleNumber: 100,
        protocol: 17,
        ruleAction: 'allow',
        egress: false,
        cidrBlock: '0.0.0.0/0',
        icmp: {code: -1, type: -1},
        portRange: {from: 53, to: 53}
        } );

for (const subnet of vpc.privateSubnets) {
    new ec2.SubnetNetworkAclAssociation(stack, 'AssociatePrivate' + subnet.node.uniqueId, {
      networkAclId: nacl1.networkAclId, subnetId: subnet.subnetId,
        });
}

app.synth();
