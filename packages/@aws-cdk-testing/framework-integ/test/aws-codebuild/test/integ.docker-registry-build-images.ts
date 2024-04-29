import * as integ from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

const app = new cdk.App();

/*
 * Deployment nstructions:
 * 1. (Register and) log in to your Docker Hub account,
 *  and generate a "Public Repo Read-only" Personal Access Token
 *  - https://hub.docker.com/settings/security?generateToken=true
 * 2. Update the `DOCKER_HUB_CREDENTIQLS` with your Docker Hub username and token
 *  - DO NOT USE YOUR ACCOUNT PASSWORD, USE THE GENERATED TOKEN
 * 3. Run the integration test
 * 4. After the test is complete, invalidate the Personal Access Token you've just created
 *  - https://hub.docker.com/settings/security?generateToken=true
 */

// https://hub.docker.com/settings/security?generateToken=true
// Personal "Public Repo Read-only" token from Docker Hub.
// The token was invalidated after snapshot creation
const DOCKER_HUB_CREDENTIALS = JSON.stringify({
  username: 'nmussy',

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // DO NOT USE YOUR ACCOUNT PASSWORD, USE A GENERATED PERSONAL ACCESS TOKEN
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  password: // PASSWORD SHOULD NOT BE YOUR ACTUAL PASSWORD
    'dckr_pat_I4j7TDEb_X92cW0MGB3FVZ_AlYc',
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // DO NOT USE YOUR ACCOUNT PASSWORD, USE A GENERATED PERSONAL ACCESS TOKEN
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});

assert(
  JSON.parse(DOCKER_HUB_CREDENTIALS).password.startsWith('dckr_pat_'),
  'Read the instructions, do not use your account password',
);

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
      // For some reason, the aarch64 version alpine fails the DOWNLOAD_SOURCE phase?
      // > Runtime error (*fs.PathError: fork/exec /bin/bash: no such file or directory)
      codebuild.LinuxArmBuildImage.fromDockerRegistry('ubuntu', {
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
        // 'mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019',
        // https://docs.aws.amazon.com/codebuild/latest/userguide/sample-windows.html
        // 'mcr.microsoft.com/dotnet/framework/sdk:4.8',
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
  secretStringValue: cdk.SecretValue.unsafePlainText(DOCKER_HUB_CREDENTIALS),
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

for (const { project: { projectName } } of testCases) {
  const startBuild = test.assertions.awsApiCall('CodeBuild', 'startBuild', {
    projectName,
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
