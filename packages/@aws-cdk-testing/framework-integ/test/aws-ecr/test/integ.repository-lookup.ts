
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new App();
const repositoryName = 'my-repo';

const stack = new Stack(app, 'Stack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

new ecr.Repository(stack, 'Repo', {
  repositoryName,
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteImages: true,
});

const lookupStack = new Stack(app, 'LookupStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

ecr.Repository.fromLookup(lookupStack, 'LookupRepo', {
  repositoryName,
});

new IntegTest(app, 'cdk-integ-auto-delete-images', {
  enableLookups: true,
  testCases: [stack],
});
