import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { EksCall, HttpMethods } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

/*
 * Create a state machine with a task state to use the Kubernetes API to read Kubernetes resource objects
 * via a Kubernetes API endpoint.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eks-call-integ-test');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const cluster = new eks.Cluster(stack, 'EksCluster', {
  version: eks.KubernetesVersion.V1_30,
  clusterName: 'eksCluster',
  kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
});

const executionRole = new iam.Role(stack, 'Role', {
  roleName: 'stateMachineExecutionRole',
  assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
});

cluster.awsAuth.addMastersRole(executionRole);

const callJob = new EksCall(stack, 'Call a EKS Endpoint', {
  cluster: cluster,
  httpMethod: HttpMethods.GET,
  httpPath: '/api/v1/namespaces/default/pods',
});

const chain = sfn.Chain.start(callJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  role: executionRole,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new integ.IntegTest(app, 'aws-stepfunctions-tasks-eks-call-integ', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

app.synth();
