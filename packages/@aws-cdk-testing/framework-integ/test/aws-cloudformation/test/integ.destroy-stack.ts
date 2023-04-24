import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);
    }
}
const app = new App();
const stack1 = new TestStack(app, 'test-destroy');
const stack2 = {} as unknown as Stack;

new integ.IntegTest(app, 'test-destroy', {
    testCases: [stack1, stack2],
});

app.synth();