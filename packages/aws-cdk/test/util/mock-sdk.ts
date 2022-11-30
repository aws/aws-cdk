import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Account, ISDK, SDK, SdkProvider, SdkForEnvironment } from '../../lib/api/aws-auth';
import { Mode } from '../../lib/api/aws-auth/credentials';
import { ToolkitInfo } from '../../lib/api/toolkit-info';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';

const FAKE_CREDENTIALS = new AWS.Credentials({ accessKeyId: 'ACCESS', secretAccessKey: 'SECRET', sessionToken: 'TOKEN ' });

const FAKE_CREDENTIAL_CHAIN = new AWS.CredentialProviderChain([
  () => FAKE_CREDENTIALS,
]);

export interface MockSdkProviderOptions {
  /**
   * Whether the mock provider should produce a real SDK
   *
   * Some tests require a real SDK because they use `AWS-mock` to replace
   * the underlying calls. Other tests do their work completely using jest-mocks.
   *
   * @default true
   */
  readonly realSdk?: boolean;
}

/**
 * An SDK that allows replacing (some of) the clients
 *
 * It's the responsibility of the consumer to replace all calls that
 * actually will be called.
 */
export class MockSdkProvider extends SdkProvider {
  public readonly sdk: ISDK;
  private readonly _mockSdk?: MockSdk;

  constructor(options: MockSdkProviderOptions = {}) {
    super(FAKE_CREDENTIAL_CHAIN, 'bermuda-triangle-1337', { customUserAgent: 'aws-cdk/jest' });

    // SDK contains a real SDK, since some test use 'AWS-mock' to replace the underlying
    // AWS calls which a real SDK would do, and some tests use the 'stub' functionality below.
    if (options.realSdk ?? true) {
      this.sdk = new SDK(FAKE_CREDENTIALS, this.defaultRegion, { customUserAgent: 'aws-cdk/jest' });
    } else {
      this.sdk = this._mockSdk = new MockSdk();
    }
  }

  public get mockSdk(): MockSdk {
    if (!this._mockSdk) {
      throw new Error('MockSdkProvider was not created with \'realSdk: false\'');
    }
    return this._mockSdk;
  }

  async baseCredentialsPartition(_environment: cxapi.Environment, _mode: Mode): Promise<string | undefined> {
    return undefined;
  }

  public defaultAccount(): Promise<Account | undefined> {
    return Promise.resolve({ accountId: '123456789012', partition: 'aws' });
  }

  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: this.sdk, didAssumeRole: true });
  }

  /**
   * Replace the CloudFormation client with the given object
   */
  public stubCloudFormation(stubs: SyncHandlerSubsetOf<AWS.CloudFormation>) {
    (this.sdk as any).cloudFormation = jest.fn().mockReturnValue(partialAwsService<AWS.CloudFormation>(stubs));
  }

  /**
   * Replace the ECR client with the given object
   */
  public stubEcr(stubs: SyncHandlerSubsetOf<AWS.ECR>) {
    (this.sdk as any).ecr = jest.fn().mockReturnValue(partialAwsService<AWS.ECR>(stubs));
  }

  public stubEcs(stubs: SyncHandlerSubsetOf<AWS.ECS>, additionalProperties: { [key: string]: any } = {}) {
    (this.sdk as any).ecs = jest.fn().mockReturnValue(partialAwsService<AWS.ECS>(stubs, additionalProperties));
  }

  /**
   * Replace the S3 client with the given object
   */
  public stubS3(stubs: SyncHandlerSubsetOf<AWS.S3>) {
    (this.sdk as any).s3 = jest.fn().mockReturnValue(partialAwsService<AWS.S3>(stubs));
  }

  /**
   * Replace the STS client with the given object
   */
  public stubSTS(stubs: SyncHandlerSubsetOf<AWS.STS>) {
    (this.sdk as any).sts = jest.fn().mockReturnValue(partialAwsService<AWS.STS>(stubs));
  }

  /**
   * Replace the ELBv2 client with the given object
   */
  public stubELBv2(stubs: SyncHandlerSubsetOf<AWS.ELBv2>) {
    (this.sdk as any).elbv2 = jest.fn().mockReturnValue(partialAwsService<AWS.ELBv2>(stubs));
  }

  /**
   * Replace the SSM client with the given object
   */
  public stubSSM(stubs: SyncHandlerSubsetOf<AWS.SSM>) {
    (this.sdk as any).ssm = jest.fn().mockReturnValue(partialAwsService<AWS.SSM>(stubs));
  }

  public stubLambda(stubs: SyncHandlerSubsetOf<AWS.Lambda>, additionalProperties: { [key: string]: any } = {}) {
    (this.sdk as any).lambda = jest.fn().mockReturnValue(partialAwsService<AWS.Lambda>(stubs, additionalProperties));
  }

  public stubIam(stubs: SyncHandlerSubsetOf<AWS.IAM>, additionalProperties: { [key: string]: any } = {}) {
    (this.sdk as any).iam = jest.fn().mockReturnValue(partialAwsService<AWS.IAM>(stubs, additionalProperties));
  }

  public stubStepFunctions(stubs: SyncHandlerSubsetOf<AWS.StepFunctions>) {
    (this.sdk as any).stepFunctions = jest.fn().mockReturnValue(partialAwsService<AWS.StepFunctions>(stubs));
  }

  public stubCodeBuild(stubs: SyncHandlerSubsetOf<AWS.CodeBuild>) {
    (this.sdk as any).codeBuild = jest.fn().mockReturnValue(partialAwsService<AWS.CodeBuild>(stubs));
  }

  public stubCloudWatchLogs(stubs: SyncHandlerSubsetOf<AWS.CloudWatchLogs>) {
    (this.sdk as any).cloudWatchLogs = jest.fn().mockReturnValue(partialAwsService<AWS.CloudWatchLogs>(stubs));
  }

  public stubAppSync(stubs: SyncHandlerSubsetOf<AWS.AppSync>) {
    (this.sdk as any).appsync = jest.fn().mockReturnValue(partialAwsService<AWS.AppSync>(stubs));
  }

  public stubGetEndpointSuffix(stub: () => string) {
    this.sdk.getEndpointSuffix = stub;
  }
}

