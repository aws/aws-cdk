import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const namespace = new servicediscovery.Namespace(stack, 'Namespace', {
  name: "foobar.com",
  vpc,
  type: servicediscovery.NamespaceType.DnsPrivate
});

new servicediscovery.Service(stack, 'Service', {
  name: "frontend",
  namespace,
});

app.run();
