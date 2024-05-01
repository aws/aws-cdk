import * as cdk from 'aws-cdk-lib';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.PublicDnsNamespace(stack, 'Namespace', {
  name: 'foobar.com',
});

const service = namespace.createService('Service', {
  name: 'foo',
  dnsRecordType: servicediscovery.DnsRecordType.A,
  dnsTtl: cdk.Duration.seconds(30),
  healthCheck: {
    type: servicediscovery.HealthCheckType.HTTPS,
    resourcePath: '/healthcheck',
    failureThreshold: 2,
  },
});

service.registerIpInstance('IpInstance', {
  ipv4: '54.239.25.192',
  port: 443,
});

app.synth();
