import cdk = require('@aws-cdk/cdk');
import servicediscovery = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
  name: 'covfefe',
});

const service = namespace.createService('Service', {
  description: 'service description',
});

service.registerNonIpInstance({
  customAttributes: { arn: 'arn:aws:s3:::mybucket' }
});

app.run();
