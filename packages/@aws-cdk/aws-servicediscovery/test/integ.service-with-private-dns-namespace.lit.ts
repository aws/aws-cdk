import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'Namespace', {
  name: 'boobar.com',
  vpc,
});

const service = namespace.createService('Service', {
  name: 'boo',
  dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
  dnsTtlSec: 30,
  loadBalancer: true
});

const loadbalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });

service.registerLoadBalancer('LoadBalancer', loadbalancer);

app.run();
