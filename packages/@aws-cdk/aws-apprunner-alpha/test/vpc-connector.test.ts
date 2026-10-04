import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Service, Source, VpcConnector } from '../lib';

test('create a vpcConnector with all properties', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    securityGroups: [securityGroup],
    vpc,
    vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    vpcConnectorName: 'MyVpcConnector',
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
    ],
    VpcConnectorName: 'MyVpcConnector',
  });
});

test('create a vpcConnector without a name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    securityGroups: [securityGroup],
    vpc,
    vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
    ],
  });
});

test('create a vpcConnector without a security group should create one', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    vpc,
    vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'VpcConnectorSecurityGroup33FAF25D',
          'GroupId',
        ],
      },
    ],
  });
});

test('create a vpcConnector with an empty security group array should create one', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    vpc,
    vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    securityGroups: [],
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'VpcConnectorSecurityGroup33FAF25D',
          'GroupId',
        ],
      },
    ],
  });
});

test.each([
  ['tes'],
  ['test-vpc-connector-name-over-limitation-apprunner'],
])('vpcConnectorName length is invalid (name: %s)', (vpcConnectorName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  expect(() => {
    new VpcConnector(stack, 'VpcConnector', {
      vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
      vpcConnectorName,
    });
  }).toThrow(`\`vpcConnectorName\` must be between 4 and 40 characters, got: ${vpcConnectorName.length} characters.`);
});

test.each([
  ['-test'],
  ['test-?'],
  ['test-\\'],
])('vpcConnectorName includes invalid characters (name: %s)', (vpcConnectorName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  expect(() => {
    new VpcConnector(stack, 'VpcConnector', {
      vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
      vpcConnectorName,
    });
  }).toThrow(`\`vpcConnectorName\` must start with an alphanumeric character and contain only alphanumeric characters, hyphens, or underscores after that, got: ${vpcConnectorName}.`);
});

test('import an existing VPC Connector', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

  // WHEN
  const importedConnector = VpcConnector.fromVpcConnectorAttributes(stack, 'ImportedVpcConnector', {
    vpcConnectorArn: 'arn:aws:apprunner:us-east-1:123456789012:vpcconnector/my-connector/1/1234567890abcdef',
    vpcConnectorName: 'my-connector',
    vpcConnectorRevision: 1,
    securityGroups: [securityGroup],
  });

  new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    vpcConnector: importedConnector,
  });

  // THEN
  expect(importedConnector.vpcConnectorArn).toBe('arn:aws:apprunner:us-east-1:123456789012:vpcconnector/my-connector/1/1234567890abcdef');
  expect(importedConnector.vpcConnectorName).toBe('my-connector');
  expect(importedConnector.vpcConnectorRevision).toBe(1);

  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'VPC',
        VpcConnectorArn: 'arn:aws:apprunner:us-east-1:123456789012:vpcconnector/my-connector/1/1234567890abcdef',
      },
    },
  });
});
