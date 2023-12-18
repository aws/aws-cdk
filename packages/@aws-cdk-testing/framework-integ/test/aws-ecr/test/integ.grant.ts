import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({ maxImageCount: 5 });
repo.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['ecr:GetDownloadUrlForLayer'],
  principals: [new iam.AnyPrincipal()],
}));

const user = new iam.User(stack, 'MyUser');
repo.grantPush(user);
repo.grantPull(user);

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

new IntegTest(app, 'cdk-ecr-integ-test-grant', {
  testCases: [stack],
});
