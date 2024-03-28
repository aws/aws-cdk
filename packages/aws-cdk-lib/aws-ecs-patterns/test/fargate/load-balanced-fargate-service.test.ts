import { Match, Template } from '../../../assertions';
import { AutoScalingGroup } from '../../../aws-autoscaling';
import { Certificate, CertificateValidation } from '../../../aws-certificatemanager';
import * as ec2 from '../../../aws-ec2';
import { MachineImage } from '../../../aws-ec2';
import * as ecs from '../../../aws-ecs';
import { AsgCapacityProvider } from '../../../aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, NetworkLoadBalancer, SslPolicy } from '../../../aws-elasticloadbalancingv2';
import * as iam from '../../../aws-iam';
import * as route53 from '../../../aws-route53';
import * as cloudmap from '../../../aws-servicediscovery';
import * as cdk from '../../../core';
import * as ecsPatterns from '../../lib';

describe('ApplicationLoadBalancedFargateService', () => {
  test('setting healthCheckGracePeriod works', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      healthCheckGracePeriod: cdk.Duration.seconds(600),
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      HealthCheckGracePeriodSeconds: 600,
    });
  });

  test('setting healthCheck works', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost/ || exit 1'],
        interval: cdk.Duration.minutes(1),
        retries: 5,
        startPeriod: cdk.Duration.minutes(1),
        timeout: cdk.Duration.minutes(1),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: Match.arrayWith([
        Match.objectLike({
          HealthCheck: {
            Command: ['CMD-SHELL', 'curl -f http://localhost/ || exit 1'],
            Interval: 60,
            Retries: 5,
            StartPeriod: 60,
            Timeout: 60,
          },
        }),
      ]),
    });
  });

  test('selecting correct vpcSubnets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 20,
          name: 'Public',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 20,
          name: 'ISOLATED',
        },
      ],
    });
    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      vpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      taskSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          Subnets: [
            {
              Ref: 'VpcISOLATEDSubnet1Subnet80F07FA0',
            },
            {
              Ref: 'VpcISOLATEDSubnet2SubnetB0B548C3',
            },
          ],
        },
      },
    });
  });

  test('target group uses HTTP/80 as default', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 80,
      Protocol: 'HTTP',
    });
  });

  test('target group uses HTTPS/443 when configured', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      targetProtocol: ApplicationProtocol.HTTPS,
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 443,
      Protocol: 'HTTPS',
    });
  });

  test('setting platform version', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });
  });

  test('load balanced service with family defined', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        family: 'fargate-task-family',
      },
      desiredCount: 2,
      memoryLimitMiB: 512,
      serviceName: 'fargate-test-service',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 2,
      LaunchType: 'FARGATE',
      ServiceName: 'fargate-test-service',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          Image: '/aws/aws-example-app',
        }),
      ],
      Family: 'fargate-task-family',
    });
  });

  test('setting ALB deployment controller', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      deploymentController: {
        type: ecs.DeploymentControllerType.CODE_DEPLOY,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentController: {
        Type: 'CODE_DEPLOY',
      },
    });
  });

  test('setting a command for taskImageOption', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        command: ['./app/bin/start.sh', '--foo'],
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: '/aws/aws-example-app',
          Command: ['./app/bin/start.sh', '--foo'],
        }),
      ],
    });
  });

  test('setting an entryPoint for taskImageOptions', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        entryPoint: ['echo', 'foo'],
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: '/aws/aws-example-app',
          EntryPoint: ['echo', 'foo'],
        }),
      ],
    });
  });

  test('setting ALB circuitBreaker works', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      circuitBreaker: { rollback: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        DeploymentCircuitBreaker: {
          Enable: true,
          Rollback: true,
        },
      },
      DeploymentController: {
        Type: 'ECS',
      },
    });
  });

  test('setting ALB special listener port to create the listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      listenerPort: 2015,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        Match.objectLike({
          Type: 'forward',
        }),
      ],
      Port: 2015,
      Protocol: 'HTTP',
    });
  });

  test('setting ALB HTTPS protocol to create the listener on 443', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTPS,
      domainName: 'domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com',
      }),
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        Match.objectLike({
          Type: 'forward',
        }),
      ],
      Port: 443,
      Protocol: 'HTTPS',
    });
  });

  test('setting ALB HTTPS correctly sets the recordset name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTPS,
      domainName: 'test.domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com.',
      }),
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'test.domain.com.',
    });
  });

  test('setting ALB cname option correctly sets the recordset type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTPS,
      domainName: 'test.domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com.',
      }),
      recordType: ecsPatterns.ApplicationLoadBalancedServiceRecordType.CNAME,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'test.domain.com.',
      Type: 'CNAME',
    });
  });

  test('setting ALB record type to NONE correctly omits the recordset', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTPS,
      domainName: 'test.domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com.',
      }),
      recordType: ecsPatterns.ApplicationLoadBalancedServiceRecordType.NONE,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Route53::RecordSet', 0);
  });

  test('setting ALB HTTP protocol to create the listener on 80', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTP,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        Match.objectLike({
          Type: 'forward',
        }),
      ],
      Port: 80,
      Protocol: 'HTTP',
    });
  });

  test('setting ALB without any protocol or listenerPort to create the listener on 80', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        Match.objectLike({
          Type: 'forward',
        }),
      ],
      Port: 80,
      Protocol: 'HTTP',
    });
  });

  test('passing in previously created application load balancer', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
    const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    cluster.connections.addSecurityGroup(sg);
    const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc, securityGroup: sg });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancer: alb,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'application',
    });
  });

  test('passing in imported application load balancer and resources', () => {
    // GIVEN
    const stack1 = new cdk.Stack();
    const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
    const vpc = new ec2.Vpc(stack1, 'Vpc');
    const cluster = new ecs.Cluster(stack1, 'Cluster', { vpc, clusterName: 'MyClusterName' });
    const sg = new ec2.SecurityGroup(stack1, 'SecurityGroup', { vpc });
    cluster.connections.addSecurityGroup(sg);
    const alb = ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack1, 'ALB', {
      loadBalancerArn: albArn,
      vpc,
      securityGroupId: sg.securityGroupId,
      loadBalancerDnsName: 'MyDnsName',
    });

    // WHEN
    const taskDef = new ecs.FargateTaskDefinition(stack1, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 1024,
    });
    const container = taskDef.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 1024,
    });
    container.addPortMappings({
      containerPort: 80,
    });

    new ecsPatterns.ApplicationLoadBalancedFargateService(stack1, 'FargateALBService', {
      cluster,
      loadBalancer: alb,
      desiredCount: 1,
      taskDefinition: taskDef,
    });

    // THEN
    Template.fromStack(stack1).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      LoadBalancers: [Match.objectLike({ ContainerName: 'Container', ContainerPort: 80 })],
    });

    Template.fromStack(stack1).resourceCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', 1);

    Template.fromStack(stack1).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      LoadBalancerArn: alb.loadBalancerArn,
      Port: 80,
    });
  });

  test('passing in previously created security groups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      allowAllOutbound: false,
      description: 'Example',
      securityGroupName: 'Rolly',
      vpc,
    });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      securityGroups: [securityGroup],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Example',
      GroupName: 'Rolly',
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86,
        },
      ],
      VpcId: {
        Ref: 'Vpc8378EB38',
      },
    });
  });

  test('domainName and domainZone not required for HTTPS listener with provided cert', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const exampleDotComZone = new route53.PublicHostedZone(stack, 'ExampleDotCom', {
      zoneName: 'example.com',
    });
    const certificate = new Certificate(stack, 'Certificate', {
      domainName: 'test.example.com',
      validation: CertificateValidation.fromDns(exampleDotComZone),
    });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
      cluster,
      protocol: ApplicationProtocol.HTTPS,

      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
      certificate: certificate,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Route53::RecordSet', 0);
  });

  test('with docker labels defined', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: '/aws/aws-example-app',
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        }),
      ],
    });
  });

  test('Passing in token for desiredCount will not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const param = new cdk.CfnParameter(stack, 'prammm', {
      type: 'Number',
      default: 1,
    });

    // WHEN
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      desiredCount: param.valueAsNumber,
    });

    // THEN
    expect(() => {
      service.internalDesiredCount;
    }).toBeTruthy;
  });

  test('multiple capacity provider strategies are set', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.enableFargateCapacityProviders();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE',
          base: 1,
          weight: 1,
        },
        {
          capacityProvider: 'FARGATE_SPOT',
          base: 0,
          weight: 2,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      CapacityProviderStrategy: Match.arrayEquals([
        {
          Base: 1,
          CapacityProvider: 'FARGATE',
          Weight: 1,
        },
        {
          Base: 0,
          CapacityProvider: 'FARGATE_SPOT',
          Weight: 2,
        },
      ]),
    });
  });

  test('should validate minHealthyPercent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      minHealthyPercent: 0.5,
    })).toThrow(/Must be a non-negative integer/);
  });

  test('should validate maxHealthyPercent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      maxHealthyPercent: 0.5,
    })).toThrow(/Must be a non-negative integer/);
  });

  test('minHealthyPercent must be less than maxHealthyPercent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 70,
    })).toThrow(/must be less than/);
  });

  test('test Fargate loadbalanced construct', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
        entryPoint: ['echo', 'running-on-fargate'],
        command: ['/bin/bash'],
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
          EntryPoint: ['echo', 'running-on-fargate'],
          Command: ['/bin/bash'],
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 2,
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80,
      Protocol: 'HTTP',
    });
  });

  test('test Fargate loadbalanced construct opting out of log driver creation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          LogConfiguration: Match.absent(),
        }),
      ],
    });
  });

  test('test Fargate loadbalanced construct with TLS', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      domainName: 'api.example.com',
      domainZone: zone,
      certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
      sslPolicy: SslPolicy.TLS12_EXT,
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Protocol: 'HTTPS',
      Certificates: [{
        CertificateArn: 'helloworld',
      }],
      SslPolicy: SslPolicy.TLS12_EXT,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 80,
      Protocol: 'HTTP',
      TargetType: 'ip',
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
        DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] }]] },
      },
    });
  });

  test('test Fargateloadbalanced construct with TLS and default certificate', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      domainName: 'api.example.com',
      domainZone: zone,
      protocol: ApplicationProtocol.HTTPS,
    });

    // THEN - stack contains a load balancer, a service, and a certificate
    Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'api.example.com',
      DomainValidationOptions: [
        {
          DomainName: 'api.example.com',
          HostedZoneId: {
            Ref: 'HostedZoneDB99F866',
          },
        },
      ],
      ValidationMethod: 'DNS',
    });

    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Protocol: 'HTTPS',
      Certificates: [{
        CertificateArn: {
          Ref: 'ServiceCertificateA7C65FE6',
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
        DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] }]] },
      },
    });
  });

  test('errors when setting domainName but not domainZone', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        domainName: 'api.example.com',
      });
    }).toThrow();
  });

  test('errors when setting both HTTP protocol and certificate', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        protocol: ApplicationProtocol.HTTP,
        certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
      });
    }).toThrow();
  });

  test('errors when setting both HTTP protocol and redirectHTTP', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        protocol: ApplicationProtocol.HTTP,
        redirectHTTP: true,
      });
    }).toThrow();
  });

  test('does not throw errors when not setting HTTPS protocol but certificate for redirectHTTP', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // THEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      domainName: 'api.example.com',
      domainZone: zone,
      redirectHTTP: true,
      certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
    });
  });

  test('errors when setting HTTPS protocol but not domain name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        protocol: ApplicationProtocol.HTTPS,
      });
    }).toThrow();
  });

  test('errors when idleTimeout is over 4000 seconds', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
          enableLogging: false,
          environment: {
            TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
            TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
          },
          logDriver: new ecs.AwsLogDriver({
            streamPrefix: 'TestStream',
          }),
        },
        idleTimeout: cdk.Duration.seconds(5000),
        desiredCount: 2,
      });
    }).toThrowError();
  });

  test('errors when idleTimeout is under 1 seconds', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
          enableLogging: false,
          environment: {
            TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
            TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
          },
          logDriver: new ecs.AwsLogDriver({
            streamPrefix: 'TestStream',
          }),
        },
        idleTimeout: cdk.Duration.seconds(0),
        desiredCount: 2,
      });
    }).toThrowError();
  });

  test('passes when idleTimeout is between 1 and 4000 seconds', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
          enableLogging: false,
          environment: {
            TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
            TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
          },
          logDriver: new ecs.AwsLogDriver({
            streamPrefix: 'TestStream',
          }),
        },
        idleTimeout: cdk.Duration.seconds(4000),
        desiredCount: 2,
      });
    }).toBeTruthy();
  });

  test('idletime is undefined when not set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
      },
      desiredCount: 2,
    });

    // THEN - stack contains default LoadBalancer Attributes
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'deletion_protection.enabled',
          Value: 'false',
        },
      ],
    });
  });

  test('test Fargate loadbalanced construct with optional log driver input', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
              'awslogs-stream-prefix': 'TestStream',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        }),
      ],
    });
  });

  test('test Fargate loadbalanced construct with logging enabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: true,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        }),
      ],
    });
  });

  test('test Fargate loadbalanced construct with both image and taskDefinition provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    // WHEN
    expect(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: true,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
      },
      desiredCount: 2,
      taskDefinition,
    })).toThrow();
  });

  test('test Fargate application loadbalanced construct with taskDefinition provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('passedTaskDef', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });
    container.addPortMappings({
      containerPort: 80,
    });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      memoryLimitMiB: 1024,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'amazon/amazon-ecs-sample',
          Memory: 512,
          Name: 'passedTaskDef',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
        }),
      ],
    });
  });

  test('ALBFargate - having *HealthyPercent properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALB123Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MinimumHealthyPercent: 100,
        MaximumPercent: 200,
      },
    });
  });
});

