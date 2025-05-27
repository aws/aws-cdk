import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': true,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-ecs-al2023-ami');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

const insRole = new iam.Role(stack, 'InstanceRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  managedPolicies: [
    // following policy contains permission needed by the ECS agent: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceForEC2Role'), // for ECS
    // following policy allows ssh-ing into the instance via the AWS Console SSM manager. Good for debugging this integ test
    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'), // for SSM
  ],
});
insRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const userData = ec2.UserData.forLinux();
// echo each commands so they appear in /var/log/cloud-init-output.log
userData.addCommands('set -x');
// error out on any commands failure in the UserData so that cfn-signal will not run at the end, thus, failing the cfn deployment
userData.addCommands('set -e');

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  role: insRole,
  userData,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2023(),
  minCapacity: 1,
  signals: autoscaling.Signals.waitForMinCapacity({
    timeout: cdk.Duration.minutes(10),
  }),
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp);
autoScalingGroup.addUserData('yum install -y aws-cfn-bootstrap');
// cfn-signal sends a signal to CFN to indicate ASG creation is completed
autoScalingGroup.addUserData(`/opt/aws/bin/cfn-signal -e $? --stack ${stack.stackId}`
  +` --resource ${(autoScalingGroup.node.defaultChild as autoscaling.CfnAutoScalingGroup).logicalId}`
  + ` --region ${stack.region}`);

new integ.IntegTest(app, 'ClusterAL2023', {
  testCases: [stack],
});
