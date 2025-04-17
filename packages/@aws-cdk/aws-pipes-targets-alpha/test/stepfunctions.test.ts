import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DefinitionBody, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { TestSource } from './test-classes';
import { StateMachineInvocationType, SfnStateMachine } from '../lib/stepfunctions';

describe('step-function', () => {
  it('should have only target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });

    const target = new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.FIRE_AND_FORGET });

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: { Ref: 'MyStateMachine6C968CA5' },
      TargetParameters: {},
    });
  });

  it('should have target parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });

    const target = new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.FIRE_AND_FORGET });

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        StepFunctionStateMachineParameters: {
          InvocationType: 'FIRE_AND_FORGET',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });

    const inputTransformation = InputTransformation.fromObject({
      key: '👀',
    });
    const target = new SfnStateMachine(stateMachine, { inputTransformation, invocationType: StateMachineInvocationType.FIRE_AND_FORGET });

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        InputTemplate: '{"key":"👀"}',
        StepFunctionStateMachineParameters: {
          InvocationType: 'FIRE_AND_FORGET',
        },
      },
    });
  });

  it('should grant pipe role push access (StartSyncExecution) with invocation type REQUEST-RESPONSE', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });

    const target = new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.REQUEST_RESPONSE });

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartSyncExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyStateMachine6C968CA5',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('should grant pipe role push access (StartAsyncExecution) with invocation type FIRE_AND_FORGET', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
    });

    const target = new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.FIRE_AND_FORGET });

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyStateMachine6C968CA5',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('should grant pipe role push access (StartAsyncExecution) with default invocation type (FIRE_AND_FORGET)', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
    });

    const target = new SfnStateMachine(stateMachine, {});

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'MyStateMachine6C968CA5',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('should throw error when stateMachineType is STANDARD and invocationType is REQUEST_RESPONSE', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.STANDARD,
    });

    // ACT & ASSERT
    expect(() => {
      new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.REQUEST_RESPONSE });
    }).toThrow(new Error('STANDARD state machine workflows do not support the REQUEST_RESPONSE invocation type. Use FIRE_AND_FORGET instead.'));
  });

  it('should work with an imported standard state machine', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
    });
    const importedStateMachine = StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', stateMachine.stateMachineArn);

    const target = new SfnStateMachine(importedStateMachine, { inputTransformation: InputTransformation.fromObject({ key: '👀' }), invocationType: StateMachineInvocationType.FIRE_AND_FORGET }) ;

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        StepFunctionStateMachineParameters: {
          InvocationType: 'FIRE_AND_FORGET',
        },
      },
    });
  });

  it('should work with an imported express state machine', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });
    const importedStateMachine = StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', stateMachine.stateMachineArn);

    const target = new SfnStateMachine(importedStateMachine, { inputTransformation: InputTransformation.fromObject({ key: '👀' }), invocationType: StateMachineInvocationType.FIRE_AND_FORGET }) ;

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        StepFunctionStateMachineParameters: {
          InvocationType: 'FIRE_AND_FORGET',
        },
      },
    });
  });

  it('should work with an imported express state machine with REQUEST_RESPONSE', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
      stateMachineType: StateMachineType.EXPRESS,
    });
    const importedStateMachine = StateMachine.fromStateMachineArn(stack, 'ImportedStateMachine', stateMachine.stateMachineArn);

    const target = new SfnStateMachine(importedStateMachine, { inputTransformation: InputTransformation.fromObject({ key: '👀' }), invocationType: StateMachineInvocationType.REQUEST_RESPONSE }) ;

    new Pipe(stack, 'MySfnPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        StepFunctionStateMachineParameters: {
          InvocationType: 'REQUEST_RESPONSE',
        },
      },
    });
  });

  it('should throw error when stateMachineType is undefined (STANDARD) and invocationType is REQUEST_RESPONSE', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestSfnTargetStack');

    const stateMachine = new StateMachine(stack, 'MyStateMachine', {
      definitionBody: DefinitionBody.fromChainable(new Pass(stack, 'Wave', { stateName: '👋' })),
    });

    // ACT & ASSERT
    expect(() => {
      new SfnStateMachine(stateMachine, { invocationType: StateMachineInvocationType.REQUEST_RESPONSE });
    }).toThrow(new Error('STANDARD state machine workflows do not support the REQUEST_RESPONSE invocation type. Use FIRE_AND_FORGET instead.'));
  });
});
