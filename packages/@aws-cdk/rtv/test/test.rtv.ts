import { Construct, ServicePrincipal, Stack } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { lambda, sqs } from '@aws-cdk/resources';
import { Test } from 'nodeunit';
import { RuntimeValue } from '../lib';

// tslint:disable:no-console

export = {
    'RuntimeValue is awesome'(test: Test) {
        const stack = new Stack();

        new RuntimeValueTest(stack, 'RuntimeValue');

        console.log(JSON.stringify(stack.toCloudFormation(), undefined, 2));
        test.done();
    }
};

class RuntimeValueTest extends Construct {

    constructor(parent: Construct, name: string) {
        super(parent, name);

        const queue = new sqs.QueueResource(this, 'Queue', {});

        const role = new Role(this, 'Role', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        });

        new lambda.FunctionResource(this, 'Function', {
            runtime: 'nodejs6.10',
            handler: 'index.handler',
            code: {
                zipFile: `
                exports.handler = function(event, context, callback) {
                    callback(undefined, "success");
                }
                `
            },
            role: role.roleArn,
            environment: {
                variables: {
                    [RuntimeValue.ENV_NAME]: RuntimeValue.ENV_VALUE
                }
            }
        });

        // used as a namespace to avoid collisions
        const RTV_PACKAGE = 'com.amazonaws.rtvtest';

        const runtimeValues = [
            new RuntimeValue(this, 'MyQueueURL', { package: RTV_PACKAGE, value: queue.ref }),
            new RuntimeValue(this, 'MyQueueName', { package: RTV_PACKAGE, value: queue.queueName })
        ];

        runtimeValues.forEach(rtv => rtv.grantRead(role));
    }
}
