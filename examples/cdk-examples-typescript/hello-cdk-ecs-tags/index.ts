import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

const COST_CENTER_KEY = 'CostCenter';

class MarketingDepartmentStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.VpcNetwork(this, 'MyVpc', { maxAZs: 3 });

    // override cost center to platform
    vpc.apply(new cdk.Tag(COST_CENTER_KEY, 'Platform'));

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // Create a load-balanced Fargate service and make it public
    const b2b = new ecs.LoadBalancedFargateService(this, 'B2BService', {
      cluster,  // Required
      cpu: '512', // Default is 256
      desiredCount: 6,  // Default is 1
      image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
      memoryMiB: '2048',  // Default is 512
      publicLoadBalancer: true  // Default is false
    });

    // Create a load-balanced Fargate service and make it public
    const b2c = new ecs.LoadBalancedFargateService(this, 'B2CService', {
      cluster,  // Required
      cpu: '512', // Default is 256
      desiredCount: 6,  // Default is 1
      image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
      memoryMiB: '2048',  // Default is 512
      publicLoadBalancer: true  // Default is false
    });

    // Output the DNS where you can access your service
    new cdk.Output(this, 'B2BLoadBalancerDNS', { value: b2b.loadBalancer.dnsName });
    new cdk.Output(this, 'B2CLoadBalancerDNS', { value: b2c.loadBalancer.dnsName });
  }
}

const app = new cdk.App();

// by default bill everything to marketing overrides are in the stack
app.apply(new cdk.Tag(COST_CENTER_KEY, 'Marketing'));

new MarketingDepartmentStack(app, 'Bonjour');

app.run();
