import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';

/**
 * This integration test verifies that an ECS service can register with a Cloud Map
 * service that creates both A and SRV records, and that the SRV record still targets
 * a container and port through the service registry.
 */
class CloudMapAAndSrvRecordsStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
    });

    this.cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    this.cluster.addDefaultCloudMapNamespace({ name: 'aws-ecs-integ-a-srv' });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const container = taskDefinition.addContainer('container', {
      containerName: 'web',
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'web' }),
    });
    container.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    this.service = new ecs.FargateService(this, 'Service', {
      cluster: this.cluster,
      taskDefinition,
      desiredCount: 1,
      minHealthyPercent: 100,
      cloudMapOptions: {
        name: 'frontend',
        dnsRecordType: cloudmap.DnsRecordType.A_SRV,
        dnsTtl: cdk.Duration.seconds(30),
      },
    });
  }
}

const app = new cdk.App({
  analyticsReporting: false,
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new CloudMapAAndSrvRecordsStack(app, 'aws-ecs-cloudmap-a-and-srv-records');

const test = new integ.IntegTest(app, 'CloudMapAAndSrvRecords', {
  testCases: [stack],
});

// The ECS service registry targets the container and port, as it does for a plain SRV record
const describeServices = test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: stack.cluster.clusterName,
  services: [stack.service.serviceName],
});
describeServices.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['ecs:DescribeServices'],
  Resource: ['*'],
});
describeServices.expect(integ.ExpectedResult.objectLike({
  services: integ.Match.arrayWith([
    integ.Match.objectLike({
      serviceRegistries: [
        integ.Match.objectLike({
          containerName: 'web',
          containerPort: 80,
        }),
      ],
    }),
  ]),
}));

// The Cloud Map service really carries both an A and an SRV record
const getService = test.assertions.awsApiCall('ServiceDiscovery', 'getService', {
  Id: stack.service.cloudMapService!.serviceId,
});
getService.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['servicediscovery:GetService'],
  Resource: ['*'],
});
getService.expect(integ.ExpectedResult.objectLike({
  Service: integ.Match.objectLike({
    DnsConfig: integ.Match.objectLike({
      DnsRecords: [
        integ.Match.objectLike({ Type: 'A', TTL: 30 }),
        integ.Match.objectLike({ Type: 'SRV', TTL: 30 }),
      ],
    }),
  }),
}));
