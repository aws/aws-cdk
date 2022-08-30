import { SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { CnameRecord, PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, CfnOutput, Fn, Stack } from '@aws-cdk/core';
import { AssignPublicIpExtension, Container, Environment, Service, ServiceDescription } from '../lib';

// Record name. You can change this and redeploy this integration test to see
// what happens when the record name changes.
const RECORD_NAME = 'test-record';

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

// A record in the zone that is lexicographically later than 'test-record'
// to try to trip up the record set locator.
new CnameRecord(stack, 'laterRecord', {
  recordName: 'u-record',
  zone: dnsZone,
  domainName: 'console.aws.amazon.com',
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
  dns: {
    zone: dnsZone,
    recordName: RECORD_NAME,
  },
}));

new Service(stack, 'name', {
  environment: environment,
  serviceDescription: nameDescription,
});

new CfnOutput(stack, 'DnsName', {
  value: Fn.join('.', [RECORD_NAME, dnsZone.zoneName]),
});

new CfnOutput(stack, 'DnsServer', {
  value: Fn.select(0, dnsZone.hostedZoneNameServers!),
});

/**
 * Expect this stack to deploy. The stack outputs include a DNS name and a
 * nameserver. A short time after the services have settled, you may query the
 * nameserver for the record. If an IP address is shown, then this test has
 * succeeded.
 *
 * Example:
 *
 * ```
 * $ cdk --app 'node ./integ.assign-public-ip.js' deploy
 * ...
 * Outputs:
 * aws-ecs-integ.DnsName = test-record.myexample.com
 * aws-ecs-integ.DnsServer = ns-1836.awsdns-37.co.uk
 * ...
 *
 * $ host test-record.myexample.com ns-1836.awsdns-37.co.uk
 * Using domain server:
 * Name: ns-1836.awsdns-37.co.uk
 * Address: 2600:9000:5307:2c00::1#53
 * Aliases:
 *
 * test-record.myexample.com has address 52.60.53.62
 * ```
 */
