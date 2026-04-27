import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/*

 Information about this Integ Test :

1. aws stepfunctions describe-state-machine --state-machine-arn <stack-output>
2. For the corresponding IAM role that automatically got created by StateMachine , Check the TrustPolicy :
aws iam get-role --role-name  <roleName>
3. The `AssumeRolePolicyDocument` document will satisfy the Security Best Practices :
Documentation Reference :
https://docs.aws.amazon.com/step-functions/latest/dg/procedure-create-iam-role.html#prevent-cross-service-confused-deputy
*/

/// !cdk-integ aws-stepfunctions-StateMachine-Role-TrustPolicy-BestPractices-integ

const app = new cdk.App();
const stack = new cdk.Stack(app,
  'aws-stepfunctions-StateMachine-Role-TrustPolicy-BestPractices-integ',
);

new sfn.StateMachine(stack,
  'Testing-Default-Role-StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Succeed(stack, 'Finished')),
  },
);

new IntegTest(app, 'StateMachineDefaultRoleTrust', { testCases: [stack] });

app.synth();
