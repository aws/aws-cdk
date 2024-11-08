import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CustomResource, Duration } from 'aws-cdk-lib';

const TAG_NAME = 'testTag';
// the digest of the Image https://hub.docker.com/layers/amazon/aws-lambda-python/3.8.2024.10.15.11/images/sha256-0690b41474a8ebfc84649594473b5956a548290dddc9b1accc4a305517779906?context=explore
const IMAGE_DIGEST = 'sha256:0690b41474a8ebfc84649594473b5956a548290dddc9b1accc4a305517779906';

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

    const handler = new lambda.Function(this, 'CustomResourceHandler', {
      code: lambda.Code.fromAsset('./ecr-deployer-code'),
      runtime: new lambda.Runtime('provided.al2023', lambda.RuntimeFamily.OTHER),
      handler: 'bootstrap',
      timeout: Duration.minutes(15),
    });

    const handlerRole = handler.role;

    handlerRole?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:GetRepositoryPolicy',
          'ecr:DescribeRepositories',
          'ecr:ListImages',
          'ecr:DescribeImages',
          'ecr:BatchGetImage',
          'ecr:ListTagsForResource',
          'ecr:DescribeImageScanFindings',
          'ecr:InitiateLayerUpload',
          'ecr:UploadLayerPart',
          'ecr:CompleteLayerUpload',
          'ecr:PutImage',
        ],
        resources: ['*'],
      }));
    handlerRole?.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['*'],
    }));

    const imageDeploy = new CustomResource(this, 'CustomResource', {
      serviceToken: handler.functionArn,
      resourceType: 'Custom::CDKBucketDeployment',
      properties: {
        SrcImage: 'docker://amazon/aws-lambda-python:3.8.2024.10.15.11',
        DestImage: `docker://${ecrRepository.repositoryUriForTag(imageTag.valueAsString)}`,
      },
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
