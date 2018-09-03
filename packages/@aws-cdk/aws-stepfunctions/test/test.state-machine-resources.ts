import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Tasks can add permissions to the execution role'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const task = new stepfunctions.Task(stack, 'Task', {
            resource: new FakeResource(),
        });

        // WHEN
        new stepfunctions.StateMachine(stack, 'SM', {
            definition: task
        });

        // THEN
        expect(stack).to(haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: "resource:Everything",
                        Effect: "Allow",
                        Resource: "resource"
                    }
                ],
            }
        }));

        test.done();
    },

    'Tasks hidden inside a Parallel state are also included'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const task = new stepfunctions.Task(stack, 'Task', {
            resource: new FakeResource(),
        });

        const para = new stepfunctions.Parallel(stack, 'Para');
        para.branch(task);

        // WHEN
        new stepfunctions.StateMachine(stack, 'SM', {
            definition: para
        });

        // THEN
        expect(stack).to(haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: "resource:Everything",
                        Effect: "Allow",
                        Resource: "resource"
                    }
                ],
            }
        }));

        test.done();
    },
};

class FakeResource implements stepfunctions.IStepFunctionsTaskResource {
    public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
        const resourceArn = new cdk.Arn('resource');

        return {
            resourceArn,
            policyStatements: [new cdk.PolicyStatement()
                .addAction('resource:Everything')
                .addResource(new cdk.Arn('resource'))
            ]
         };
    }
}