export class MockSdk implements ISDK {
  public readonly currentRegion: string = 'bermuda-triangle-1337';
  public readonly lambda = jest.fn();
  public readonly iam = jest.fn();
  public readonly cloudFormation = jest.fn();
  public readonly ec2 = jest.fn();
  public readonly ssm = jest.fn();
  public readonly s3 = jest.fn();
  public readonly route53 = jest.fn();
  public readonly ecr = jest.fn();
  public readonly ecs = jest.fn();
  public readonly elbv2 = jest.fn();
  public readonly secretsManager = jest.fn();
  public readonly kms = jest.fn();
  public readonly stepFunctions = jest.fn();
  public readonly codeBuild = jest.fn();
  public readonly cloudWatchLogs = jest.fn();
  public readonly appsync = jest.fn();
  public readonly getEndpointSuffix = jest.fn();
  public readonly appendCustomUserAgent = jest.fn();
  public readonly removeCustomUserAgent = jest.fn();

  public currentAccount(): Promise<Account> {
    return Promise.resolve({ accountId: '123456789012', partition: 'aws' });
  }

  /**
   * Replace the CloudFormation client with the given object
   */
  public stubCloudFormation(stubs: SyncHandlerSubsetOf<AWS.CloudFormation>) {
    this.cloudFormation.mockReturnValue(partialAwsService<AWS.CloudFormation>(stubs));
  }

  /**
   * Replace the CloudWatch client with the given object
   */
  public stubCloudWatchLogs(stubs: SyncHandlerSubsetOf<AWS.CloudWatchLogs>) {
    this.cloudWatchLogs.mockReturnValue(partialAwsService<AWS.CloudWatchLogs>(stubs));
  }

  /**
   * Replace the AppSync client with the given object
   */
  public stubAppSync(stubs: SyncHandlerSubsetOf<AWS.AppSync>) {
    this.appsync.mockReturnValue(partialAwsService<AWS.AppSync>(stubs));
  }

  /**
   * Replace the ECR client with the given object
   */
  public stubEcr(stubs: SyncHandlerSubsetOf<AWS.ECR>) {
    this.ecr.mockReturnValue(partialAwsService<AWS.ECR>(stubs));
  }

  /**
   * Replace the SSM client with the given object
   */
  public stubSsm(stubs: SyncHandlerSubsetOf<AWS.SSM>) {
    this.ssm.mockReturnValue(partialAwsService<AWS.SSM>(stubs));
  }

  /**
   * Replace the getEndpointSuffix client with the given object
   */
  public stubGetEndpointSuffix(stub: () => string) {
    this.getEndpointSuffix.mockReturnValue(stub());
  }
}