describe('NetworkLoadBalancedFargateService', () => {
  test('setting loadBalancerType to Network creates an NLB Public', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network',
      Scheme: 'internet-facing',
    });
  });

  test('setting loadBalancerType to Network and publicLoadBalancer to false creates an NLB Private', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      publicLoadBalancer: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network',
      Scheme: 'internal',
    });
  });

  test('setting vpc and cluster throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      vpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    })).toThrow();
  });

  test('setting executionRole updated taskDefinition with given execution role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const executionRole = new iam.Role(stack, 'ExecutionRole', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ecs.amazonaws.com'),
        new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      ),
    });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        executionRole,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ExecutionRoleArn: { 'Fn::GetAtt': ['ExecutionRole605A040B', 'Arn'] },
    });
  });

  test('setting taskRole updated taskDefinition with given task role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskRole = new iam.Role(stack, 'taskRoleTest', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ecs.amazonaws.com'),
        new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      ),
    });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskRole,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      TaskRoleArn: { 'Fn::GetAtt': ['taskRoleTest9DA66B6E', 'Arn'] },
    });
  });

  test('setting containerName updates container name with given name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        containerName: 'bob',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Name: 'bob',
        }),
      ],
    });
  });

  test('not setting containerName updates container name with default', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Name: 'web',
        }),
      ],
    });
  });

  test('setting servicename updates service name with given name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      serviceName: 'bob',
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      ServiceName: 'bob',
    });
  });

  test('not setting servicename updates service name with default', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      ServiceName: Match.absent(),
    });
  });

  test('setting NLB deployment controller', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      deploymentController: {
        type: ecs.DeploymentControllerType.CODE_DEPLOY,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentController: {
        Type: 'CODE_DEPLOY',
      },
    });
  });

  test('setting NLB circuitBreaker works', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
      circuitBreaker: { rollback: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        DeploymentCircuitBreaker: {
          Enable: true,
          Rollback: true,
        },
      },
      DeploymentController: {
        Type: 'ECS',
      },
    });
  });

  test('setting NLB special listener port to create the listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'FargateNlbService', {
      cluster,
      listenerPort: 2015,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        Match.objectLike({
          Type: 'forward',
        }),
      ],
      Port: 2015,
      Protocol: 'TCP',
    });
  });

  test('setting NLB cname option correctly sets the recordset type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'FargateNlbService', {
      cluster,
      domainName: 'test.domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com.',
      }),
      recordType: ecsPatterns.NetworkLoadBalancedServiceRecordType.CNAME,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'test.domain.com.',
      Type: 'CNAME',
    });
  });

  test('setting NLB record type to NONE correctly omits the recordset', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'FargateNlbService', {
      cluster,
      domainName: 'test.domain.com',
      domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
        hostedZoneId: 'fakeId',
        zoneName: 'domain.com.',
      }),
      recordType: ecsPatterns.NetworkLoadBalancedServiceRecordType.NONE,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Route53::RecordSet', 0);
  });

  test('passing in existing network load balancer to NLB Fargate Service', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb = new NetworkLoadBalancer(stack, 'NLB', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      vpc,
      loadBalancer: nlb,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network',
    });
  });

  test('passing in imported network load balancer and resources to NLB Fargate service', () => {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'MyStack');
    const vpc1 = new ec2.Vpc(stack1, 'VPC');
    const cluster1 = new ecs.Cluster(stack1, 'Cluster', { vpc: vpc1 });
    const nlbArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
    const stack2 = new cdk.Stack(stack1, 'Stack2');
    const cluster2 = ecs.Cluster.fromClusterAttributes(stack2, 'ImportedCluster', {
      vpc: vpc1,
      securityGroups: cluster1.connections.securityGroups,
      clusterName: 'cluster-name',
    });

    // WHEN
    const nlb2 = NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack2, 'ImportedNLB', {
      loadBalancerArn: nlbArn,
      vpc: vpc1,
    });
    const taskDef = new ecs.FargateTaskDefinition(stack2, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 1024,
    });
    const container = taskDef.addContainer('myContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 1024,
    });
    container.addPortMappings({
      containerPort: 80,
    });

    new ecsPatterns.NetworkLoadBalancedFargateService(stack2, 'FargateNLBService', {
      cluster: cluster2,
      loadBalancer: nlb2,
      desiredCount: 1,
      taskDefinition: taskDef,
    });

    // THEN
    Template.fromStack(stack2).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      LoadBalancers: [Match.objectLike({ ContainerName: 'myContainer', ContainerPort: 80 })],
    });

    Template.fromStack(stack2).resourceCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', 1);

    Template.fromStack(stack2).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      LoadBalancerArn: nlb2.loadBalancerArn,
      Port: 80,
    });
  });

  test('test Network load balanced service with docker labels defined', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: '/aws/aws-example-app',
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        }),
      ],
    });
  });

  test('NetworkLoadBalancedFargateService multiple capacity provider strategies are set', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.enableFargateCapacityProviders();

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE',
          base: 1,
          weight: 1,
        },
        {
          capacityProvider: 'FARGATE_SPOT',
          base: 0,
          weight: 2,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      CapacityProviderStrategy: Match.arrayEquals([
        {
          Base: 1,
          CapacityProvider: 'FARGATE',
          Weight: 1,
        },
        {
          Base: 0,
          CapacityProvider: 'FARGATE_SPOT',
          Weight: 2,
        },
      ]),
    });
  });

  test('creates AWS Cloud Map service for Private DNS namespace with network load balanced fargate service', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: cloudmap.NamespaceType.DNS_PRIVATE,
    });

    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        containerPort: 8000,
        image: ecs.ContainerImage.fromRegistry('hello'),
      },
      cloudMapOptions: {
        name: 'myApp',
      },
      memoryLimitMiB: 512,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      ServiceRegistries: [
        {
          RegistryArn: {
            'Fn::GetAtt': [
              'ServiceCloudmapServiceDE76B29D',
              'Arn',
            ],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
      DnsConfig: {
        DnsRecords: [
          {
            TTL: 60,
            Type: 'A',
          },
        ],
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
        RoutingPolicy: 'MULTIVALUE',
      },
      HealthCheckCustomConfig: {
        FailureThreshold: 1,
      },
      Name: 'myApp',
      NamespaceId: {
        'Fn::GetAtt': [
          'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
          'Id',
        ],
      },
    });
  });

  test('having *HealthyPercent properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      desiredCount: 1,
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MinimumHealthyPercent: 100,
        MaximumPercent: 200,
      },
    });
  });

  test('specify security group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      allowAllOutbound: false,
      description: 'Example',
      securityGroupName: 'Rolly',
      vpc,
    });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      securityGroups: [securityGroup],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Example',
      GroupName: 'Rolly',
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86,
        },
      ],
      VpcId: {
        Ref: 'Vpc8378EB38',
      },
    });
  });
});
