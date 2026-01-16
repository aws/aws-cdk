import { Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import { App, Duration, Stack } from '../../core';
import { VpcOrigin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('VPC origin from an EC2 instance', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  });

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withEc2Instance(instance),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':ec2:testregion:1234:instance/',
            { Ref: 'InstanceC1063A87' },
          ],
        ],
      },
      Name: 'StackDistributionOrigin1VpcOriginB6F753F8',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: { 'Fn::GetAtt': ['InstanceC1063A87', 'PrivateDnsName'] },
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin1VpcOrigin1389D846', 'Id'] },
          },
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
    },
  });
});

test('VPC origin from an Application Load Balancer', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withApplicationLoadBalancer(loadBalancer),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'ALBAEE750D2' },
      Name: 'StackDistributionOrigin1VpcOriginB6F753F8',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: { 'Fn::GetAtt': ['ALBAEE750D2', 'DNSName'] },
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin1VpcOrigin1389D846', 'Id'] },
          },
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
    },
  });
});

test('VPC origin from a Network Load Balancer', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withNetworkLoadBalancer(loadBalancer),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'NLB55158F82' },
      Name: 'StackDistributionOrigin1VpcOriginB6F753F8',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: { 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] },
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin1VpcOrigin1389D846', 'Id'] },
          },
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
    },
  });
});

test('VPC origin from a VpcOrigin resource', () => {
  // GIVEN
  const vpcOrigin = new cloudfront.VpcOrigin(stack, 'VpcOrigin', {
    endpoint: { endpointArn: 'arn:opaque', domainName: 'vpcorigin.example.com' },
  });

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withVpcOrigin(vpcOrigin),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: 'vpcorigin.example.com',
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['VpcOrigin65BCA67E', 'Id'] },
          },
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
    },
  });
});

test('VPC origin from an imported VpcOrigin resource', () => {
  // GIVEN
  const vpcOrigin = cloudfront.VpcOrigin.fromVpcOriginId(stack, 'VpcOrigin', 'vpc-origin-id');

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withVpcOrigin(vpcOrigin, {
        domainName: 'vpcorigin.example.com',
      }),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: 'vpcorigin.example.com',
          VpcOriginConfig: {
            VpcOriginId: 'vpc-origin-id',
          },
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
    },
  });
});

test.each([
  Duration.seconds(0),
  Duration.seconds(181),
  Duration.minutes(5),
])('VPC origin throws when readTimeout is %s - out of bounds', (readTimeout) => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

  // WHEN
  expect(() => {
    VpcOrigin.withApplicationLoadBalancer(loadBalancer, { readTimeout });
  }).toThrow(`readTimeout: Must be an int between 1 and 180 seconds (inclusive); received ${readTimeout.toSeconds()}`);
});

test.each([
  Duration.seconds(0),
  Duration.seconds(181),
  Duration.minutes(5),
])('VPC origin throws when keepaliveTimeout is %s - out of bounds', (keepaliveTimeout) => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

  // WHEN
  expect(() => {
    VpcOrigin.withApplicationLoadBalancer(loadBalancer, { keepaliveTimeout });
  }).toThrow(`keepaliveTimeout: Must be an int between 1 and 180 seconds (inclusive); received ${keepaliveTimeout.toSeconds()}`);
});

test('VPC origin throws when no domainName is specified', () => {
  // GIVEN
  const vpcOrigin = new cloudfront.VpcOrigin(stack, 'VpcOrigin', {
    endpoint: { endpointArn: 'arn:opaque' },
  });

  // WHEN
  expect(() => {
    VpcOrigin.withVpcOrigin(vpcOrigin);
  }).toThrow("'domainName' must be specified when no default domain name is defined.");
});

