import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';

import { amazon_states_language as asl, cloudformation } from '../lib';

export = {
    'Hello World'(test: Test) {
        const stack = new Stack();

        new cloudformation.StateMachineResource(stack, "StateMachine", {
            roleArn: "",
            definitionString: new asl.StateMachine({
                comment: "A simple minimal example of the States language",
                startAt: "Hello World",
                states: {
                    "Hello World": new asl.TaskState({
                        resource: "arn:aws:lambda:us-east-1:123456789012:function:HelloWorld",
                        end: true
                    })
                }
            }).definitionString()
        });

        test.done();
    }
};
