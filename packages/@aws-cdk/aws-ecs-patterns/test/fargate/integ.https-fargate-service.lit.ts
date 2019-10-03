import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import elb = require('@aws-cdk/aws-elasticloadbalancingv2');
import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/core');

import { ApplicationLoadBalancedFargateService } from '../../lib';

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

    const domainZone = new route53.HostedZone(this, 'Zone', {
      zoneName: 'example.com'
    });

    /// !show
    new ApplicationLoadBalancedFargateService(this, 'HttpsService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      protocol: elb.ApplicationProtocol.HTTPS,
      domainName: 'test.example.com',
      domainZone
    });
    /// !hide
  }
}

new EventStack(app, 'aws-fargate-https-integ');
app.synth();
