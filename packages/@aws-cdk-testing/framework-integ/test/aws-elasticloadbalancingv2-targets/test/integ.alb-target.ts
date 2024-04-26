import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    new elbv2.ApplicationTargetGroup(this, 'TG', {
      targetType: elbv2.TargetType.INSTANCE,
      loadBalancingAlgorithmAnomalyDetection: true,
      loadBalancingAlgorithmType: elbv2.TargetGroupLoadBalancingAlgorithmType.WEIGHTED_RANDOM,
      port: 80,
      vpc,
    });
  }
}

const app = new App();
new TestStack(app, 'TestStack');
app.synth();
