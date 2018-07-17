import { App, Stack } from '@aws-cdk/cdk';
import { InlineJavaScriptLambda } from '@aws-cdk/lambda';
import { Queue } from '@aws-cdk/sqs';
import { RuntimeValue } from '../lib';

function runtimeCode(_event: any, _context: any, callback: any) {
    return callback();
}

class TestStack extends Stack {
    constructor(parent: App, name: string) {
        super(parent, name);

        const queue = new Queue(this, 'MyQueue');
        const fn = new InlineJavaScriptLambda(this, 'MyFunction', {
            handler: { fn: runtimeCode },
        });

        // this line defines an AWS::SSM::Parameter resource with the
        // key "/rtv/<stack-name>/com.myorg/MyQueueURL" and the actual queue URL as value
        const queueUrlRtv = new RuntimeValue(this, 'MyQueueURL', {
            package: 'com.myorg',
            value: queue.queueUrl
        });

        // this line adds read permissions for this SSM parameter to the policies associated with
        // the IAM roles of the Lambda function and the EC2 fleet
        queueUrlRtv.grantRead(fn.role);

        // adds the `RTV_STACK_NAME` to the environment of the lambda function
        // and the fleet (via user-data)
        fn.addEnvironment(RuntimeValue.ENV_NAME, RuntimeValue.ENV_VALUE);
    }
}

const app = new App(process.argv);

new TestStack(app, 'aws-cdk-rtv-lambda');

process.stdout.write(app.run());
