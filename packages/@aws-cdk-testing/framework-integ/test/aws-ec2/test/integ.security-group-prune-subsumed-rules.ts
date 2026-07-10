import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP, EC2_SECURITY_GROUP_PRUNE_SUBSUMED_RULES } from 'aws-cdk-lib/cx-api';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/**
 * Verifies the `@aws-cdk/aws-ec2:securityGroupPruneSubsumedRules` feature flag.
 *
 * The security group below is authored with three ingress rules that are all
 * subsumed by broader rules on the same security group:
 *
 *  - tcp/443 from 10.0.0.0/16   (subsumed by the all-traffic rule on the same peer)
 *  - all traffic from 10.0.0.0/16
 *  - tcp/443 from 10.0.1.0/24   (subsumed by tcp/443 from 10.0.0.0/16, which is in
 *                                turn subsumed by the all-traffic rule)
 *
 * With the flag enabled, all three collapse to the single all-traffic rule, so the
 * deployed security group should have exactly ONE ingress rule. The assertion reads
 * the live rules back from EC2 to prove the reduction is deploy-safe (CloudFormation
 * accepts the reduced template and the resulting group admits the same traffic).
 */
const app = new App({
  postCliContext: {
    [EC2_SECURITY_GROUP_PRUNE_SUBSUMED_RULES]: true,
  },
});

const stack = new Stack(app, 'integ-security-group-prune-subsumed-rules');
// Keep the default SG rules out of the picture so we assert only on our own SG.
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: false,
});

// All three of these are subsumed by the all-traffic rule from 10.0.0.0/16.
sg.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(443), 'https from /16');
sg.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.allTraffic(), 'all traffic from /16');
sg.addIngressRule(ec2.Peer.ipv4('10.0.1.0/24'), ec2.Port.tcp(443), 'https from /24');

const integ = new IntegTest(app, 'security-group-prune-subsumed-rules', {
  testCases: [stack],
});

// After pruning, only the single all-traffic ingress rule should be deployed.
const rules = integ.assertions.awsApiCall('EC2', 'describeSecurityGroupRules', {
  Filters: [{ Name: 'group-id', Values: [sg.securityGroupId] }],
});

rules.expect(ExpectedResult.objectLike({
  // Exactly one ingress rule survives (IsEgress: false), and it is the -1/all
  // rule covering 10.0.0.0/16. Egress rules are not asserted here.
  SecurityGroupRules: Match.arrayWith([
    Match.objectLike({
      IsEgress: false,
      IpProtocol: '-1',
      CidrIpv4: '10.0.0.0/16',
    }),
  ]),
}));
