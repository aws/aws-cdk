import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

class Poller extends stepfunctions.StateMachineDefinition {
    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        const submitJob = new stepfunctions.Pass(this, 'Submit Job');
        const waitJob = new stepfunctions.Wait(this, 'Wait X Seconds', { seconds: 60 });
        const getJobStatus = new stepfunctions.Pass(this, 'Get Job Status');
        const jobComplete = new stepfunctions.Choice(this, 'Job Complete?');
        const jobFailed = new stepfunctions.Fail(this, 'Job Failed', { cause: 'Job failed', error: 'JobFailure' });
        const getFinalStatus = new stepfunctions.Pass(this, 'Get Final Job Status');

        this.define(submitJob
            .then(waitJob)
            .then(getJobStatus)
            .then(jobComplete
                .on(stepfunctions.Condition.stringEquals('$.status', 'SUCCEEDED'), getFinalStatus)
                .on(stepfunctions.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
                .otherwise(waitJob)));

        // States referenceable inside container are different from states
        // rendered!
    }
}

class StepFunctionsDemoStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string) {
        super(parent, name);

        new stepfunctions.StateMachine(this, 'StateMachine', {
            definition: new Poller(this, 'Poller')
        });
    }
}

const app = new cdk.App(process.argv);
new StepFunctionsDemoStack(app, 'StepFunctionsDemo');
process.stdout.write(app.run());