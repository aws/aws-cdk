import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as servicediscovery from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
  name: 'boobar.com',
  vpc,
});

const service = namespace.createService('Service', {
  dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
  dnsTtl: cdk.Duration.seconds(30),
  loadBalancer: true,
});

const loadbalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });

service.registerLoadBalancer('Loadbalancer', loadbalancer);

app.synth();
