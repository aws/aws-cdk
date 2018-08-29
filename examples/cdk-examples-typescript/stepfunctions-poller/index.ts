import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

class Poller extends stepfunctions.StateMachine {
    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        const submitJob = new stepfunctions.Pass(this, 'Submit Job');
        const waitJob = new stepfunctions.Wait(this, 'Wait X Seconds', { seconds: 60 });
        const getJobStatus = new stepfunctions.Pass(this, 'Get Job Status');
        const jobComplete = new stepfunctions.Choice(this, 'Job Complete?');
        const jobFailed = new stepfunctions.Fail(this, 'Job Failed', { cause: 'Job failed', error: 'JobFailure' });
        const getFinalStatus = new stepfunctions.Pass(this, 'Get Final Job Status');

        submitJob.next(waitJob);
        waitJob.next(getJobStatus);
        getJobStatus.next(jobComplete);
        jobComplete.on(new stepfunctions.StringEqualsComparisonOperation({ variable: '$.status', value: "SUCCEEDED" }), getFinalStatus);
        jobComplete.on(new stepfunctions.StringEqualsComparisonOperation({ variable: '$.status', value: "FAILED" }), jobFailed);
        jobComplete.otherwise(waitJob);

        new stepfunctions.Branch(this)
            .pass(submitJob)
            .label('loop')
            .wait(waitJob)
            .wait_('Wait Some More', { seconds: 10 })
            .pass(getJobStatus)
            .choice(jobComplete)
                .on(new stepfunctions.StringEqualsComparisonOperation({ variable: '$.status', value: "SUCCEEDED" }))
                    .pass(getFinalStatus)
                    .end()
                .on(new stepfunctions.StringEqualsComparisonOperation({ variable: '$.status', value: "FAILED" }))
                    .fail(jobFailed)
                    .end()
                .otherwise().goto('loop');

        // States referenceable inside container are different from states
        // rendered!
    }
}

class StepFunctionsDemoStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string) {
        super(parent, name);

        new Poller(this, 'SM');
    }
}

const app = new cdk.App(process.argv);
new StepFunctionsDemoStack(app, 'StepFunctionsDemo');
process.stdout.write(app.run());