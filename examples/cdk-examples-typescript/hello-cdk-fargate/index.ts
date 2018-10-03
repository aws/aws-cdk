import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');

class BonjourFargate extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);
    const vpc = new ec2.VpcNetwork(this, 'VPC');
    const cluster = new ecs.FargateCluster(this, 'Cluster', {
      vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: '512',
      memoryMiB: '2GB'
    });

    taskDefinition.addContainer('WebApp', {
      // image: new ecs.ImageFromSource('./my-webapp-source'),
      image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
      // portMappings: [{ containerPort: 8080 }],
    });

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition
    });

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const listener = loadBalancer.addListener('Listener', {
      port: 80,
      open: true,
    });

    listener.addTargets('DefaultTargets', {
      targets: [service],
      protocol: elbv2.ApplicationProtocol.Http
    });
  }
}

const app = new cdk.App(process.argv);

new BonjourFargate(app, 'Bonjour');

process.stdout.write(app.run());
