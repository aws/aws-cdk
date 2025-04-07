import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Service, Source } from '../lib';
import { VpcIngressConnection } from '../lib/vpc-ingress-connection';

test('create a VpcIngressConnection with all properties', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: ec2.InterfaceVpcEndpointAwsService.APP_RUNNER_REQUESTS,
    privateDnsEnabled: false,
  });

  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    isPubliclyAccessible: false,
  });

  // WHEN
  new VpcIngressConnection(stack, 'VpcIngressConnection', {
    vpc,
    interfaceVpcEndpoint,
    service,
    vpcIngressConnectionName: 'MyVpcIngressConnection',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcIngressConnection', {
    IngressVpcConfiguration: {
      VpcEndpointId: {
        Ref: 'MyVpcEndpoint9E60B996',
      },
      VpcId: {
        Ref: 'MyVpcF9F0CA6F',
      },
    },
    ServiceArn: {
      'Fn::GetAtt': [
        'ServiceDBC79909',
        'ServiceArn',
      ],
    },
    VpcIngressConnectionName: 'MyVpcIngressConnection',
  });
});

test('create a vpcIngressConnection without a name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: ec2.InterfaceVpcEndpointAwsService.APP_RUNNER_REQUESTS,
    privateDnsEnabled: false,
  });

  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    isPubliclyAccessible: false,
  });

  // WHEN
  new VpcIngressConnection(stack, 'VpcIngressConnection', {
    vpc,
    interfaceVpcEndpoint,
    service,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcIngressConnection', {
    IngressVpcConfiguration: {
      VpcEndpointId: {
        Ref: 'MyVpcEndpoint9E60B996',
      },
      VpcId: {
        Ref: 'MyVpcF9F0CA6F',
      },
    },
    ServiceArn: {
      'Fn::GetAtt': [
        'ServiceDBC79909',
        'ServiceArn',
      ],
    },
  });
});

test.each([
  ['tes'],
  ['test-vpc-ingress-connection-name-over-limitation'],
])('vpcIngressConnectionName length is invalid (name: %s)', (vpcIngressConnectionName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: ec2.InterfaceVpcEndpointAwsService.APP_RUNNER_REQUESTS,
    privateDnsEnabled: false,
  });

  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    isPubliclyAccessible: false,
  });

  expect(() => {
    new VpcIngressConnection(stack, 'VpcIngressConnection', {
      vpc,
      interfaceVpcEndpoint,
      service,
      vpcIngressConnectionName,
    });
  }).toThrow(`\`vpcIngressConnectionName\` must be between 4 and 40 characters, got: ${vpcIngressConnectionName.length} characters.`);
});

test.each([
  ['-test'],
  ['test-?'],
  ['test-\\'],
])('vpcIngressConnectionName includes invalid characters (name: %s)', (vpcIngressConnectionName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: ec2.InterfaceVpcEndpointAwsService.APP_RUNNER_REQUESTS,
    privateDnsEnabled: false,
  });

  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    isPubliclyAccessible: false,
  });

  expect(() => {
    new VpcIngressConnection(stack, 'VpcIngressConnection', {
      vpc,
      interfaceVpcEndpoint,
      service,
      vpcIngressConnectionName,
    });
  }).toThrow(`\`vpcIngressConnectionName\` must start with an alphanumeric character and contain only alphanumeric characters, hyphens, or underscores after that, got: ${vpcIngressConnectionName}.`);
});
