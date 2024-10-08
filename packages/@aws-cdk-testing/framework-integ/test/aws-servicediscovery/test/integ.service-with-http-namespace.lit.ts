import * as cdk from 'aws-cdk-lib';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');

const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
  name: 'MyHTTPNamespace',
});

const service1 = namespace.createService('NonIpService', {
  description: 'service registering non-ip instances',
});

service1.registerNonIpInstance('NonIpInstance', {
  customAttributes: { arn: 'arn:aws:s3:::amzn-s3-demo-bucket' },
});

const service2 = namespace.createService('IpService', {
  description: 'service registering ip instances',
  healthCheck: {
    type: servicediscovery.HealthCheckType.HTTP,
    resourcePath: '/check',
  },
});

service2.registerIpInstance('IpInstance', {
  ipv4: '54.239.25.192',
});

app.synth();
