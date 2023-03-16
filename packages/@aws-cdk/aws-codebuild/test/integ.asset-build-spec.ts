import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import * as codebuild from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CodeBuildAssetBuildSpecStack');

// Create a codebuild project using a local asset as the buildspec file
const buildSpec = codebuild.BuildSpec.fromAsset(path.resolve(__dirname, 'build-spec-asset.yml'));
const project = new codebuild.Project(stack, 'MyProject', {
  buildSpec,
});

const integ = new IntegTest(app, 'AssetBuildSpecTest', { testCases: [stack] });

const getBuildProject = integ.assertions.awsApiCall('CodeBuild', 'batchGetProjects', {
  names: [project.projectName],
});

getBuildProject.assertAtPath(
  'projects.0.name.buildspec',
  ExpectedResult.exact(project.projectName),
);

getBuildProject.assertAtPath(
  'projects.0.source.buildspec',
  ExpectedResult.stringLikeRegexp('.+'),
);


const getBuildProjectBuildSpecArn = getBuildProject.getAttString('projects.0.source.buildspec');

// Assert that the buildspec for the project is in fact an S3 object arn
// by parsing it and calling `getObject`.
const { resource, resourceName } = cdk.Arn.parse(getBuildProjectBuildSpecArn);
integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: resource,
  Key: resourceName,
});

// Kick off a build
const startBuild = integ.assertions.awsApiCall('CodeBuild', 'startBuild', {
  projectName: project.projectName,
});

// Describe the build and wait for the status to be successful
integ.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
  ids: [startBuild.getAttString('build.id')],
}).assertAtPath(
  'builds.0.buildStatus',
  ExpectedResult.stringLikeRegexp('SUCCEEDED'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(30),
});