test('VPC origin with options configured', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  });
  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
  const vpcOrigin = new cloudfront.VpcOrigin(stack, 'Opaque', {
    endpoint: { endpointArn: 'arn:opaque' },
  });

  // WHEN
  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: VpcOrigin.withEc2Instance(instance, {
        domainName: 'ec2instance.example.com',
        vpcOriginName: 'Ec2InstanceOrigin',
        httpPort: 8080,
        httpsPort: 8443,
        protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
        originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_1, cloudfront.OriginSslPolicy.TLS_V1_2],
        readTimeout: Duration.seconds(60),
        keepaliveTimeout: Duration.seconds(120),
        connectionTimeout: Duration.seconds(5),
        connectionAttempts: 1,
      }),
    },
    additionalBehaviors: {
      '/alb/*': {
        origin: VpcOrigin.withApplicationLoadBalancer(alb, {
          domainName: 'alb.example.com',
          vpcOriginName: 'ALBOrigin',
          httpPort: 8080,
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
      },
      '/nlb/*': {
        origin: VpcOrigin.withNetworkLoadBalancer(nlb, {
          domainName: 'nlb.example.com',
          vpcOriginName: 'NLBOrigin',
          httpsPort: 8443,
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }),
      },
      '/opaque/*': {
        origin: VpcOrigin.withVpcOrigin(vpcOrigin, {
          domainName: 'opaque.example.com',
          readTimeout: Duration.seconds(60),
          keepaliveTimeout: Duration.seconds(120),
          connectionTimeout: Duration.seconds(5),
          connectionAttempts: 1,
        }),
      },
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':ec2:testregion:1234:instance/',
            { Ref: 'InstanceC1063A87' },
          ],
        ],
      },
      Name: 'Ec2InstanceOrigin',
      HTTPPort: 8080,
      HTTPSPort: 8443,
      OriginProtocolPolicy: 'match-viewer',
      OriginSSLProtocols: ['TLSv1.1', 'TLSv1.2'],
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'ALBAEE750D2' },
      Name: 'ALBOrigin',
      HTTPPort: 8080,
      OriginProtocolPolicy: 'http-only',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'NLB55158F82' },
      Name: 'NLBOrigin',
      HTTPSPort: 8443,
      OriginProtocolPolicy: 'https-only',
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [
        {
          Id: 'StackDistributionOrigin14F1B0A79',
          DomainName: 'ec2instance.example.com',
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin1VpcOrigin1389D846', 'Id'] },
            OriginReadTimeout: 60,
            OriginKeepaliveTimeout: 120,
          },
          ConnectionTimeout: 5,
          ConnectionAttempts: 1,
        },
        {
          Id: 'StackDistributionOrigin2322BFC29',
          DomainName: 'alb.example.com',
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin2VpcOrigin9CDFA022', 'Id'] },
          },
        },
        {
          Id: 'StackDistributionOrigin354BC8C0F',
          DomainName: 'nlb.example.com',
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['DistributionOrigin3VpcOrigin92647B05', 'Id'] },
          },
        },
        {
          Id: 'StackDistributionOrigin444BA487C',
          DomainName: 'opaque.example.com',
          VpcOriginConfig: {
            VpcOriginId: { 'Fn::GetAtt': ['OpaqueEB82B10F', 'Id'] },
            OriginReadTimeout: 60,
            OriginKeepaliveTimeout: 120,
          },
          ConnectionTimeout: 5,
          ConnectionAttempts: 1,
        },
      ],
      DefaultCacheBehavior: {
        TargetOriginId: 'StackDistributionOrigin14F1B0A79',
      },
      CacheBehaviors: [
        {
          PathPattern: '/alb/*',
          TargetOriginId: 'StackDistributionOrigin2322BFC29',
        },
        {
          PathPattern: '/nlb/*',
          TargetOriginId: 'StackDistributionOrigin354BC8C0F',
        },
        {
          PathPattern: '/opaque/*',
          TargetOriginId: 'StackDistributionOrigin444BA487C',
        },
      ],
    },
  });
});

