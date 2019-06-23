import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import lbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codedeploy = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'CodeDeploy Server Deployment Group': {
    "can be created by explicitly passing an Application"(test: Test) {
      const stack = new cdk.Stack();

      const application = new codedeploy.ServerApplication(stack, 'MyApp');
      new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
        application,
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "ApplicationName": {
          "Ref": "MyApp3CE31C26"
        },
      }));

      test.done();
    },

    'can be imported'(test: Test) {
      const stack = new cdk.Stack();

      const application = codedeploy.ServerApplication.fromServerApplicationName(stack, 'MyApp', 'MyApp');
      const deploymentGroup = codedeploy.ServerDeploymentGroup.fromServerDeploymentGroupAttributes(stack, 'MyDG', {
        application,
        deploymentGroupName: 'MyDG',
      });

      test.notEqual(deploymentGroup, undefined);

      test.done();
    },

    "created with ASGs contains the ASG names"(test: Test) {
      const stack = new cdk.Stack();

      const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: new ec2.Vpc(stack, 'VPC'),
      });

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        autoScalingGroups: [asg],
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoScalingGroups": [
          {
          "Ref": "ASG46ED3070",
          },
        ]
      }));

      test.done();
    },

    "created without ASGs but adding them later contains the ASG names"(test: Test) {
      const stack = new cdk.Stack();

      const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: new ec2.Vpc(stack, 'VPC'),
      });

      const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
      deploymentGroup.addAutoScalingGroup(asg);

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoScalingGroups": [
          {
          "Ref": "ASG46ED3070",
          },
        ]
      }));

      test.done();
    },

    'can be created with an ALB Target Group as the load balancer'(test: Test) {
      const stack = new cdk.Stack();

      const alb = new lbv2.ApplicationLoadBalancer(stack, 'ALB', {
        vpc: new ec2.Vpc(stack, 'VPC'),
      });
      const listener = alb.addListener('Listener', { protocol: lbv2.ApplicationProtocol.HTTP });
      const targetGroup = listener.addTargets('Fleet', { protocol: lbv2.ApplicationProtocol.HTTP });

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        loadBalancer: codedeploy.LoadBalancer.application(targetGroup),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "LoadBalancerInfo": {
          "TargetGroupInfoList": [
            {
              "Name": {
                "Fn::GetAtt": [
                  "ALBListenerFleetGroup008CEEE4",
                  "TargetGroupName",
                ],
              },
            },
          ],
        },
        "DeploymentStyle": {
          "DeploymentOption": "WITH_TRAFFIC_CONTROL",
        },
      }));

      test.done();
    },

    'can be created with an NLB Target Group as the load balancer'(test: Test) {
      const stack = new cdk.Stack();

      const nlb = new lbv2.NetworkLoadBalancer(stack, 'NLB', {
        vpc: new ec2.Vpc(stack, 'VPC'),
      });
      const listener = nlb.addListener('Listener', { port: 80 });
      const targetGroup = listener.addTargets('Fleet', { port: 80 });

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        loadBalancer: codedeploy.LoadBalancer.network(targetGroup),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "LoadBalancerInfo": {
          "TargetGroupInfoList": [
            {
              "Name": {
                "Fn::GetAtt": [
                  "NLBListenerFleetGroupB882EC86",
                  "TargetGroupName",
                ],
              },
            },
          ],
        },
        "DeploymentStyle": {
          "DeploymentOption": "WITH_TRAFFIC_CONTROL",
        },
      }));

      test.done();
    },

    'can be created with a single EC2 instance tag set with a single or no value'(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        ec2InstanceTags: new codedeploy.InstanceTagSet(
          {
            'some-key': ['some-value'],
            'other-key': [],
          },
        ),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "Ec2TagSet": {
          "Ec2TagSetList": [
            {
              "Ec2TagGroup": [
                {
                  "Key": "some-key",
                  "Value": "some-value",
                  "Type": "KEY_AND_VALUE",
                },
                {
                  "Key": "other-key",
                  "Type": "KEY_ONLY",
                },
              ],
            },
          ],
        },
      }));

      test.done();
    },

    'can be created with two on-premise instance tag sets with multiple values or without a key'(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        onPremiseInstanceTags: new codedeploy.InstanceTagSet(
          {
            'some-key': ['some-value', 'another-value'],
          },
          {
            '': ['keyless-value'],
          },
        ),
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "OnPremisesTagSet": {
          "OnPremisesTagSetList": [
            {
              "OnPremisesTagGroup": [
                {
                  "Key": "some-key",
                  "Value": "some-value",
                  "Type": "KEY_AND_VALUE",
                },
                {
                  "Key": "some-key",
                  "Value": "another-value",
                  "Type": "KEY_AND_VALUE",
                },
              ],
            },
            {
              "OnPremisesTagGroup": [
                {
                  "Value": "keyless-value",
                  "Type": "VALUE_ONLY",
                },
              ],
            },
          ],
        },
      }));

      test.done();
    },

    'cannot be created with an instance tag set containing a keyless, valueless filter'(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
          onPremiseInstanceTags: new codedeploy.InstanceTagSet({
            '': [],
          }),
        });
      });

      test.done();
    },

    'cannot be created with an instance tag set containing 4 instance tag groups'(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
          onPremiseInstanceTags: new codedeploy.InstanceTagSet({}, {}, {}, {}),
        });
      }, /3/);

      test.done();
    },

    'can have alarms added to it after being created'(test: Test) {
      const stack = new cdk.Stack();

      const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
        metric: new cloudwatch.Metric({
          metricName: 'Errors',
          namespace: 'my.namespace',
        }),
        threshold: 1,
        evaluationPeriods: 1,
      });

      const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
      deploymentGroup.addAlarm(alarm);

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AlarmConfiguration": {
          "Alarms": [
            {
              "Name": {
                "Ref": "Alarm1F9009D71",
              },
            },
          ],
          "Enabled": true,
        },
      }));

      test.done();
    },

    'only automatically rolls back failed deployments by default'(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoRollbackConfiguration": {
          "Enabled": true,
          "Events": [
            "DEPLOYMENT_FAILURE",
          ],
        },
      }));

      test.done();
    },

    'rolls back alarmed deployments if at least one alarm has been added'(test: Test) {
      const stack = new cdk.Stack();

      const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
        metric: new cloudwatch.Metric({
          metricName: 'Errors',
          namespace: 'my.namespace',
        }),
        threshold: 1,
        evaluationPeriods: 1,
      });

      const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        autoRollback: {
          failedDeployment: false,
        },
      });
      deploymentGroup.addAlarm(alarm);

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        "AutoRollbackConfiguration": {
          "Enabled": true,
          "Events": [
            "DEPLOYMENT_STOP_ON_ALARM",
          ],
        },
      }));

      test.done();
    },

    'setting to roll back on alarms without providing any results in an exception'(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
        autoRollback: {
          deploymentInAlarm: true,
        },
      });

      test.throws(() => SynthUtils.toCloudFormation(stack), /deploymentInAlarm/);
      test.done();
    },
  },
};
