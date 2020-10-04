import { SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { AssignPublicIpExtension, Container, Environment, Service, ServiceDescription } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');

const vpc = new Vpc(stack, 'vpc', {
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'public',
      subnetType: SubnetType.PUBLIC,
    },
  ],
});

const dnsZone = new PublicHostedZone(stack, 'zone', {
  zoneName: 'myexample.com',
});

const environment = new Environment(stack, 'production', { vpc });

const nameDescription = new ServiceDescription();

nameDescription.add(new Container({
  cpu: 256,
  memoryMiB: 512,
  trafficPort: 80,
  image: ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));

nameDescription.add(new AssignPublicIpExtension({
  dnsZone: dnsZone,
  dnsRecordName: 'test-record',
}));

new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});

/**
 * Expect this stack to deploy, plain and simple. If the service doesn't enable
 * public IP addresses, ECS won't detect that the service has stabilized - it
 * will fail to pull the container image as there's no NAT gateway in the VPC.
 */
