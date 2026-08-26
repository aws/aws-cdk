
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const repositoryName = 'my-repo';

const lookupStack = new Stack(app, 'EcrRepoLookupStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});
const lookupRepo = ecr.Repository.fromLookup(lookupStack, 'LookupRepo', {
  repositoryName,
});
const testFunction = new lambda.Function(lookupStack, 'Lambda', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async function(event, context) { return "Hello, World!"; }'),
});
lookupRepo.grantRead(testFunction);

new CfnOutput(lookupStack, 'RepositoryUri', {
  value: lookupRepo.repositoryUri,
});

new IntegTest(app, 'EcrRepoLookupTest', {
  enableLookups: true,
  stackUpdateWorkflow: false,
  testCases: [lookupStack],
  // create a repository before the test and delete it after
  hooks: {
    preDeploy: [`aws ecr create-repository --repository-name ${repositoryName}`],
    postDeploy: [`aws ecr delete-repository --repository-name ${repositoryName} --force`],
  },
});
