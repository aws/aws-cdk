import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.PublicDnsNamespace(stack, 'Namespace', {
  name: 'foobar.com',
});

const service = namespace.createService('Service', {
  name: 'foo',
  dnsRecordType: servicediscovery.DnsRecordType.A,
  dnsTtlSec: 30,
  healthCheck: {
    type: servicediscovery.HealthCheckType.Https,
    resourcePath: '/healthcheck',
    failureThreshold: 2
  }
});

service.registerIpInstance('IpInstance', {
  ipv4: '54.239.25.192',
  port: 443
});

app.run();
