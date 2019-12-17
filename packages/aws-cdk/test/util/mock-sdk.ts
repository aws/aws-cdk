import * as AWS from 'aws-sdk';
import * as sinon from 'sinon';
import { SDK } from "../../lib/api/util/sdk";

/**
 * An SDK that allows replacing (some of) the clients
 *
 * Its the responsibility of the consumer to replace all calls that
 * actually will be called.
 */
export class MockSDK extends SDK {
  private readonly sandbox: sinon.SinonSandbox;
  constructor() {
    super();
    this.sandbox = sinon.createSandbox();
  }

  /**
   * Replace the CloudFormation client with the given object
   */
  public stubCloudFormation(stubs: SyncHandlerSubsetOf<AWS.CloudFormation>) {
    this.sandbox.stub(this, 'cloudFormation').returns(Promise.resolve(partialAwsService<AWS.CloudFormation>(stubs)));
  }

  /**
   * Replace the ECR client with the given object
   */
  public stubEcr(stubs: SyncHandlerSubsetOf<AWS.ECR>) {
    this.sandbox.stub(this, 'ecr').returns(Promise.resolve(partialAwsService<AWS.ECR>(stubs)));
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
function partialAwsService<S>(fns: SyncHandlerSubsetOf<S>): S {
  // Super unsafe in here because I don't know how to make TypeScript happy,
  // but at least the outer types make sure everything that happens in here works out.
  const ret: any = {};

  for (const [key, handler] of Object.entries(fns)) {
    ret[key] = (args: any) => new FakeAWSResponse((handler as any)(args));
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
    } ? [INPUT, OUTPUT] : never;

// Determine the type of the mock handler from the type of the Input/Output type pair.
// Don't need to worry about the 'never', TypeScript will propagate it upwards making it
// impossible to specify the field that has 'never' anywhere in its type.
type MockHandlerType<AI extends [any, any]> = (input: AI[0]) => AI[1];

// Any subset of the full type that synchronously returns the output structure is okay
type SyncHandlerSubsetOf<S> = {[K in keyof S]?: MockHandlerType<AwsCallInputOutput<S[K]>>};

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
