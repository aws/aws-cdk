import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, Ec2TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationMultipleTargetGroupsEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { REDUCE_EC2_FARGATE_CLOUDWATCH_PERMISSIONS } from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [REDUCE_EC2_FARGATE_CLOUDWATCH_PERMISSIONS]: false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-multiple-alb');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

// A httpd task expose both port 80 and 90
const taskDefinition = new Ec2TaskDefinition(stack, 'TaskDef', {});
taskDefinition.addContainer('web', {
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  command: [
    'sh',
    '-c',
    "printf 'Listen 90\n <VirtualHost *:90>\n DocumentRoot /var/www/html\n ServerName localhost\n</VirtualHost>' > /etc/httpd/conf.d/default-90.conf && /usr/sbin/apache2 -D FOREGROUND",
  ],
  memoryLimitMiB: 256,
});

// One load balancer with one listener and two target groups.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  taskDefinition,
  enableExecuteCommand: true,
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
    },
  ],
});

new integ.IntegTest(app, 'applicationMultipleTargetGroupsEc2ServiceTest', {
  testCases: [stack],
});

app.synth();