describe('VPC Origin region-aware naming', () => {
  test('VPC origin with feature flag disabled uses default naming', () => {
    // GIVEN
    const testApp = new App();
    const testStack = new Stack(testApp, 'Stack', {
      env: { account: '1234', region: 'us-east-1' },
    });
    const vpc = new ec2.Vpc(testStack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(testStack, 'ALB', { vpc });

    // WHEN
    new cloudfront.Distribution(testStack, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(alb),
      },
    });

    // THEN - should use default naming without region suffix
    Template.fromStack(testStack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
      VpcOriginEndpointConfig: {
        Name: 'StackDistributionOrigin1VpcOriginB6F753F8',
      },
    });
  });

  test('VPC origin with feature flag enabled includes region in name', () => {
    // GIVEN
    const testApp = new App({
      context: {
        '@aws-cdk/aws-cloudfront:vpcOriginRegionAwareName': true,
      },
    });
    const testStack = new Stack(testApp, 'Stack', {
      env: { account: '1234', region: 'us-east-1' },
    });
    const vpc = new ec2.Vpc(testStack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(testStack, 'ALB', { vpc });

    // WHEN
    new cloudfront.Distribution(testStack, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(alb),
      },
    });

    // THEN - should include region suffix
    Template.fromStack(testStack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
      VpcOriginEndpointConfig: {
        Name: 'StackDistributionOrigin1VpcOriginB6F753F8-us-east-1',
      },
    });
  });

  test('VPC origin with feature flag enabled but unresolved region uses default naming', () => {
    // GIVEN
    const testApp = new App({
      context: {
        '@aws-cdk/aws-cloudfront:vpcOriginRegionAwareName': true,
      },
    });
    const testStack = new Stack(testApp, 'Stack'); // No explicit region
    const vpc = new ec2.Vpc(testStack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(testStack, 'ALB', { vpc });

    // WHEN
    new cloudfront.Distribution(testStack, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(alb),
      },
    });

    // THEN - should use default naming without region suffix when region is unresolved
    Template.fromStack(testStack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
      VpcOriginEndpointConfig: {
        Name: 'StackDistributionOrigin1VpcOriginB6F753F8',
      },
    });
  });

  test('VPC origin with custom name ignores feature flag', () => {
    // GIVEN
    const testApp = new App({
      context: {
        '@aws-cdk/aws-cloudfront:vpcOriginRegionAwareName': true,
      },
    });
    const testStack = new Stack(testApp, 'Stack', {
      env: { account: '1234', region: 'us-east-1' },
    });
    const vpc = new ec2.Vpc(testStack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(testStack, 'ALB', { vpc });

    // WHEN
    new cloudfront.Distribution(testStack, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(alb, {
          vpcOriginName: 'CustomOriginName',
        }),
      },
    });

    // THEN - should use custom name exactly as provided
    Template.fromStack(testStack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
      VpcOriginEndpointConfig: {
        Name: 'CustomOriginName',
      },
    });
  });

  test('VPC origin with feature flag enabled works with different regions', () => {
    // GIVEN
    const testApp = new App({
      context: {
        '@aws-cdk/aws-cloudfront:vpcOriginRegionAwareName': true,
      },
    });
    const testStack1 = new Stack(testApp, 'Stack1', {
      env: { account: '1234', region: 'us-east-1' },
    });
    const testStack2 = new Stack(testApp, 'Stack2', {
      env: { account: '1234', region: 'eu-west-1' },
    });

    // Create identical constructs in both stacks
    const createVpcOrigin = (targetStack: Stack) => {
      const vpc = new ec2.Vpc(targetStack, 'Vpc');
      const alb = new elbv2.ApplicationLoadBalancer(targetStack, 'ALB', { vpc });
      return new cloudfront.Distribution(targetStack, 'Distribution', {
        defaultBehavior: {
          origin: VpcOrigin.withApplicationLoadBalancer(alb),
        },
      });
    };

    // WHEN
    createVpcOrigin(testStack1);
    createVpcOrigin(testStack2);

    // THEN - should have different names with region suffixes
    const template1 = Template.fromStack(testStack1);
    const template2 = Template.fromStack(testStack2);

    // Get the actual generated names to verify they're different and include regions
    const vpcOrigins1 = template1.findResources('AWS::CloudFront::VpcOrigin');
    const vpcOrigins2 = template2.findResources('AWS::CloudFront::VpcOrigin');

    const name1 = Object.values(vpcOrigins1)[0].Properties.VpcOriginEndpointConfig.Name;
    const name2 = Object.values(vpcOrigins2)[0].Properties.VpcOriginEndpointConfig.Name;

    expect(name1).toMatch(/-us-east-1$/);
    expect(name2).toMatch(/-eu-west-1$/);
    expect(name1).not.toEqual(name2); // Names should be different
  });

  test('VPC origin name length stays within 64 character limit', () => {
    // GIVEN
    const testApp = new App({
      context: {
        '@aws-cdk/aws-cloudfront:vpcOriginRegionAwareName': true,
      },
    });
    const testStack = new Stack(testApp, 'VeryLongStackNameThatCouldPotentiallyCauseIssuesWithNaming', {
      env: { account: '1234', region: 'ap-southeast-2' }, // Longer region name
    });
    const vpc = new ec2.Vpc(testStack, 'Vpc');
    const alb = new elbv2.ApplicationLoadBalancer(testStack, 'ALB', { vpc });

    // WHEN
    new cloudfront.Distribution(testStack, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(alb),
      },
    });

    // THEN - verify the generated name is within limits
    const template = Template.fromStack(testStack);
    const vpcOrigins = template.findResources('AWS::CloudFront::VpcOrigin');
    const vpcOriginKeys = Object.keys(vpcOrigins);
    expect(vpcOriginKeys).toHaveLength(1);

    const vpcOriginConfig = vpcOrigins[vpcOriginKeys[0]].Properties.VpcOriginEndpointConfig;
    const generatedName = vpcOriginConfig.Name;

    expect(typeof generatedName).toBe('string');
    expect(generatedName.length).toBeLessThanOrEqual(64);
    expect(generatedName).toMatch(/-ap-southeast-2$/); // Should end with region
  });
});
