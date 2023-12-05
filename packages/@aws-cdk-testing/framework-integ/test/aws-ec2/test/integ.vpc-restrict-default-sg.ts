import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Stack, App } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'integ-restrict-default-sg');

const vpc = new Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: true,
});

const integ = new IntegTest(app, 'integ-test', {
  testCases: [stack],
  diffAssets: true,
});

const res = integ.assertions.awsApiCall('EC2', 'describeSecurityGroups', {
  GroupIds: [vpc.vpcDefaultSecurityGroup],
});

res.expect(ExpectedResult.objectLike({
  SecurityGroups: Match.arrayWith([Match.objectLike({
    Description: 'default VPC security group',
    GroupName: 'default',
    IpPermissions: [],
    IpPermissionsEgress: [],
  })]),
}));
