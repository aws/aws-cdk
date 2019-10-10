import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import path = require('path');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

Array.isArray(cluster);
Array.isArray(path);

// Instantiate Fargate Service with just cluster and image
const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateService", {
  cluster,
  taskImageOptions: {
    containerPort: 8000,
    image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
  },
});

// CfnOutput the DNS where you can access your service
new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

app.synth();
