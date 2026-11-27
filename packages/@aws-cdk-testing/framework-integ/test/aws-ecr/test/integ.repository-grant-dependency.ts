import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';

/*
 * A grant that adds a statement to a repository policy can be used as a dependency.
 * The topic is also the target of a rule on the repository, and depending on the grant
 * must not create a circular dependency with that rule.
 */

const app = new App();
const stack = new Stack(app, 'aws-cdk-ecr-repository-grant-dependency');

const repo = new ecr.Repository(stack, 'Repo', {
  removalPolicy: RemovalPolicy.DESTROY,
  emptyOnDelete: true,
});

const topic = new sns.Topic(stack, 'Topic');
repo.onImageScanCompleted('ScanCompleted', { target: new targets.SnsTopic(topic) });
repo.grantPull(new iam.ServicePrincipal('lambda.amazonaws.com')).applyBefore(topic);

const integ = new IntegTest(app, 'RepositoryGrantDependencyIntegTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('ECR', 'getRepositoryPolicy', { repositoryName: repo.repositoryName })
  .expect(ExpectedResult.objectLike({
    policyText: Match.serializedJson(Match.objectLike({
      Statement: Match.arrayWith([Match.objectLike({ Principal: { Service: 'lambda.amazonaws.com' } })]),
    })),
  }));
