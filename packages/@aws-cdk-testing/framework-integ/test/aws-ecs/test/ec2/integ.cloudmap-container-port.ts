import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  subnetConfiguration: [
    {
      name: 'pub',
      cidrMask: 24,
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const capacity = cluster.addCapacity('capacity', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  desiredCapacity: 1,
  minCapacity: 1,
  maxCapacity: 1,
});
capacity.connections.allowFromAnyIpv4(ec2.Port.tcpRange(32768, 61000));

cluster.addDefaultCloudMapNamespace({ name: 'aws-ecs-integ' });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {});

// Main container
const mainContainer = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
});

mainContainer.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

// Name container with SRV
const nameContainer = taskDefinition.addContainer('name', {
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '81',
  },
  memoryReservationMiB: 32,
  memoryLimitMiB: 512,
});

nameContainer.addPortMappings({
  containerPort: 81,
  protocol: ecs.Protocol.TCP,
});

new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 3,
  cloudMapOptions: {
    container: nameContainer,
    containerPort: 81,
    dnsRecordType: cloudmap.DnsRecordType.SRV,
  },
});

app.synth();
