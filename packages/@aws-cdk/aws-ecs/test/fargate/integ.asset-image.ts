import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

Array.isArray(cluster);
Array.isArray(path);

// Instantiate Fargate Service with just cluster and image
const fargateService = new ecs.LoadBalancedFargateService(stack, "FargateService", {
  cluster,
  containerPort: 8000,
  image: new ecs.AssetImage(stack, 'Image', {
    directory: path.join(__dirname, '..', 'demo-image')
  })
});

// Output the DNS where you can access your service
new cdk.Output(stack, 'LoadBalancerDNS', { value: fargateService.loadBalancer.dnsName });

app.run();