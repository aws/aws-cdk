import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
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
                Version: '2012-10-17',
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
                Version: '2012-10-17',
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

    'Task metrics use values returned from resource'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const task = new stepfunctions.Task(stack, 'Task', { resource: new FakeResource() });

        // THEN
        const sharedMetric = {
            periodSec: 300,
            namespace: 'AWS/States',
            dimensions: { ResourceArn: 'resource' },
        };
        test.deepEqual(cdk.resolve(task.metricRunTime()), {
            ...sharedMetric,
            metricName: 'FakeResourceRunTime',
            statistic: 'Average'
        });

        test.deepEqual(cdk.resolve(task.metricFailed()), {
            ...sharedMetric,
            metricName: 'FakeResourcesFailed',
            statistic: 'Sum'
        });

        test.done();
    },

    'Task should render InputPath / Parameters / OutputPath correctly'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const task = new stepfunctions.Task(stack, 'Task', {
            resource: new FakeResource(),
            inputPath: "$",
            outputPath: "$.state",
            parameters: {
                "input.$": "$",
                "step": "inital-task"
            }
        });

        // WHEN
        const taskState = task.toStateJson();

        // THEN
        test.deepEqual(taskState, {
            End: true,
            Retry: undefined,
            Catch: undefined,
            InputPath: '$',
            Parameters: { 'input.$': '$', 'step': 'inital-task' },
            OutputPath: '$.state',
            Type: 'Task',
            Comment: undefined,
            Resource: 'resource',
            ResultPath: undefined,
            TimeoutSeconds: undefined,
            HeartbeatSeconds: undefined
        });

        test.done();
    }
};

class FakeResource implements stepfunctions.IStepFunctionsTaskResource {
    public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
        const resourceArn = 'resource';

        return {
            resourceArn,
            policyStatements: [new iam.PolicyStatement()
                .addAction('resource:Everything')
                .addResource('resource')
            ],
            metricPrefixSingular: 'FakeResource',
            metricPrefixPlural: 'FakeResources',
            metricDimensions: { ResourceArn: resourceArn },
         };
    }
}
