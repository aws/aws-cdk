import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
  name: 'covfefe',
});

new servicediscovery.Service(stack, 'Service', {
  name: 'service',
  namespace,
  description: 'service description',
  healthCheckCustomConfig: {
    failureThreshold: 3,
  }
});

app.run();
