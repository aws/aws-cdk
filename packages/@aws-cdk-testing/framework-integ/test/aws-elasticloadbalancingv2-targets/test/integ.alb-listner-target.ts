import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

// WHEN
const app = new cdk.App();

// GIVEN
class ALBListenerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', { vpc });
    const albListener = alb.addListener('ALBListener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.fixedResponse(200),
    });
    const nlb = new elbv2.NetworkLoadBalancer(this, 'NLB', { vpc });
    const listener = nlb.addListener('Listener', { port: 80 });
    listener.addTargets('Targets', {
      targets: [new targets.AlbListenerTarget(albListener)],
      port: 80,
    });
  }
}

// EXPECT
const stack = new ALBListenerStack(app, 'nlb-alb-listner-stack');
new IntegTest(app, 'Integ', {
  testCases: [stack],
});
app.synth();
