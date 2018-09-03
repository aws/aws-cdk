import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'instantiate Activity'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new stepfunctions.Activity(stack, 'Activity');

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::Activity', {
            Name: 'Activity'
        }));

        test.done();
    },

    'Activity can be used in a Task'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const activity = new stepfunctions.Activity(stack, 'Activity');
        const task = new stepfunctions.Task(stack, 'Task', {
            resource: activity
        });
        new stepfunctions.StateMachine(stack, 'SM', {
            definition: task
        });

        // THEN
        expect(stack).to(haveResource('AWS::StepFunctions::StateMachine', {
            DefinitionString: {
                "Fn::Join": ["", [
                    "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"Type\":\"Task\",\"Resource\":\"",
                    { Ref: "Activity04690B0A" },
                    "\",\"End\":true}}}"
                ]]
            },
        }));

        test.done();
    },
};