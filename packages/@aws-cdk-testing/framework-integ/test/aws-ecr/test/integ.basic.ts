import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({ maxImageCount: 5 });
repo.addLifecycleRule({ tagPrefixList: ['abc'], maxImageCount: 3 });
repo.addLifecycleRule({ tagPatternList: ['abc*'], maxImageCount: 3 });
repo.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['ecr:GetDownloadUrlForLayer'],
  principals: [new iam.AnyPrincipal()],
}));

const user = new iam.User(stack, 'MyIamUser');
repo.grantRead(user);
repo.grantPullPush(user);

new ecr.Repository(stack, 'RepoWithEmptyOnDelete', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  emptyOnDelete: true,
});

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

const repoOnEvent = new ecr.Repository(stack, 'RepoOnEvent');
const lambdaHandler = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.PYTHON_3_12,
  code: lambda.Code.fromInline('# dummy func'),
  handler: 'index.handler',
});

repoOnEvent.onEvent('OnEventTargetLambda', {
  target: new LambdaFunction(lambdaHandler),
});

new IntegTest(app, 'cdk-ecr-integ-test-basic', {
  testCases: [stack],
});
