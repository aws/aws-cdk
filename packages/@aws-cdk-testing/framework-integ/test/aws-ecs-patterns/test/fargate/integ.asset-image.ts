import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-fargate-image');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

Array.isArray(cluster);
Array.isArray(path);

// Instantiate Fargate Service with just cluster and image
const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateService', {
  cluster,
  taskImageOptions: {
    containerPort: 8000,
    image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
  },
});

// CfnOutput the DNS where you can access your service
new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

new integ.IntegTest(app, 'fargateAssetImageTest', {
  testCases: [stack],
});

app.synth();
