import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as stepfunctions from '../lib';

export = {
    'Instantiate Default State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass'))
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    },

    'Instantiate Standard State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
            stateMachineType: stepfunctions.StateMachineType.STANDARD
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            StateMachineType: "STANDARD",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    },

    'Instantiate Express State Machine'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.StateMachine(stack, 'MyStateMachine', {
            stateMachineName: "MyStateMachine",
            definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
            stateMachineType: stepfunctions.StateMachineType.EXPRESS
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            StateMachineName: "MyStateMachine",
            StateMachineType: "EXPRESS",
            DefinitionString: "{\"StartAt\":\"Pass\",\"States\":{\"Pass\":{\"Type\":\"Pass\",\"End\":true}}}"
        }));

        test.done();
    }
};
