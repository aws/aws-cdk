import * as scaling from '@aws-cdk/aws-autoscaling';
import { Vpc, InstanceType, InstanceClass, InstanceSize, OperatingSystemType, UserData } from '@aws-cdk/aws-ec2';
import { Queue } from '@aws-cdk/aws-sqs';
import { StringParameter } from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { QueueHook } from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  public readonly queueUrl: string;
  public readonly groupName: string;
  public readonly hookName: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const queue = new Queue(this, 'HookQueue');
    this.queueUrl = queue.queueUrl;
    const group = new scaling.AutoScalingGroup(this, 'Group', {
      vpc: new Vpc(this, 'Vpc'),
      maxCapacity: 1,
      minCapacity: 0,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      machineImage: {
        getImage: () => {
          return {
            osType: OperatingSystemType.LINUX,
            userData: UserData.forLinux(),
            imageId: StringParameter.fromStringParameterName(this, 'al2022AMI', '/aws/service/ami-amazon-linux-latest/al2022-ami-kernel-default-x86_64').stringValue,
          };
        },
      },
    });
    this.groupName = group.autoScalingGroupName;
    const hook = group.addLifecycleHook('scaleout', {
      lifecycleTransition: scaling.LifecycleTransition.INSTANCE_LAUNCHING,
      notificationTarget: new QueueHook(queue),
    });
    this.hookName = hook.lifecycleHookName;

  }
}

const testCase = new TestStack(app, 'integ-autoscalinghook-queue');
const integ = new IntegTest(app, 'queue-hook-test', {
  testCases: [testCase],
});

const setDesired = integ.assertions.awsApiCall('AutoScaling', 'setDesiredCapacity', {
  AutoScalingGroupName: testCase.groupName,
  DesiredCapacity: 1,
});


const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: testCase.queueUrl,
});
message.assertAtPath(
  'Messages.0.Body.LifecycleTransition',
  ExpectedResult.stringLikeRegexp('autoscaling:EC2_INSTANCE_LAUNCHING'),
).waitForAssertions();

const token = message.getAttString('Messages.0.Body.LifecycleActionToken');

const completeAction = integ.assertions.awsApiCall('AutoScaling', 'completeLifecycleAction', {
  AutoScalingGroupName: testCase.groupName,
  LifecycleActionResult: 'CONTINUE',
  LifecycleActionToken: token,
  LifecycleHookName: testCase.hookName,
});

setDesired.next(
  message.next(
    completeAction,
  ),
);
