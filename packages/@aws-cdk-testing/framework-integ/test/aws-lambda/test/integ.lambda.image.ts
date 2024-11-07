import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecrDeploy from 'cdk-ecr-deployment';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const TAG_NAME = 'testTag';
// the digest of the Image https://hub.docker.com/layers/amazon/aws-lambda-python/3.12.2024.11.06.18/images/sha256-55d873154f78cd9a13487c9539ff380f396b887f4a815d84fd698ed872c74749?context=explore
const IMAGE_DIGEST = 'sha256:55d873154f78cd9a13487c9539ff380f396b887f4a815d84fd698ed872c74749';

class TestLambdaFunctionWithRepoImageUsingCfnParameter extends cdk.Stack {
  public funcWithDigestCfnParam: lambda.DockerImageFunction;
  public funcWithDigestConst: lambda.DockerImageFunction;
  public funcWithTagCfnParam: lambda.DockerImageFunction;
  public funcWithTagConst: lambda.DockerImageFunction;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const imageTag = new cdk.CfnParameter(this, 'ImageTag', {
      default: TAG_NAME,
    });

    const imageDigest = new cdk.CfnParameter(this, 'ImageDigest', {
      default: IMAGE_DIGEST,
    });

    const ecrRepository = new ecr.Repository(this, 'MyRepo');

    const imageDeploy = new ecrDeploy.ECRDeployment(this, 'DeployDockerImage2', {
      src: new ecrDeploy.DockerImageName('amazon/aws-lambda-python:3.12.2024.11.06.18'),
      dest: new ecrDeploy.DockerImageName(ecrRepository.repositoryUriForTag(imageTag.valueAsString)),
    });

    this.funcWithDigestCfnParam = new lambda.DockerImageFunction(this, 'ImageLambdaDigest', {
      functionName: 'ImageLambdaDigestCfnParam',
      code: lambda.DockerImageCode.fromEcr(
        ecrRepository, {
          tagOrDigest: imageDigest.valueAsString,
        },
      ),
    });

    this.funcWithDigestCfnParam.node.addDependency(imageDeploy);

    this.funcWithDigestConst = new lambda.DockerImageFunction(this, 'ImageLambdaDigestConst', {
      functionName: 'ImageLambdaDigestConst',
      code: lambda.DockerImageCode.fromEcr(
        ecrRepository, {
          tagOrDigest: IMAGE_DIGEST,
        },
      ),
    });

    this.funcWithDigestConst.node.addDependency(imageDeploy);

    this.funcWithTagCfnParam = new lambda.DockerImageFunction(this, 'ImageLambdaTag', {
      functionName: 'ImageLambdaTagCfnParam',
      code: lambda.DockerImageCode.fromEcr(
        ecrRepository, {
          tagOrDigest: imageTag.valueAsString,
        },
      ),
    });

    this.funcWithTagCfnParam.node.addDependency(imageDeploy);

    this.funcWithTagConst = new lambda.DockerImageFunction(this, 'ImageLambdaTagConst', {
      functionName: 'ImageLambdaTagConst',
      code: lambda.DockerImageCode.fromEcr(
        ecrRepository, {
          tagOrDigest: TAG_NAME,
        },
      ),
    });

    this.funcWithTagConst.node.addDependency(imageDeploy);
  }
}

const app = new cdk.App();

const testingStack = new TestLambdaFunctionWithRepoImageUsingCfnParameter(app, 'aws-cdk-lambda-image');

const assertionStack = new cdk.Stack(app, 'LambdaFunctionWithRepoImageUsingCfnParameterAssertionStack');

const test = new IntegTest(app, 'LambdaFunctionWithRepoImageUsingCfnParameterTesting', {
  testCases: [testingStack],
  assertionStack: assertionStack,
});

test.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: testingStack.funcWithDigestCfnParam.functionName,
}).assertAtPath(
  'Code.ImageUri',
  ExpectedResult.stringLikeRegexp(`.+@${IMAGE_DIGEST}`),
);

test.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: testingStack.funcWithDigestConst.functionName,
}).assertAtPath(
  'Code.ImageUri',
  ExpectedResult.stringLikeRegexp(`.+@${IMAGE_DIGEST}`),
);

test.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: testingStack.funcWithTagCfnParam.functionName,
}).assertAtPath(
  'Code.ImageUri',
  ExpectedResult.stringLikeRegexp(`.+:${TAG_NAME}`),
);

test.assertions.awsApiCall('Lambda', 'GetFunction', {
  FunctionName: testingStack.funcWithTagConst.functionName,
}).assertAtPath(
  'Code.ImageUri',
  ExpectedResult.stringLikeRegexp(`.+:${TAG_NAME}`),
);

app.synth();
