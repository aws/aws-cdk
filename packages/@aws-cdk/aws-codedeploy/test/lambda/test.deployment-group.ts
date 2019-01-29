import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codedeploy = require('../../lib');
import { LambdaDeploymentConfig } from '../../lib';

function mockFunction(stack: cdk.Stack, id: string) {
  return new lambda.Function(stack, id, {
    code: lambda.Code.inline('mock'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NodeJS810
  });
}
function mockAlias(stack: cdk.Stack) {
  return new lambda.Alias(stack, 'Alias', {
    aliasName: 'my-alias',
    version: new lambda.Version(stack, 'Version', {
      lambda: mockFunction(stack, 'Function')
    })
  });
}

export = {
  "CodeDeploy Lambda DeploymentGroup": {
    "can be created with default AllAtOnce IN_PLACE configuration"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        ApplicationName: {
          Ref: "MyApp3CE31C26"
        },
        ServiceRoleArn: {
          "Fn::GetAtt": [
            "MyDGServiceRole5E94FD88",
            "Arn"
          ]
        },
        AutoRollbackConfiguration: {
          Enabled: true,
          Events: [
            "DEPLOYMENT_FAILURE"
          ]
        },
        DeploymentConfigName: "CodeDeployDefault.LambdaAllAtOnce",
        DeploymentStyle: {
          DeploymentOption: "WITHOUT_TRAFFIC_CONTROL",
          DeploymentType: "IN_PLACE"
        }
      }));

      expect(stack).to(haveResource('AWS::Lambda::Alias', {
        Type: "AWS::Lambda::Alias",
        Properties: {
          FunctionName: {
            Ref: "Function76856677"
          },
          FunctionVersion: {
            "Fn::GetAtt": [
              "Version6A868472",
              "Version"
            ]
          },
          Name: "my-alias"
        },
        UpdatePolicy: {
          CodeDeployLambdaAliasUpdate: {
            ApplicationName: {
              Ref: "MyApp3CE31C26"
            },
            DeploymentGroupName: {
              Ref: "MyDGC350BD3F"
            }
          }
        }
      }, ResourcePart.CompleteDefinition));

      expect(stack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "codedeploy.amazonaws.com"
            }
          }],
          Version: "2012-10-17"
        },
        ManagedPolicyArns: [
          // TODO: remove this guy
          'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda'
        ]
      }));

      test.done();
    },
    "can be created with explicit name"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        deploymentGroupName: 'test'
      });

      expect(stack).to(haveResourceLike('AWS::CodeDeploy::DeploymentGroup', {
        DeploymentGroupName: "test",
      }));

      test.done();
    },
    "can be created with explicit role"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      const serviceRole = new iam.Role(stack, 'MyRole', {
        assumedBy: new iam.ServicePrincipal('not-codedeploy.amazonaws.com')
      });

      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        serviceRole
      });

      expect(stack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "not-codedeploy.amazonaws.com"
            }
          }, {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "codedeploy.amazonaws.com"
            }
          }],
          Version: "2012-10-17"
        },
        ManagedPolicyArns: [
          // TODO: remove this guy?
          'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda'
        ]
      }));

      test.done();
    },
    "can configure blue/green traffic shifting"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: LambdaDeploymentConfig.Linear10PercentEvery1Minute
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        ApplicationName: {
          Ref: "MyApp3CE31C26"
        },
        ServiceRoleArn: {
          "Fn::GetAtt": [
            "MyDGServiceRole5E94FD88",
            "Arn"
          ]
        },
        AutoRollbackConfiguration: {
          Enabled: true,
          Events: [
            "DEPLOYMENT_FAILURE"
          ]
        },
        DeploymentConfigName: "CodeDeployDefault.LambdaLinear10PercentEvery1Minute",
        DeploymentStyle: {
          DeploymentOption: "WITH_TRAFFIC_CONTROL",
          DeploymentType: "BLUE_GREEN"
        }
      }));

      test.done();
    },
    "can rollback on alarm"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: codedeploy.LambdaDeploymentConfig.AllAtOnce,
        alarms: [new cloudwatch.Alarm(stack, 'Failures', {
          metric: alias.metricErrors(),
          comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
          threshold: 1,
          evaluationPeriods: 1
        })]
      });

      expect(stack).to(haveResourceLike('AWS::CodeDeploy::DeploymentGroup', {
        AlarmConfiguration: {
          Alarms: [{
            Name: {
              Ref: "Failures8A3E1A2F"
            }
          }],
          Enabled: true
        },
        AutoRollbackConfiguration: {
          Enabled: true,
          Events: [
            "DEPLOYMENT_FAILURE",
            "DEPLOYMENT_STOP_ON_ALARM"
          ]
        },
      }));

      test.done();
    },
    "can run pre hook lambda function before deployment"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        preHook: mockFunction(stack, 'PreHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce
      });

      expect(stack).to(haveResourceLike('AWS::Lambda::Alias', {
        UpdatePolicy: {
          CodeDeployLambdaAliasUpdate: {
            ApplicationName: {
              Ref: "MyApp3CE31C26"
            },
            DeploymentGroupName: {
              Ref: "MyDGC350BD3F"
            },
            BeforeAllowTrafficHook: {
              Ref: 'PreHook8B53F672'
            }
          }
        }
      }, ResourcePart.CompleteDefinition));

      test.done();
    },
    "can run post hook lambda function before deployment"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        postHook: mockFunction(stack, 'PostHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce
      });

      expect(stack).to(haveResourceLike('AWS::Lambda::Alias', {
        UpdatePolicy: {
          CodeDeployLambdaAliasUpdate: {
            ApplicationName: {
              Ref: "MyApp3CE31C26"
            },
            DeploymentGroupName: {
              Ref: "MyDGC350BD3F"
            },
            AfterAllowTrafficHook: {
              Ref: 'PostHookF2E49B30'
            }
          }
        }
      }, ResourcePart.CompleteDefinition));

      test.done();
    },
    "can disable rollback when alarm polling fails"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        postHook: mockFunction(stack, 'PostHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        ignorePollAlarmsFailure: true,
        alarms: [new cloudwatch.Alarm(stack, 'Failures', {
          metric: alias.metricErrors(),
          comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
          threshold: 1,
          evaluationPeriods: 1
        })]
      });

      expect(stack).to(haveResourceLike('AWS::CodeDeploy::DeploymentGroup', {
        AlarmConfiguration: {
          Alarms: [{
            Name: {
              Ref: "Failures8A3E1A2F"
            }
          }],
          Enabled: true,
          IgnorePollAlarmFailure: true
        },
      }));

      test.done();
    },
    "can disable rollback when deployment fails"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        postHook: mockFunction(stack, 'PostHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        autoRollback: {
          failedDeployment: false
        }
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
        ApplicationName: {
          Ref: "MyApp3CE31C26"
        },
        ServiceRoleArn: {
          "Fn::GetAtt": [
            "MyDGServiceRole5E94FD88",
            "Arn"
          ]
        },
        DeploymentConfigName: "CodeDeployDefault.LambdaAllAtOnce",
        DeploymentStyle: {
          DeploymentOption: "WITHOUT_TRAFFIC_CONTROL",
          DeploymentType: "IN_PLACE"
        }
      }));

      test.done();
    },
    "can enable rollback when deployment stops"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        postHook: mockFunction(stack, 'PostHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        autoRollback: {
          stoppedDeployment: true
        }
      });

      expect(stack).to(haveResourceLike('AWS::CodeDeploy::DeploymentGroup', {
        AutoRollbackConfiguration: {
          Enabled: true,
          Events: [
            "DEPLOYMENT_FAILURE",
            "DEPLOYMENT_STOP_ON_REQUEST"
          ]
        },
      }));

      test.done();
    },
    "can disable rollback when alarm in failure state"(test: Test) {
      const stack = new cdk.Stack();
      const application = new codedeploy.LambdaApplication(stack, 'MyApp');
      const alias = mockAlias(stack);
      new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        postHook: mockFunction(stack, 'PostHook'),
        deploymentConfig: LambdaDeploymentConfig.AllAtOnce,
        autoRollback: {
          deploymentInAlarm: false
        },
        alarms: [new cloudwatch.Alarm(stack, 'Failures', {
          metric: alias.metricErrors(),
          comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
          threshold: 1,
          evaluationPeriods: 1
        })]
      });

      expect(stack).to(haveResourceLike('AWS::CodeDeploy::DeploymentGroup', {
        AutoRollbackConfiguration: {
          Enabled: true,
          Events: [
            "DEPLOYMENT_FAILURE",
          ]
        },
      }));

      test.done();
    },
  }
};
