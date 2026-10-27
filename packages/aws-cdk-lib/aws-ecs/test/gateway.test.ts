import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as wafv2 from '../../aws-wafv2';
import * as cdk from '../../core';
import * as ecs from '../lib';
import { acknowledgeTestValidationRules } from './util';

const GATEWAY_ARN = 'arn:aws:ecs:us-west-2:123456789012:gateway/imported/0123456789abcdef';

describe('gateway', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    stack = new cdk.Stack();
    acknowledgeTestValidationRules(stack);
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('defaults to an internal gateway in the private subnets with a new infrastructure role', () => {
    const gateway = new ecs.Gateway(stack, 'Gateway', { vpc });

    expect(gateway.scheme).toEqual(ecs.GatewayScheme.INTERNAL);
    expect(gateway.gatewayName).toEqual('Gateway');
    expect(stack.resolve(gateway.gatewayArn)).toEqual({ 'Fn::GetAtt': ['Gateway43CB3636', 'Arn'] });
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECS::Gateway', {
      GatewayName: 'Gateway',
      InfrastructureRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^GatewayInfrastructureRole'), 'Arn'] },
      DeletionProtection: Match.absent(),
      PropagateTags: 'NONE',
      Tags: Match.absent(),
      Configuration: {
        HostSharedAlb: {
          Scheme: 'internal',
          Port: Match.absent(),
          Protocol: Match.absent(),
          MaxAlbCount: Match.absent(),
          HttpDesync: Match.absent(),
          WebACLArn: Match.absent(),
          AccessLogs: Match.absent(),
          NetworkConfiguration: {
            Subnets: [
              { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
              { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
            ],
            IpAddressType: Match.absent(),
            InboundSecurityGroup: Match.absent(),
          },
        },
      },
    });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'ecs.amazonaws.com' },
          Condition: Match.absent(),
        }],
      },
      ManagedPolicyArns: [{
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':iam::aws:policy/AmazonECSInfrastructureRoleForGatewayHostSharedALB',
        ]],
      }],
    });
    Annotations.fromStack(stack).hasNoWarning('/Default/Gateway', Match.anyValue());
  });

  test('internet-facing gateway uses the public subnets and warns', () => {
    new ecs.Gateway(stack, 'Gateway', {
      vpc,
      scheme: ecs.GatewayScheme.INTERNET_FACING,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      Configuration: {
        HostSharedAlb: {
          Scheme: 'internet-facing',
          NetworkConfiguration: {
            Subnets: [
              { Ref: 'VpcPublicSubnet1Subnet5C2D37C4' },
              { Ref: 'VpcPublicSubnet2Subnet691E08A3' },
            ],
          },
        },
      },
    });
    Annotations.fromStack(stack).hasWarning('/Default/Gateway', Match.stringLikeRegexp('internet-facing.*PRIVATE'));
  });

  test('uses the given name, role, subnets, IP address type and deletion protection', () => {
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/gateway');

    const gateway = new ecs.Gateway(stack, 'Gateway', {
      vpc,
      gatewayName: 'my-gateway',
      infrastructureRole: role,
      deletionProtection: false,
      ipAddressType: elbv2.IpAddressType.DUAL_STACK,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    expect(gateway.gatewayName).toEqual('my-gateway');
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECS::Gateway', {
      GatewayName: 'my-gateway',
      InfrastructureRoleArn: 'arn:aws:iam::123456789012:role/gateway',
      DeletionProtection: false,
      Configuration: {
        HostSharedAlb: {
          Scheme: 'internal',
          NetworkConfiguration: {
            Subnets: [
              { Ref: 'VpcPublicSubnet1Subnet5C2D37C4' },
              { Ref: 'VpcPublicSubnet2Subnet691E08A3' },
            ],
            IpAddressType: 'dualstack',
          },
        },
      },
    });
    template.resourceCountIs('AWS::IAM::Role', 0);
  });

  test('accepts a dual-stack IP address type without public IPv4', () => {
    new ecs.Gateway(stack, 'Gateway', {
      vpc,
      ipAddressType: elbv2.IpAddressType.DUAL_STACK_WITHOUT_PUBLIC_IPV4,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      Configuration: { HostSharedAlb: { NetworkConfiguration: { IpAddressType: 'dualstack-without-public-ipv4' } } },
    });
  });

  test('propagates the gateway tags when asked to', () => {
    new ecs.Gateway(stack, 'Gateway', { vpc, propagateTags: ecs.GatewayPropagateTags.GATEWAY });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      PropagateTags: 'GATEWAY',
    });
  });

  test('renders the listener, security group, load balancer and logging settings', () => {
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    const bucket = new s3.Bucket(stack, 'Logs');
    const webAcl = new wafv2.CfnWebACL(stack, 'WebAcl', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: { cloudWatchMetricsEnabled: false, metricName: 'acl', sampledRequestsEnabled: false },
    });

    new ecs.Gateway(stack, 'Gateway', {
      vpc,
      port: 8443,
      protocol: ecs.GatewayProtocol.HTTPS,
      securityGroup,
      maxAlbCount: 2,
      httpDesync: ecs.GatewayHttpDesyncMitigationMode.STRICTEST,
      webAcl,
      accessLogs: { bucket, prefix: 'gateway' },
      tags: { team: 'web' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      Tags: [{ Key: 'team', Value: 'web' }],
      Configuration: {
        HostSharedAlb: {
          Port: 8443,
          Protocol: 'HTTPS',
          MaxAlbCount: 2,
          HttpDesync: 'strictest',
          WebACLArn: { 'Fn::GetAtt': ['WebAcl', 'Arn'] },
          AccessLogs: { Destination: { S3: { Bucket: { Ref: 'Logs6819BB44' }, Prefix: 'gateway' } } },
          NetworkConfiguration: {
            InboundSecurityGroup: { 'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'] },
          },
        },
      },
    });
  });

  test('Tags.of() tags the gateway', () => {
    const gateway = new ecs.Gateway(stack, 'Gateway', { vpc });

    cdk.Tags.of(gateway).add('team', 'web');

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      Tags: [{ Key: 'team', Value: 'web' }],
    });
  });

  test.each([0, 65536, 1.5])('fails for port %d', (port) => {
    expect(() => new ecs.Gateway(stack, 'Gateway', { vpc, port }))
      .toThrow(/port must be a whole number between 1 and 65535/);
  });

  test.each([0, 1.5])('fails for maxAlbCount %d', (maxAlbCount) => {
    expect(() => new ecs.Gateway(stack, 'Gateway', { vpc, maxAlbCount }))
      .toThrow(/maxAlbCount must be a whole number of at least 1/);
  });

  test('skips port and maxAlbCount validation for tokens', () => {
    const port = new cdk.CfnParameter(stack, 'Port', { type: 'Number' }).valueAsNumber;
    const maxAlbCount = new cdk.CfnParameter(stack, 'MaxAlbCount', { type: 'Number' }).valueAsNumber;

    new ecs.Gateway(stack, 'Gateway', { vpc, port, maxAlbCount });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      Configuration: { HostSharedAlb: { Port: { Ref: 'Port' }, MaxAlbCount: { Ref: 'MaxAlbCount' } } },
    });
  });

  test('generates a concrete name for PhysicalName.GENERATE_IF_NEEDED', () => {
    const gateway = new ecs.Gateway(stack, 'Gateway', { vpc, gatewayName: cdk.PhysicalName.GENERATE_IF_NEEDED });

    expect(gateway.gatewayName).toEqual('Gateway');
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      GatewayName: 'Gateway',
    });
  });

  test('the generated name can be used in another environment', () => {
    const app = new cdk.App();
    const gatewayStack = new cdk.Stack(app, 'GatewayStack', { env: { account: '111111111111', region: 'us-east-1' } });
    const otherStack = new cdk.Stack(app, 'OtherStack', { env: { account: '222222222222', region: 'us-west-2' } });
    const gateway = new ecs.Gateway(gatewayStack, 'Gateway', {
      vpc: new ec2.Vpc(gatewayStack, 'Vpc'),
      gatewayName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    new cdk.CfnOutput(otherStack, 'GatewayName', { value: gateway.gatewayName });

    Template.fromStack(otherStack).hasOutput('GatewayName', { Value: gateway.gatewayName });
    Template.fromStack(gatewayStack).hasResourceProperties('AWS::ECS::Gateway', {
      GatewayName: gateway.gatewayName,
    });
  });

  test('a custom infrastructure role and its policy are created before the gateway', () => {
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com') });
    role.addToPolicy(new iam.PolicyStatement({ actions: ['ec2:DescribeVpcs'], resources: ['*'] }));

    new ecs.Gateway(stack, 'Gateway', { vpc, infrastructureRole: role });

    Template.fromStack(stack).hasResource('AWS::ECS::Gateway', {
      DependsOn: Match.arrayWith(['RoleDefaultPolicy5FFB7DAB', 'Role1ABCC5F0']),
    });
  });

  test('generated name of a deeply nested gateway is at most 255 characters', () => {
    let scope: Construct = stack;
    for (let i = 0; i < 20; i++) {
      scope = new Construct(scope, `AVeryLongConstructIdForTestingNameGeneration${i}`);
    }

    const gateway = new ecs.Gateway(scope, 'Gateway', { vpc });

    expect(gateway.gatewayName.length).toBeLessThanOrEqual(255);
    expect(gateway.gatewayName).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  test.each(['', 'has_underscore', 'a'.repeat(256)])('fails for gateway name %j', (gatewayName) => {
    expect(() => new ecs.Gateway(stack, 'Gateway', { vpc, gatewayName }))
      .toThrow(/gatewayName must be 1 to 255 letters, numbers and hyphens/);
  });

  test('skips name validation for a token', () => {
    const gatewayName = new cdk.CfnParameter(stack, 'Name').valueAsString;

    new ecs.Gateway(stack, 'Gateway', { vpc, gatewayName });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Gateway', {
      GatewayName: { Ref: 'Name' },
    });
  });

  test('fails with fewer than 2 subnets', () => {
    expect(() => new ecs.Gateway(stack, 'Gateway', {
      vpc,
      vpcSubnets: { subnets: [vpc.privateSubnets[0]] },
    })).toThrow(/a gateway needs at least 2 subnets in different Availability Zones, got 1 subnet\(s\)/);
  });

  test('fails with subnets in a single Availability Zone', () => {
    const subnets = ['subnet-1', 'subnet-2'].map((subnetId) =>
      ec2.Subnet.fromSubnetAttributes(stack, subnetId, { subnetId, availabilityZone: 'us-east-1a' }));

    expect(() => new ecs.Gateway(stack, 'Gateway', { vpc, vpcSubnets: { subnets } }))
      .toThrow(/a gateway needs subnets in at least 2 different Availability Zones, got \["us-east-1a"\]/);
  });

  test('imports a gateway from its ARN', () => {
    const gateway = ecs.Gateway.fromGatewayArn(stack, 'Imported', GATEWAY_ARN);

    expect(gateway.gatewayArn).toEqual(GATEWAY_ARN);
    expect(gateway.gatewayName).toEqual('imported');
    expect(gateway.gatewayRef.gatewayArn).toEqual(GATEWAY_ARN);
    expect(gateway.env.region).toEqual('us-west-2');
    expect(gateway.env.account).toEqual('123456789012');
  });

  test('imports a gateway from a token ARN', () => {
    const arn = new cdk.CfnParameter(stack, 'Arn').valueAsString;

    const gateway = ecs.Gateway.fromGatewayArn(stack, 'Imported', arn);

    expect(cdk.Token.isUnresolved(gateway.gatewayName)).toBe(true);
    expect(JSON.stringify(stack.resolve(gateway.gatewayName))).toContain('"Ref":"Arn"');
  });

  test.each([
    'arn:aws:ecs:us-west-2:123456789012:cluster/my-cluster',
    'arn:aws:sqs:us-west-2:123456789012:gateway/name/id',
    'arn:aws:ecs:us-west-2:123456789012:gateway',
  ])('fails to import malformed gateway ARN %s', (arn) => {
    expect(() => ecs.Gateway.fromGatewayArn(stack, 'Imported', arn)).toThrow(/gatewayArn must be an ARN of the form/);
  });
});

