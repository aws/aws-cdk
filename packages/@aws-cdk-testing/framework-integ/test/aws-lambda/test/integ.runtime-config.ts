import { App, ArnFormat, Aws, CfnResource, CliCredentialsStackSynthesizer, Fn, Stack, Token } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnFunction, Code, Function, mixins, Runtime, RuntimeFamily } from 'aws-cdk-lib/aws-lambda';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as path from 'path';

// Customer-managed runtime (CMR): the `custom` runtime + the FunctionRuntimeConfig mixin,
// applied to a Function and to a CfnFunction.
//
// The test publishes its own runtime (image, runtime, version and alias), so it needs
// nothing pre-created in the account.
//
// The runtime image goes to a repository the test creates before deploying (see the
// hooks below) and deletes afterwards. The bootstrap container assets repository only
// lets Lambda pull images for functions, and the repository has to exist before the
// deployment because integ-runner builds and checks image assets before it deploys
// any stack.

const CUSTOM = new Runtime('custom', RuntimeFamily.OTHER);
const HANDLER_PATH = path.join(__dirname, 'my-lambda-handler');
const RUNTIME_NAME_PREFIX = 'cdk-integ';
const RUNTIME_IMAGE_REPOSITORY_NAME = 'cdk-integ-lambda-runtime-config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-config', {
  // The bootstrap image publishing role can only push to the bootstrap repository,
  // so the image is pushed with the CLI credentials.
  synthesizer: new CliCredentialsStackSynthesizer({
    imageAssetsRepositoryName: RUNTIME_IMAGE_REPOSITORY_NAME,
  }),
});

const runtimeImage = new DockerImageAsset(stack, 'RuntimeImage', {
  directory: path.join(__dirname, 'custom-runtime-image'),
  platform: Platform.LINUX_AMD64,
});

// Lambda pulls the image when it creates a runtime version.
const runtimeImageRepository = ecr.Repository.fromRepositoryName(stack, 'RuntimeImageRepository', RUNTIME_IMAGE_REPOSITORY_NAME);
const runtimeImagePullPolicy = new iam.PolicyDocument({
  statements: [new iam.PolicyStatement({
    principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    actions: ['ecr:BatchGetImage', 'ecr:GetDownloadUrlForLayer'],
    conditions: {
      StringEquals: { 'aws:SourceAccount': stack.account },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({
          service: 'lambda',
          resource: 'runtime',
          resourceName: `${RUNTIME_NAME_PREFIX}-*`,
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        }),
      },
    },
  })],
});
const allowRuntimeImagePull = new cr.AwsCustomResource(stack, 'AllowRuntimeImagePull', {
  onCreate: {
    service: 'ECR',
    action: 'setRepositoryPolicy',
    parameters: {
      repositoryName: RUNTIME_IMAGE_REPOSITORY_NAME,
      policyText: stack.toJsonString(runtimeImagePullPolicy),
    },
    physicalResourceId: cr.PhysicalResourceId.of(RUNTIME_IMAGE_REPOSITORY_NAME),
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: [runtimeImageRepository.repositoryArn] }),
  installLatestAwsSdk: false,
});

// The runtime resources are declared with CfnResource because the AWS::Lambda::Runtime*
// types are not yet in the CloudFormation spec that CDK's L1s are generated from.
//
// A deleted runtime keeps its name for 30 days, so each deployment uses a new name.
const runtimeName = Fn.join('-', [RUNTIME_NAME_PREFIX, Fn.select(2, Fn.split('/', Aws.STACK_ID))]);
const runtime = new CfnResource(stack, 'Runtime', {
  type: 'AWS::Lambda::Runtime',
  properties: { Name: runtimeName },
});

// The version and alias refer to the runtime by name, so the dependencies are explicit.
const runtimeVersion = new CfnResource(stack, 'RuntimeVersion', {
  type: 'AWS::Lambda::RuntimeVersion',
  properties: { RuntimeName: runtimeName, Name: 'v1', ImageUri: runtimeImage.imageUri },
});
runtimeVersion.addResourceDependency(runtime);
runtimeVersion.node.addDependency(allowRuntimeImagePull);

const runtimeAlias = new CfnResource(stack, 'RuntimeAlias', {
  type: 'AWS::Lambda::RuntimeAlias',
  properties: { RuntimeName: runtimeName, Name: 'live', RuntimeVersion: 'v1' },
});
runtimeAlias.addResourceDependency(runtimeVersion);

const runtimeConfig = new mixins.FunctionRuntimeConfig({
  runtimeArn: Token.asString(runtime.getAtt('Arn')),
  runtimeAlias: 'live',
});

const fn = new Function(stack, 'CustomRuntimeFunction', {
  // The custom runtime does not support inline code; use an asset.
  code: Code.fromAsset(HANDLER_PATH),
  handler: 'index.main',
  runtime: CUSTOM,
});
fn.with(runtimeConfig);
fn.node.addDependency(runtimeAlias);

const cfnFunctionRole = new iam.Role(stack, 'CfnCustomRuntimeFunctionRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
const cfnFunctionCode = new Asset(stack, 'CfnCustomRuntimeFunctionCode', { path: HANDLER_PATH });
const cfnFunction = new CfnFunction(stack, 'CfnCustomRuntimeFunction', {
  code: { s3Bucket: cfnFunctionCode.s3BucketName, s3Key: cfnFunctionCode.s3ObjectKey },
  handler: 'index.main',
  role: cfnFunctionRole.roleArn,
  runtime: 'custom',
});
cfnFunction.with(runtimeConfig);
cfnFunction.addResourceDependency(runtimeAlias);

const integTest = new integ.IntegTest(app, 'lambda-runtime-config', {
  testCases: [stack],
  // Regions where CloudFormation supports both RuntimeConfig and the AWS::Lambda::Runtime* types.
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  // Create the runtime image repository before the test and delete it after.
  hooks: {
    preDeploy: [`aws ecr create-repository --repository-name ${RUNTIME_IMAGE_REPOSITORY_NAME}`],
    postDestroy: [`aws ecr delete-repository --repository-name ${RUNTIME_IMAGE_REPOSITORY_NAME} --force`],
  },
});

for (const functionName of [fn.functionName, cfnFunction.ref]) {
  // The service resolves the alias to the runtime version the stack published.
  integTest.assertions.awsApiCall('Lambda', 'getFunctionConfiguration', {
    FunctionName: functionName,
  }).expect(integ.ExpectedResult.objectLike({
    Runtime: 'custom',
    RuntimeVersionConfig: {
      RuntimeVersionArn: Token.asString(runtimeVersion.getAtt('Arn')),
    },
  }));

  // The function runs on the customer-managed runtime.
  integTest.assertions.invokeFunction({ functionName }).expect(integ.ExpectedResult.objectLike({
    Payload: integ.Match.stringLikeRegexp('Hello, world!'),
  }));
}

app.synth();
