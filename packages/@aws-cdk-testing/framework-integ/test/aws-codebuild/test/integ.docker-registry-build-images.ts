import * as integ from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

const app = new cdk.App();

const BuildImageTestCases = {
  LinuxBuildImage: {
    computeType: codebuild.ComputeType.SMALL,
    generateBuildImage: (secretsManagerCredentials: secretsmanager.ISecret) =>
      codebuild.LinuxBuildImage.fromDockerRegistry('alpine', {
        secretsManagerCredentials,
      }),
  },
  LinuxArmBuildImage: {
    computeType: codebuild.ComputeType.SMALL,
    generateBuildImage: (secretsManagerCredentials: secretsmanager.ISecret) =>
      codebuild.LinuxArmBuildImage.fromDockerRegistry('alpine', {
        secretsManagerCredentials,
      }),
  },
  // FIXME remove LinuxArmLambdaBuildImage.fromDockerRegistry
  // LinuxLambdaBuildImage: { computeType: codebuild.ComputeType.LAMBDA_1GB },
  // LinuxArmLambdaBuildImage: { computeType: codebuild.ComputeType.LAMBDA_1GB },
  WindowsBuildImage: {
    computeType: codebuild.ComputeType.MEDIUM,
    generateBuildImage: (secretsManagerCredentials: secretsmanager.ISecret) =>
      codebuild.WindowsBuildImage.fromDockerRegistry(
        'mcr.microsoft.com/windows/servercore:ltsc2019',
        { secretsManagerCredentials },
        codebuild.WindowsImageType.SERVER_2019,
      ),
  },
};
const buildImageClassNames = Object.keys(
  BuildImageTestCases,
) as (keyof typeof BuildImageTestCases)[];

interface DockerRegistryBuildImageTestStackProps extends cdk.StackProps {
  buildImageClassName: keyof typeof BuildImageTestCases;
  completeSecretArn: string;
  computeType: codebuild.ComputeType;
}

const secretStack = new cdk.Stack(app, 'SecretStack');
const { secretFullArn } = new secretsmanager.Secret(secretStack, 'MySecret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-auth'),
});
assert(secretFullArn, 'secretFullArn is required');

class DockerRegistryBuildImageTestStack extends cdk.Stack {
  public readonly project: codebuild.Project;
  constructor(
    scope: Construct,
    id: string,
    props: DockerRegistryBuildImageTestStackProps,
  ) {
    super(scope, id, props);

    const { generateBuildImage } = BuildImageTestCases[props.buildImageClassName];

    const secret = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      'MySecret',
      props.completeSecretArn,
    );

    this.project = new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: { commands: ['echo "Nothing to do!"'] },
        },
      }),
      environment: {
        computeType: props.computeType,
        buildImage: generateBuildImage(secret),
      },
    });
  }
}

const testCases: DockerRegistryBuildImageTestStack[] = [];
for (const buildImageClassName of buildImageClassNames) {
  testCases.push(
    new DockerRegistryBuildImageTestStack(
      app,
      `docker-registry-build-test-${buildImageClassName}`,
      {
        buildImageClassName,
        completeSecretArn: secretFullArn,
        computeType: BuildImageTestCases[buildImageClassName].computeType,
      },
    ),
  );
}

const test = new integ.IntegTest(
  app,
  'DockerRegistryBuildImagesIntegTest',
  { testCases },
);

// FIXME remove slice
for (const { project } of testCases.slice(0, 1)) {
  const startBuild = test.assertions.awsApiCall('CodeBuild', 'startBuild', {
    projectName: project.projectName,
  });

  // Describe the build and wait for the status to be successful
  test.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
    ids: [startBuild.getAttString('build.id')],
  }).assertAtPath(
    'builds.0.buildStatus',
    integ.ExpectedResult.stringLikeRegexp('SUCCEEDED'),
  ).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(30),
  });
}

app.synth();