describe('gateway connector', () => {
  let stack: cdk.Stack;
  let cluster: ecs.Cluster;
  let taskDefinition: ecs.FargateTaskDefinition;

  beforeEach(() => {
    stack = new cdk.Stack();
    acknowledgeTestValidationRules(stack);
    const vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
      portMappings: [{ containerPort: 80, name: 'web' }],
    });
  });

  test('cluster associates a gateway', () => {
    const gateway = ecs.Gateway.fromGatewayArn(stack, 'Gateway', GATEWAY_ARN);

    cluster.associateGateway(gateway);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::GatewayClusterAssociations', {
      Cluster: { Ref: 'ClusterEB0386A7' },
      Gateway: GATEWAY_ARN,
    });
  });

  test('fails to associate the same gateway twice', () => {
    const gateway = ecs.Gateway.fromGatewayArn(stack, 'Gateway', GATEWAY_ARN);
    cluster.associateGateway(gateway);

    expect(() => cluster.associateGateway(gateway)).toThrow(/gateway Default\/Gateway is already associated with this cluster/);
  });

  test('warns when more than 5 gateways are associated', () => {
    for (let i = 0; i < 6; i++) {
      cluster.associateGateway(ecs.Gateway.fromGatewayArn(stack, `Gateway${i}`, `arn:aws:ecs:us-east-1:123456789012:gateway/gw${i}/id`));
    }

    Annotations.fromStack(stack).hasWarning('/Default/Cluster', Match.stringLikeRegexp('up to 5 gateways'));
  });

  test('renders the gateway connector and depends on the cluster gateway associations', () => {
    const gateway = new ecs.Gateway(stack, 'Gateway', { vpc: cluster.vpc });
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: {
        portName: 'web',
        accessTypes: [ecs.GatewayAccessType.PRIVATE],
        healthCheck: {
          path: '/health',
          port: 8080,
          protocol: ecs.GatewayHealthCheckProtocol.HTTP,
          interval: cdk.Duration.seconds(15),
          timeout: cdk.Duration.seconds(5),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
          healthyHttpCodes: '200-299',
        },
      },
    });
    // associated after the service is created: the dependency is still added
    cluster.associateGateway(gateway);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECS::Service', {
      GatewayConnectors: [{
        PortName: 'web',
        Filters: { AccessTypes: ['PRIVATE'] },
        HealthCheck: {
          HealthCheckPath: '/health',
          HealthCheckPort: 8080,
          HealthCheckProtocol: 'HTTP',
          HealthCheckIntervalSeconds: 15,
          HealthCheckTimeoutSeconds: 5,
          HealthyThresholdCount: 2,
          UnhealthyThresholdCount: 3,
          Matcher: { HttpCode: '200-299' },
        },
      }],
    });
    const associations = template.findResources('AWS::ECS::GatewayClusterAssociations');
    expect(Object.keys(associations)).toHaveLength(1);
    template.hasResource('AWS::ECS::Service', {
      DependsOn: Match.arrayWith([Object.keys(associations)[0]]),
    });
  });

  test('renders gRPC health check codes', () => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'web', healthCheck: { healthyGrpcCodes: '0-99' } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      GatewayConnectors: [{ PortName: 'web', HealthCheck: { Matcher: { GrpcCode: '0-99', HttpCode: Match.absent() } } }],
    });
  });

  test('renders only the port name by default', () => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'web' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      GatewayConnectors: [{
        PortName: 'web',
        Filters: Match.absent(),
        HealthCheck: Match.absent(),
      }],
    });
  });

  test('two services can share one gateway', () => {
    const gateway = new ecs.Gateway(stack, 'Gateway', { vpc: cluster.vpc });
    cluster.associateGateway(gateway);

    for (const id of ['ServiceA', 'ServiceB']) {
      new ecs.FargateService(stack, id, { cluster, taskDefinition, gatewayConnector: { portName: 'web' } });
    }

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ECS::Gateway', 1);
    template.resourceCountIs('AWS::ECS::GatewayClusterAssociations', 1);
    const association = Object.keys(template.findResources('AWS::ECS::GatewayClusterAssociations'))[0];
    const services = template.findResources('AWS::ECS::Service', { DependsOn: Match.arrayWith([association]) });
    expect(Object.keys(services)).toHaveLength(2);
  });

  test('a service in an imported cluster has no dependency on an association', () => {
    const imported = ecs.Cluster.fromClusterAttributes(stack, 'Imported', { clusterName: 'imported', vpc: cluster.vpc });

    new ecs.FargateService(stack, 'Service', { cluster: imported, taskDefinition, gatewayConnector: { portName: 'web' } });

    const services = Template.fromStack(stack).findResources('AWS::ECS::Service');
    const service = Object.values(services)[0] as { DependsOn?: string[] };
    expect((service.DependsOn ?? []).filter((d) => d.includes('GatewayAssociation'))).toEqual([]);
  });

  test('without a gateway connector the service has no GatewayConnectors', () => {
    new ecs.FargateService(stack, 'Service', { cluster, taskDefinition });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      GatewayConnectors: Match.absent(),
    });
  });

  test('fails when the port name does not match a port mapping', () => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'api' },
    });

    expect(() => Template.fromStack(stack))
      .toThrow(/gatewayConnector portName "api" does not match the name of a port mapping in the task definition/);
  });

  test('accepts a port mapping added after the service', () => {
    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'api' },
    });
    taskDefinition.addContainer('api', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
      portMappings: [{ containerPort: 8080, name: 'api' }],
    });

    expect(() => Template.fromStack(stack)).not.toThrow();
  });

  test('skips validation of token port name and health check port', () => {
    const portName = new cdk.CfnParameter(stack, 'PortName').valueAsString;
    const port = new cdk.CfnParameter(stack, 'Port', { type: 'Number' }).valueAsNumber;

    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName, healthCheck: { port } },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      GatewayConnectors: [{ PortName: { Ref: 'PortName' }, HealthCheck: { HealthCheckPort: { Ref: 'Port' } } }],
    });
  });

  test('skips the port name check when a port mapping name is a token', () => {
    const otherTaskDefinition = new ecs.FargateTaskDefinition(stack, 'OtherTaskDef');
    otherTaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
      portMappings: [{ containerPort: 80, name: new cdk.CfnParameter(stack, 'MappingName').valueAsString }],
    });

    new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition: otherTaskDefinition,
      gatewayConnector: { portName: 'web' },
    });

    expect(() => Template.fromStack(stack)).not.toThrow();
  });

  test('fails for a task definition without the awsvpc network mode', () => {
    const ec2Cluster = new ecs.Cluster(stack, 'Ec2Cluster', { vpc: cluster.vpc });
    ec2Cluster.addCapacity('Capacity', { instanceType: new ec2.InstanceType('t3.micro') });
    const bridgeTaskDefinition = new ecs.Ec2TaskDefinition(stack, 'BridgeTaskDef', { networkMode: ecs.NetworkMode.BRIDGE });
    bridgeTaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
      memoryLimitMiB: 256,
      portMappings: [{ containerPort: 80, name: 'web' }],
    });

    expect(() => new ecs.Ec2Service(stack, 'Service', {
      cluster: ec2Cluster,
      taskDefinition: bridgeTaskDefinition,
      gatewayConnector: { portName: 'web' },
    })).toThrow(/gatewayConnector requires a task definition with the awsvpc network mode, got "bridge"/);
  });

  test('fails for an external service', () => {
    const externalTaskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
    externalTaskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:1.27'),
      memoryLimitMiB: 256,
      portMappings: [{ containerPort: 80, name: 'web' }],
    });

    expect(() => new ecs.ExternalService(stack, 'Service', {
      cluster,
      taskDefinition: externalTaskDefinition,
      gatewayConnector: { portName: 'web' },
    })).toThrow(/Gateway connectors are not supported for External service/);
  });

  test.each([0, 65536])('fails for health check port %d', (port) => {
    expect(() => new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'web', healthCheck: { port } },
    })).toThrow(/gatewayConnector health check port must be between 1 and 65535/);
  });

  test.each([
    [[]],
    [[ecs.GatewayAccessType.PUBLIC, ecs.GatewayAccessType.PUBLIC]],
  ])('fails for access types %j', (accessTypes) => {
    expect(() => new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'web', accessTypes },
    })).toThrow(/gatewayConnector accessTypes must be a non-empty list without duplicates/);
  });

  test.each<[string, ecs.GatewayConnectorHealthCheck, RegExp]>([
    ['path without a leading slash', { path: 'health' }, /health check path must start with '\/'/],
    ['interval too short', { interval: cdk.Duration.seconds(4) }, /interval must be a whole number of seconds between 5 and 300/],
    ['interval too long', { interval: cdk.Duration.seconds(301) }, /interval must be a whole number of seconds between 5 and 300/],
    ['fractional interval', { interval: cdk.Duration.millis(10500) }, /interval must be a whole number of seconds between 5 and 300/],
    ['timeout too short', { timeout: cdk.Duration.seconds(1) }, /timeout must be a whole number of seconds between 2 and 120/],
    ['timeout too long', { timeout: cdk.Duration.seconds(121) }, /timeout must be a whole number of seconds between 2 and 120/],
    ['timeout not less than interval', { interval: cdk.Duration.seconds(10), timeout: cdk.Duration.seconds(10) }, /timeout must be less than the interval/],
    ['healthy threshold too low', { healthyThresholdCount: 1 }, /healthyThresholdCount must be a whole number between 2 and 10/],
    ['unhealthy threshold too high', { unhealthyThresholdCount: 11 }, /unhealthyThresholdCount must be a whole number between 2 and 10/],
    ['both matcher codes', { healthyHttpCodes: '200', healthyGrpcCodes: '0' }, /healthyHttpCodes or healthyGrpcCodes, not both/],
  ])('fails for %s', (_name, healthCheck, error) => {
    expect(() => new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
      gatewayConnector: { portName: 'web', healthCheck },
    })).toThrow(error);
  });
});
