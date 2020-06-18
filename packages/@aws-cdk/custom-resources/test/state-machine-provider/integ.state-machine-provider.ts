import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, CfnResource, Construct, CustomResource, Stack } from '@aws-cdk/core';
import { IStateMachine, StateMachineProvider } from '../../lib';

/*
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-state-machine-provider --query Stacks[0].Outputs[0].OutputValue
 *   should return "bar"
 */
class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const provider = new StateMachineProvider(this, 'Provider', {
      stateMachine: new PassStateMachine(this, 'PassStateMachine', {
        result: {
          PhysicalResourceId: 'physical-resource-id',
          Data: {
            foo: 'bar',
          },
        },
      }),
    });

    const cr = new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: {
        Key: 'value',
      },
    });

    new CfnOutput(this, 'Foo', {
      value: cr.getAttString('foo'),
    });
  }
}

interface PassStateMachineProps {
  result: any;
}

class PassStateMachine extends Construct implements IStateMachine {
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: PassStateMachineProps) {
    super(scope, id);

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
    });

    const definition = Stack.of(this).toJsonString({
      StartAt: 'Pass',
      States: {
        Pass: {
          Type: 'Pass',
          Result: props.result,
          End: true,
        },
      },
    });

    const passStateMachine = new CfnResource(this, 'Resource', {
      type: 'AWS::StepFunctions::StateMachine',
      properties: {
        DefinitionString: definition,
        RoleArn: role.roleArn,
      },
    });
    passStateMachine.node.addDependency(role);
    this.stateMachineArn = passStateMachine.ref;
  }
}

const app = new App();

new TestStack(app, 'cdk-integ-state-machine-provider');

app.synth();