/**
 * Wrap synchronous fake handlers so that they sort-of function like a real AWS client
 *
 * For example, turns an object like this:
 *
 * ```ts
 * {
 *   someCall(opts: AWS.Service.SomeCallInput): AWS.Service.SomeCallOutput {
 *     return {...whatever...};
 *   }
 * }
 * ```
 *
 * Into an object that in the type system pretends to be an 'AWS.Service'
 * class (even though it really isn't) and can be called like this:
 *
 * ```ts
 * const service = await sdk.someService(...);
 * const response = await service.someCall(...).promise();
 * ```
 *
 * We only implement the narrow subset of the AWS SDK API that the CDK actually
 * uses, and we cheat on the types to make TypeScript happy on the rest of the API.
 *
 * Most important feature of this class is that it will derive the input and output
 * types of the handlers on the input object from the ACTUAL AWS Service class,
 * so that you don't have to declare them.
 */
function partialAwsService<S>(fns: SyncHandlerSubsetOf<S>, additionalProperties: { [key: string]: any } = {}): S {
  // Super unsafe in here because I don't know how to make TypeScript happy,
  // but at least the outer types make sure everything that happens in here works out.
  const ret: any = {};

  for (const [key, handler] of Object.entries(fns)) {
    ret[key] = (args: any) => new FakeAWSResponse((handler as any)(args));
  }
  for (const [key, value] of Object.entries(additionalProperties)) {
    ret[key] = value;
  }

  return ret;
}

// Because of the overloads an AWS handler type looks like this:
//
//   {
//      (params: INPUTSTRUCT, callback?: ((err: AWSError, data: {}) => void) | undefined): Request<OUTPUT, ...>;
//      (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<...>;
//   }
//
// Get the first overload and extract the input and output struct types
type AwsCallInputOutput<T> =
    T extends {
      (args: infer INPUT, callback?: ((err: AWS.AWSError, data: any) => void) | undefined): AWS.Request<infer OUTPUT, AWS.AWSError>;
      (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<any, any>;
    } ? [INPUT, OUTPUT] : T;

// Determine the type of the mock handler from the type of the Input/Output type pair.
// Don't need to worry about the 'never', TypeScript will propagate it upwards making it
// impossible to specify the field that has 'never' anywhere in its type.
type MockHandlerType<AI> =
    AI extends [any, any] ? (input: AI[0]) => AI[1] : AI;

// Any subset of the full type that synchronously returns the output structure is okay
export type SyncHandlerSubsetOf<S> = {[K in keyof S]?: MockHandlerType<AwsCallInputOutput<S[K]>>};

/**
 * Fake AWS response.
 *
 * We only ever 'await response.promise()' so that's the only thing we implement here.
 */
class FakeAWSResponse<T> {
  constructor(private readonly x: T) {
  }

  public promise(): Promise<T> {
    return Promise.resolve(this.x);
  }
}

export function mockBootstrapStack(sdk: ISDK | undefined, stack?: Partial<AWS.CloudFormation.Stack>) {
  return CloudFormationStack.fromStaticInformation((sdk ?? new MockSdk()).cloudFormation(), 'CDKToolkit', {
    CreationTime: new Date(),
    StackName: 'CDKToolkit',
    StackStatus: 'CREATE_COMPLETE',
    ...stack,
    Outputs: [
      { OutputKey: 'BucketName', OutputValue: 'BUCKET_NAME' },
      { OutputKey: 'BucketDomainName', OutputValue: 'BUCKET_ENDPOINT' },
      { OutputKey: 'BootstrapVersion', OutputValue: '1' },
      ...stack?.Outputs ?? [],
    ],
  });
}

export function mockToolkitInfo(stack?: Partial<AWS.CloudFormation.Stack>) {
  const sdk = new MockSdk();
  return ToolkitInfo.fromStack(mockBootstrapStack(sdk, stack), sdk);
}

export function mockResolvedEnvironment(): cxapi.Environment {
  return {
    account: '123456789',
    region: 'bermuda-triangle-1337',
    name: 'aws://123456789/bermuda-triangle-1337',
  };
}

// Jest helpers

// An object on which all callables are Jest Mocks
export type MockedObject<S extends object> = {[K in keyof S]: MockedFunction<Required<S>[K]>};

// If a function, then a mocked version of it, otherwise just T
type MockedFunction<T> = T extends (...args: any[]) => any
  ? jest.MockInstance<ReturnType<T>, jest.ArgsType<T>>
  : T;
export function errorWithCode(code: string, message: string) {
  const ret = new Error(message);
  (ret as any).code = code;
  return ret;
}
