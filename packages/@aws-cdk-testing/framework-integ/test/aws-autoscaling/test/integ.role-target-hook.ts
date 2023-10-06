import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

export class FakeNotificationTarget implements autoscaling.ILifecycleHookTarget {
  constructor(private readonly topic: sns.ITopic) {
  }

  private createRole(scope: constructs.Construct, _role?: iam.IRole) {
    let role = _role;
    if (!role) {
      role = new iam.Role(scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
      });
    }

    return role;
  }

  public bind(_scope: constructs.Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig {
    const role = this.createRole(options.lifecycleHook, options.role);
    this.topic.grantPublish(role);

    return {
      notificationTargetArn: this.topic.topicArn,
      createdRole: role,
    };
  }
}

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new ec2.Vpc(this, 'myVpcAuto', { restrictDefaultSecurityGroup: false });
    const myrole = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
    });
    const topic = new sns.Topic(this, 'topic', {});
    const topic2 = new sns.Topic(this, 'topic2', {});

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(), // get the latest Amazon Linux image
      healthCheck: autoscaling.HealthCheck.ec2(),
    });

    // no role or notificationTarget
    new autoscaling.LifecycleHook(this, 'LCHookNoRoleNoTarget', {
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
    });

    // no role with notificationTarget
    new autoscaling.LifecycleHook(this, 'LCHookNoRoleTarget', {
      notificationTarget: new FakeNotificationTarget(topic),
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
    });

    // role with target
    new autoscaling.LifecycleHook(this, 'LCHookRoleTarget', {
      notificationTarget: new FakeNotificationTarget(topic2),
      role: myrole,
      autoScalingGroup: asg,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'integ-role-target-hook');

app.synth();
