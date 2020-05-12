import * as AWS from 'aws-sdk';
import { log } from './cdk-helpers';

interface Env {
  account: string;
  region: string;
}

export let testEnv = async (): Promise<Env> => {
  const response = await new AWS.STS().getCallerIdentity().promise();

  const ret: Env = {
    account: response.Account!,
    region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
  };

  testEnv = () => Promise.resolve(ret);
  return ret;
};

export const cloudFormation = makeAwsCaller(AWS.CloudFormation);
export const s3 = makeAwsCaller(AWS.S3);
export const sns = makeAwsCaller(AWS.SNS);
export const iam = makeAwsCaller(AWS.IAM);
export const lambda = makeAwsCaller(AWS.Lambda);
export const sts = makeAwsCaller(AWS.STS);

/**
 * Perform an AWS call from nothing
 *
 * Create the correct client, do the call and resole the promise().
 */
async function awsCall<
  A extends AWS.Service,
  B extends keyof ServiceCalls<A>,
>(ctor: new (config: any) => A, call: B, request: First<ServiceCalls<A>[B]>): Promise<Second<ServiceCalls<A>[B]>> {
  const env = await testEnv();
  const cfn = new ctor({ region: env.region });
  const response = cfn[call](request);
  try {
    return await response.promise();
  } catch (e) {
    const newErr = new Error(`${call}(${JSON.stringify(request)}): ${e.message}`);
    (newErr as any).code = e.code;
    throw newErr;
  }
}

/**
 * Factory function to invoke 'awsCall' for specific services.
 *
 * Not strictly necessary but calling this replaces a whole bunch of annoying generics you otherwise have to type:
 *
 * ```ts
 * export function cloudFormation<
 *   C extends keyof ServiceCalls<AWS.CloudFormation>,
 * >(call: C, request: First<ServiceCalls<AWS.CloudFormation>[C]>): Promise<Second<ServiceCalls<AWS.CloudFormation>[C]>> {
 *   return awsCall(AWS.CloudFormation, call, request);
 * }
 * ```
 */
function makeAwsCaller<A extends AWS.Service>(ctor: new (config: any) => A) {
  return <B extends keyof ServiceCalls<A>>(call: B, request: First<ServiceCalls<A>[B]>): Promise<Second<ServiceCalls<A>[B]>> => {
    return awsCall(ctor, call, request);
  };
}

type ServiceCalls<T> = NoNayNever<SimplifiedService<T>>;
// Map ever member in the type to the important AWS call overload, or to 'never'
type SimplifiedService<T> = {[k in keyof T]: AwsCallIO<T[k]>};
// Remove all 'never' types from an object type
type NoNayNever<T> = Pick<T, {[k in keyof T]: T[k] extends never ? never : k }[keyof T]>;

// Because of the overloads an AWS handler type looks like this:
//
//   {
//      (params: INPUTSTRUCT, callback?: ((err: AWSError, data: {}) => void) | undefined): Request<OUTPUT, ...>;
//      (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<...>;
//   }
//
// Get the first overload and extract the input and output struct types
type AwsCallIO<T> =
  T extends {
    (args: infer INPUT, callback?: ((err: AWS.AWSError, data: any) => void) | undefined): AWS.Request<infer OUTPUT, AWS.AWSError>;
    (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<any, any>;
  } ? [INPUT, OUTPUT] : never;

type First<T> = T extends [any, any] ? T[0] : never;
type Second<T> = T extends [any, any] ? T[1] : never;

export async function deleteStacks(...stackNames: string[]) {
  if (stackNames.length === 0) { return; }

  for (const stackName of stackNames) {
    await cloudFormation('deleteStack', {
      StackName: stackName,
    });
  }

  await retry(`Deleting ${stackNames}`, afterSeconds(300), async () => {
    for (const stackName of stackNames) {
      if (await stackExists(stackName)) {
        throw new Error(`Delete of '${stackName}' not complete yet`);
      }
    }
  });
}

export async function stackExists(stackName: string) {
  try {
    await cloudFormation('describeStacks', { StackName: stackName });
    return true;
  } catch (e) {
    if (e.message.indexOf('does not exist') > -1) { return false; }
    throw e;
  }
}

export function afterSeconds(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

export async function retry<A>(operation: string, deadline: Date, block: () => Promise<A>): Promise<A> {
  let i = 0;
  log(`💈 ${operation}`);
  while (true) {
    try {
      i++;
      const ret = await block();
      log(`💈 ${operation}: succeeded after ${i} attempts`);
      return ret;
    } catch (e) {
      if (Date.now() > deadline.getTime()) {
        throw new Error(`${operation}: did not succeed after ${i} attempts: ${e}`);
      }
      log(`⏳ ${operation} (${e.message})`);
      await sleep(5000);
    }
  }
}

export async function sleep(ms: number) {
  return new Promise(ok => setTimeout(ok, ms));
}