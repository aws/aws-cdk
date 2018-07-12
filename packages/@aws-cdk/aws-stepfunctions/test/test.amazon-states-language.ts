import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';

import { cloudformation, amazon_states_language as asl } from '../lib';

export = {
    'Hello World'(test: Test) {
        const stack = new Stack();

        new cloudformation.StateMachineResource(stack, "", {
            roleArn: "",
            definitionString: JSON.stringify(
                <asl.StateMachine>{
                    Comment: "A simple minimal example of the States language",
                    StartAt: "Hello World",
                    States: {
                        "Hello World": {
                            Type: asl.StateType.Task,
                            Resource: "arn:aws:lambda:us-east-1:123456789012:function:HelloWorld",
                            End: true
                        }
                    }
                }
            )
        })

        test.done();
    }
};
