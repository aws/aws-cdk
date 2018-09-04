import cdk = require( '@aws-cdk/cdk');
import stepfunctions = require('../lib');

class JobPollerStack extends cdk.Stack {
    constructor(parent: cdk.App, id: string, props: cdk.StackProps = {}) {
        super(parent, id, props);

        const submitJobActivity = new stepfunctions.Activity(this, 'SubmitJob');
        const checkJobActivity = new stepfunctions.Activity(this, 'CheckJob');

        const submitJob = new stepfunctions.Task(this, 'Submit Job', {
            resource: submitJobActivity,
            resultPath: '$.guid',
        });
        const waitX = new stepfunctions.Wait(this, 'Wait X Seconds', { secondsPath: '$.wait_time' });
        const getStatus = new stepfunctions.Task(this, 'Get Job Status', {
            resource: checkJobActivity,
            inputPath: '$.guid',
            resultPath: '$.status',
        });
        const isComplete = new stepfunctions.Choice(this, 'Job Complete?');
        const jobFailed = new stepfunctions.Fail(this, 'Job Failed', {
            cause: 'AWS Batch Job Failed',
            error: 'DescribeJob returned FAILED',
        });
        const finalStatus = new stepfunctions.Task(this, 'Get Final Job Status', {
            resource: checkJobActivity,
            inputPath: '$.guid',
        });

        const chain = submitJob
            .next(waitX)
            .next(getStatus)
            .next(isComplete
                .on(stepfunctions.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
                .on(stepfunctions.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
                .otherwise(waitX))
            .defaultRetry({
                intervalSeconds: 1,
                maxAttempts: 3,
                backoffRate: 2
            });

        new stepfunctions.StateMachine(this, 'StateMachine', {
            definition: chain,
            timeoutSeconds: 30
        });
    }
}

const app = new cdk.App(process.argv);
new JobPollerStack(app, 'aws-stepfunctions-integ');
process.stdout.write(app.run());