import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.PublicDnsNamespace(stack, 'Namespace', {
  namespaceName: cdk.PhysicalName.of('foobar.com'),
});

const service = namespace.createService('Service', {
  name: 'foo',
  dnsRecordType: servicediscovery.DnsRecordType.CNAME,
  dnsTtlSec: 30
});

service.registerCnameInstance('CnameInstance', {
  instanceCname: 'service.pizza',
});

app.synth();
