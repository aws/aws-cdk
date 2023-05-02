import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const task = new ecs.FargateTaskDefinition(this, 'Task', { cpu: 256, memoryLimitMiB: 512 });
    task.addContainer('nginx', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
      portMappings: [{ containerPort: 80 }],
    });
    const svc = new patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      vpc,
      taskDefinition: task,
      publicLoadBalancer: false,
    });

    const nlb = new elbv2.NetworkLoadBalancer(this, 'Nlb', {
      vpc,
      crossZoneEnabled: true,
      internetFacing: true,
    });
    const listener = nlb.addListener('listener', {
      port: 80,
    });

    const target = listener.addTargets('Targets', {
      targets: [new targets.AlbTarget(svc.loadBalancer, 80)],
      port: 80,
      healthCheck: {
        protocol: elbv2.Protocol.HTTP,
      },
    });
    target.node.addDependency(svc.listener);

    new CfnOutput(this, 'NlbEndpoint', { value: `http://${nlb.loadBalancerDnsName}` });
  }
}

const app = new App();
new TestStack(app, 'TestStack');
app.synth();
