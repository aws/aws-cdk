import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as sfn from '../lib';

export interface FakeTaskProps extends sfn.TaskStateBaseProps {
  parameters?: { [key: string]: string };
}

/**
 * Task extending sfn.TaskStateBase to facilitate integ testing setting credentials
 */
export class FakeTask extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly parameters?: { [key: string]: string };

  constructor(scope: constructs.Construct, id: string, props: FakeTaskProps = {}) {
    super(scope, id, props);
    this.parameters = props.parameters;
  }

  protected _renderTask(): any {
    return {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:putItem',
      Parameters: {
        TableName: 'my-cool-table',
        Item: {
          id: {
            S: 'my-entry',
          },
        },
        ...this.parameters,
      },
    };
  }
}

/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-state-machine-credentials-integ');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

new sfn.StateMachine(stack, 'StateMachineWithLiteralCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithLiteralCredentials', { credentials: { role: sfn.TaskRole.fromRole(role) } }),
  timeout: cdk.Duration.seconds(30),
});

const crossAccountRole = iam.Role.fromRoleArn(stack, 'CrossAccountRole', 'arn:aws:iam::123456789012:role/CrossAccountRole');

new sfn.StateMachine(stack, 'StateMachineWithCrossAccountLiteralCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithCrossAccountLiteralCredentials', { credentials: { role: sfn.TaskRole.fromRole(crossAccountRole) } }),
  timeout: cdk.Duration.seconds(30),
});

new sfn.StateMachine(stack, 'StateMachineWithJsonPathCredentials', {
  definition: new FakeTask(stack, 'FakeTaskWithJsonPathCredentials', { credentials: { role: sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn') } }),
  timeout: cdk.Duration.seconds(30),
});

new IntegTest(app, 'StateMachineCredentials', { testCases: [stack] });
