
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new App();
const repositoryName = 'my-repo';

const setupStack = new Stack(app, 'EcrRepoStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

new ecr.Repository(setupStack, 'Repo', {
  repositoryName,
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteImages: true,
});

const lookupStack = new Stack(app, 'EcrRepoLookupStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});
new ecr.Repository(lookupStack, 'TestRepo', {
  repositoryName: 'test-repo',
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteImages: true,
});
const lookupRepo = ecr.Repository.fromLookup(lookupStack, 'LookupRepo', {
  repositoryName,
});

new CfnOutput(lookupStack, 'RepositoryUri', {
  value: lookupRepo.repositoryUri,
});

new IntegTest(app, 'cdk-integ-auto-delete-images', {
  testCases: [lookupStack],
});
