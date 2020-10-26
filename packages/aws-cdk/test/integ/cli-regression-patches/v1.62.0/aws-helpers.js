"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputFromStack = exports.deleteBucket = exports.deleteImageRepository = exports.emptyBucket = exports.sleep = exports.retry = exports.isBucketMissingError = exports.isStackMissingError = exports.stackStatus = exports.deleteStacks = exports.sts = exports.lambda = exports.iam = exports.sns = exports.ecr = exports.s3 = exports.cloudFormation = exports.testEnv = void 0;
const AWS = require("aws-sdk");
const cdk_helpers_1 = require("./cdk-helpers");

function chainableCredentials(region) {
  const profileName = process.env.AWS_PROFILE;
  if (process.env.CODEBUILD_BUILD_ARN && profileName) {
      // in codebuild we must assume the role that the cdk uses
      // otherwise credentials will just be picked up by the normal sdk
      // heuristics and expire after an hour.
      // can't use '~' since the SDK doesn't seem to expand it...?
      const configPath = `${process.env.HOME}/.aws/config`;
      const ini = new AWS.IniLoader().loadFrom({
          filename: configPath,
          isConfig: true,
      });
      const profile = ini[profileName];
      if (!profile) {
          throw new Error(`Profile '${profileName}' does not exist in config file (${configPath})`);
      }
      const arn = profile.role_arn;
      const externalId = profile.external_id;
      if (!arn) {
          throw new Error(`role_arn does not exist in profile ${profileName}`);
      }
      if (!externalId) {
          throw new Error(`external_id does not exist in profile ${externalId}`);
      }
      return new AWS.ChainableTemporaryCredentials({
          params: {
              RoleArn: arn,
              ExternalId: externalId,
              RoleSessionName: 'integ-tests',
          },
          stsConfig: {
              region,
          },
          masterCredentials: new AWS.ECSCredentials(),
      });
  }
  return undefined;
}

exports.testEnv = async () => {
  var _a, _b;
  const region = (_b = (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : process.env.AWS_DEFAULT_REGION) !== null && _b !== void 0 ? _b : 'us-east-1';
  const sts = new AWS.STS({
      region: region,
      credentials: chainableCredentials(region),
      maxRetries: 8,
      retryDelayOptions: { base: 500 },
  });
  const response = await sts.getCallerIdentity().promise();
  const ret = {
      account: response.Account,
      region,
  };
  exports.testEnv = () => Promise.resolve(ret);
  return ret;
};

exports.cloudFormation = makeAwsCaller(AWS.CloudFormation);
exports.s3 = makeAwsCaller(AWS.S3);
exports.ecr = makeAwsCaller(AWS.ECR);
exports.sns = makeAwsCaller(AWS.SNS);
exports.iam = makeAwsCaller(AWS.IAM);
exports.lambda = makeAwsCaller(AWS.Lambda);
exports.sts = makeAwsCaller(AWS.STS);
/**
 * Perform an AWS call from nothing
 *
 * Create the correct client, do the call and resole the promise().
 */
async function awsCall(ctor, call, request) {
    const env = await exports.testEnv();
    const cfn = new ctor({
        region: env.region,
        credentials: chainableCredentials(env.region),
        maxRetries: 6,
        retryDelayOptions: {
            base: 500,
        },
    });
    const response = cfn[call](request);
    try {
        return await response.promise();
    }
    catch (e) {
        const newErr = new Error(`${call}(${JSON.stringify(request)}): ${e.message}`);
        newErr.code = e.code;
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
function makeAwsCaller(ctor) {
    return (call, request) => {
        return awsCall(ctor, call, request);
    };
}
async function deleteStacks(...stackNames) {
    if (stackNames.length === 0) {
        return;
    }
    for (const stackName of stackNames) {
        await exports.cloudFormation('updateTerminationProtection', {
            EnableTerminationProtection: false,
            StackName: stackName,
        });
        await exports.cloudFormation('deleteStack', {
            StackName: stackName,
        });
    }
    await retry(`Deleting ${stackNames}`, retry.forSeconds(600), async () => {
        for (const stackName of stackNames) {
            const status = await stackStatus(stackName);
            if (status !== undefined && status.endsWith('_FAILED')) {
                throw retry.abort(new Error(`'${stackName}' is in state '${status}'`));
            }
            if (status !== undefined) {
                throw new Error(`Delete of '${stackName}' not complete yet`);
            }
        }
    });
}
exports.deleteStacks = deleteStacks;
async function stackStatus(stackName) {
    var _a;
    try {
        return (_a = (await exports.cloudFormation('describeStacks', { StackName: stackName })).Stacks) === null || _a === void 0 ? void 0 : _a[0].StackStatus;
    }
    catch (e) {
        if (isStackMissingError(e)) {
            return undefined;
        }
        throw e;
    }
}
exports.stackStatus = stackStatus;
function isStackMissingError(e) {
    return e.message.indexOf('does not exist') > -1;
}
exports.isStackMissingError = isStackMissingError;
function isBucketMissingError(e) {
    return e.message.indexOf('does not exist') > -1;
}
exports.isBucketMissingError = isBucketMissingError;
/**
 * Retry an async operation until a deadline is hit.
 *
 * Use `retry.forSeconds()` to construct a deadline relative to right now.
 *
 * Exceptions will cause the operation to retry. Use `retry.abort` to annotate an exception
 * to stop the retry and end in a failure.
 */
async function retry(operation, deadline, block) {
    let i = 0;
    cdk_helpers_1.log(`💈 ${operation}`);
    while (true) {
        try {
            i++;
            const ret = await block();
            cdk_helpers_1.log(`💈 ${operation}: succeeded after ${i} attempts`);
            return ret;
        }
        catch (e) {
            if (e.abort || Date.now() > deadline.getTime()) {
                throw new Error(`${operation}: did not succeed after ${i} attempts: ${e}`);
            }
            cdk_helpers_1.log(`⏳ ${operation} (${e.message})`);
            await sleep(5000);
        }
    }
}
exports.retry = retry;
/**
 * Make a deadline for the `retry` function relative to the current time.
 */
retry.forSeconds = (seconds) => {
    return new Date(Date.now() + seconds * 1000);
};
/**
 * Annotate an error to stop the retrying
 */
retry.abort = (e) => {
    e.abort = true;
    return e;
};
async function sleep(ms) {
    return new Promise(ok => setTimeout(ok, ms));
}
exports.sleep = sleep;
async function emptyBucket(bucketName) {
    const objects = await exports.s3('listObjects', { Bucket: bucketName });
    const deletes = (objects.Contents || []).map(obj => obj.Key || '').filter(d => !!d);
    if (deletes.length === 0) {
        return Promise.resolve();
    }
    return exports.s3('deleteObjects', {
        Bucket: bucketName,
        Delete: {
            Objects: deletes.map(d => ({ Key: d })),
            Quiet: false,
        },
    });
}
exports.emptyBucket = emptyBucket;
async function deleteImageRepository(repositoryName) {
    await exports.ecr('deleteRepository', { repositoryName, force: true });
}
exports.deleteImageRepository = deleteImageRepository;
async function deleteBucket(bucketName) {
    try {
        await emptyBucket(bucketName);
        await exports.s3('deleteBucket', {
            Bucket: bucketName,
        });
    }
    catch (e) {
        if (isBucketMissingError(e)) {
            return;
        }
        throw e;
    }
}
exports.deleteBucket = deleteBucket;
function outputFromStack(key, stack) {
    var _a, _b;
    return (_b = ((_a = stack.Outputs) !== null && _a !== void 0 ? _a : []).find(o => o.OutputKey === key)) === null || _b === void 0 ? void 0 : _b.OutputValue;
}
exports.outputFromStack = outputFromStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsK0NBQW9DO0FBT3pCLFFBQUEsT0FBTyxHQUFHLEtBQUssSUFBa0IsRUFBRTs7SUFDNUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRW5FLE1BQU0sR0FBRyxHQUFRO1FBQ2YsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFRO1FBQzFCLE1BQU0sY0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsbUNBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsbUNBQUksV0FBVztLQUNoRixDQUFDO0lBRUYsZUFBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFVyxRQUFBLGNBQWMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25ELFFBQUEsRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsUUFBQSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixRQUFBLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFFBQUEsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsUUFBQSxNQUFNLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxRQUFBLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FB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Q0QsT0FBTyxVQUFFLENBQUMsZUFBZSxFQUFFO1FBQ3pCLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE1BQU0sRUFBRTtZQUNOLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxLQUFLO1NBQ2I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsa0NBYUM7QUFFTSxLQUFLLFVBQVUscUJBQXFCLENBQUMsY0FBc0I7SUFDaEUsTUFBTSxXQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUZELHNEQUVDO0FBRU0sS0FBSyxVQUFVLFlBQVksQ0FBQyxVQUFrQjtJQUNuRCxJQUFJO1FBQ0YsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUIsTUFBTSxVQUFFLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLE1BQU0sRUFBRSxVQUFVO1NBQ25CLENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBVkQsb0NBVUM7QUFFRCxTQUFnQixlQUFlLENBQUMsR0FBVyxFQUFFLEtBQStCOztJQUMxRSxhQUFPLE9BQUMsS0FBSyxDQUFDLE9BQU8sbUNBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxHQUFHLENBQUMsMENBQUUsV0FBVyxDQUFDO0FBQzNFLENBQUM7QUFGRCwwQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vY2RrLWhlbHBlcnMnO1xuXG5pbnRlcmZhY2UgRW52IHtcbiAgYWNjb3VudDogc3RyaW5nO1xuICByZWdpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGxldCB0ZXN0RW52ID0gYXN5bmMgKCk6IFByb21pc2U8RW52PiA9PiB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbmV3IEFXUy5TVFMoKS5nZXRDYWxsZXJJZGVudGl0eSgpLnByb21pc2UoKTtcblxuICBjb25zdCByZXQ6IEVudiA9IHtcbiAgICBhY2NvdW50OiByZXNwb25zZS5BY2NvdW50ISxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT04gPz8gcHJvY2Vzcy5lbnYuQVdTX0RFRkFVTFRfUkVHSU9OID8/ICd1cy1lYXN0LTEnLFxuICB9O1xuXG4gIHRlc3RFbnYgPSAoKSA9PiBQcm9taXNlLnJlc29sdmUocmV0KTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBjb25zdCBjbG91ZEZvcm1hdGlvbiA9IG1ha2VBd3NDYWxsZXIoQVdTLkNsb3VkRm9ybWF0aW9uKTtcbmV4cG9ydCBjb25zdCBzMyA9IG1ha2VBd3NDYWxsZXIoQVdTLlMzKTtcbmV4cG9ydCBjb25zdCBlY3IgPSBtYWtlQXdzQ2FsbGVyKEFXUy5FQ1IpO1xuZXhwb3J0IGNvbnN0IHNucyA9IG1ha2VBd3NDYWxsZXIoQVdTLlNOUyk7XG5leHBvcnQgY29uc3QgaWFtID0gbWFrZUF3c0NhbGxlcihBV1MuSUFNKTtcbmV4cG9ydCBjb25zdCBsYW1iZGEgPSBtYWtlQXdzQ2FsbGVyKEFXUy5MYW1iZGEpO1xuZXhwb3J0IGNvbnN0IHN0cyA9IG1ha2VBd3NDYWxsZXIoQVdTLlNUUyk7XG5cbi8qKlxuICogUGVyZm9ybSBhbiBBV1MgY2FsbCBmcm9tIG5vdGhpbmdcbiAqXG4gKiBDcmVhdGUgdGhlIGNvcnJlY3QgY2xpZW50LCBkbyB0aGUgY2FsbCBhbmQgcmVzb2xlIHRoZSBwcm9taXNlKCkuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGF3c0NhbGw8XG4gIEEgZXh0ZW5kcyBBV1MuU2VydmljZSxcbiAgQiBleHRlbmRzIGtleW9mIFNlcnZpY2VDYWxsczxBPixcbj4oY3RvcjogbmV3IChjb25maWc6IGFueSkgPT4gQSwgY2FsbDogQiwgcmVxdWVzdDogRmlyc3Q8U2VydmljZUNhbGxzPEE+W0JdPik6IFByb21pc2U8U2Vjb25kPFNlcnZpY2VDYWxsczxBPltCXT4+IHtcbiAgY29uc3QgZW52ID0gYXdhaXQgdGVzdEVudigpO1xuXG4gIGNvbnN0IHByb2ZpbGVOYW1lID0gcHJvY2Vzcy5lbnYuQVdTX1BST0ZJTEU7XG4gIGxldCBjcmVkcyA9IHVuZGVmaW5lZDtcbiAgaWYgKHByb2Nlc3MuZW52LkNPREVCVUlMRF9CVUlMRF9BUk4gJiYgcHJvZmlsZU5hbWUpIHtcblxuICAgIC8vIGluIGNvZGVidWlsZCB3ZSBtdXN0IGFzc3VtZSB0aGUgcm9sZSB0aGF0IHRoZSBjZGsgdXNlc1xuICAgIC8vIG90aGVyd2lzZSBjcmVkZW50aWFscyB3aWxsIGp1c3QgYmUgcGlja2VkIHVwIGJ5IHRoZSBub3JtYWwgc2RrXG4gICAgLy8gaGV1cmlzdGljcyBhbmQgZXhwaXJlIGFmdGVyIGFuIGhvdXIuXG5cbiAgICAvLyBjYW4ndCB1c2UgJ34nIHNpbmNlIHRoZSBTREsgZG9lc24ndCBzZWVtIHRvIGV4cGFuZCBpdC4uLj9cbiAgICBjb25zdCBjb25maWdQYXRoID0gYCR7cHJvY2Vzcy5lbnYuSE9NRX0vLmF3cy9jb25maWdgO1xuICAgIGNvbnN0IGluaSA9IG5ldyBBV1MuSW5pTG9hZGVyKCkubG9hZEZyb20oe1xuICAgICAgZmlsZW5hbWU6IGNvbmZpZ1BhdGgsXG4gICAgICBpc0NvbmZpZzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2ZpbGUgPSBpbmlbcHJvZmlsZU5hbWVdO1xuXG4gICAgaWYgKCFwcm9maWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb2ZpbGUgJyR7cHJvZmlsZU5hbWV9JyBkb2VzIG5vdCBleGlzdCBpbiBjb25maWcgZmlsZSAoJHtjb25maWdQYXRofSlgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcm4gPSBwcm9maWxlLnJvbGVfYXJuO1xuICAgIGNvbnN0IGV4dGVybmFsSWQgPSBwcm9maWxlLmV4dGVybmFsX2lkO1xuXG4gICAgaWYgKCFhcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcm9sZV9hcm4gZG9lcyBub3QgZXhpc3QgaW4gcHJvZmlsZSAke3Byb2ZpbGVOYW1lfWApO1xuICAgIH1cblxuICAgIGlmICghZXh0ZXJuYWxJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHRlcm5hbF9pZCBkb2VzIG5vdCBleGlzdCBpbiBwcm9maWxlICR7ZXh0ZXJuYWxJZH1gKTtcbiAgICB9XG5cbiAgICBjcmVkcyA9IG5ldyBBV1MuQ2hhaW5hYmxlVGVtcG9yYXJ5Q3JlZGVudGlhbHMoe1xuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIFJvbGVBcm46IGFybixcbiAgICAgICAgRXh0ZXJuYWxJZDogZXh0ZXJuYWxJZCxcbiAgICAgICAgUm9sZVNlc3Npb25OYW1lOiAnaW50ZWctdGVzdHMnLFxuICAgICAgfSxcbiAgICAgIHN0c0NvbmZpZzoge1xuICAgICAgICByZWdpb246IGVudi5yZWdpb24sXG4gICAgICB9LFxuICAgICAgbWFzdGVyQ3JlZGVudGlhbHM6IG5ldyBBV1MuRUNTQ3JlZGVudGlhbHMoKSxcbiAgICB9KTtcblxuICB9XG5cbiAgY29uc3QgY2ZuID0gbmV3IGN0b3Ioe1xuICAgIHJlZ2lvbjogZW52LnJlZ2lvbixcbiAgICBjcmVkZW50aWFsczogY3JlZHMsXG4gICAgbWF4UmV0cmllczogNixcbiAgICByZXRyeURlbGF5T3B0aW9uczoge1xuICAgICAgYmFzZTogNTAwLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gY2ZuW2NhbGxdKHJlcXVlc3QpO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5wcm9taXNlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCBuZXdFcnIgPSBuZXcgRXJyb3IoYCR7Y2FsbH0oJHtKU09OLnN0cmluZ2lmeShyZXF1ZXN0KX0pOiAke2UubWVzc2FnZX1gKTtcbiAgICAobmV3RXJyIGFzIGFueSkuY29kZSA9IGUuY29kZTtcbiAgICB0aHJvdyBuZXdFcnI7XG4gIH1cbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGludm9rZSAnYXdzQ2FsbCcgZm9yIHNwZWNpZmljIHNlcnZpY2VzLlxuICpcbiAqIE5vdCBzdHJpY3RseSBuZWNlc3NhcnkgYnV0IGNhbGxpbmcgdGhpcyByZXBsYWNlcyBhIHdob2xlIGJ1bmNoIG9mIGFubm95aW5nIGdlbmVyaWNzIHlvdSBvdGhlcndpc2UgaGF2ZSB0byB0eXBlOlxuICpcbiAqIGBgYHRzXG4gKiBleHBvcnQgZnVuY3Rpb24gY2xvdWRGb3JtYXRpb248XG4gKiAgIEMgZXh0ZW5kcyBrZXlvZiBTZXJ2aWNlQ2FsbHM8QVdTLkNsb3VkRm9ybWF0aW9uPixcbiAqID4oY2FsbDogQywgcmVxdWVzdDogRmlyc3Q8U2VydmljZUNhbGxzPEFXUy5DbG91ZEZvcm1hdGlvbj5bQ10+KTogUHJvbWlzZTxTZWNvbmQ8U2VydmljZUNhbGxzPEFXUy5DbG91ZEZvcm1hdGlvbj5bQ10+PiB7XG4gKiAgIHJldHVybiBhd3NDYWxsKEFXUy5DbG91ZEZvcm1hdGlvbiwgY2FsbCwgcmVxdWVzdCk7XG4gKiB9XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gbWFrZUF3c0NhbGxlcjxBIGV4dGVuZHMgQVdTLlNlcnZpY2U+KGN0b3I6IG5ldyAoY29uZmlnOiBhbnkpID0+IEEpIHtcbiAgcmV0dXJuIDxCIGV4dGVuZHMga2V5b2YgU2VydmljZUNhbGxzPEE+PihjYWxsOiBCLCByZXF1ZXN0OiBGaXJzdDxTZXJ2aWNlQ2FsbHM8QT5bQl0+KTogUHJvbWlzZTxTZWNvbmQ8U2VydmljZUNhbGxzPEE+W0JdPj4gPT4ge1xuICAgIHJldHVybiBhd3NDYWxsKGN0b3IsIGNhbGwsIHJlcXVlc3QpO1xuICB9O1xufVxuXG50eXBlIFNlcnZpY2VDYWxsczxUPiA9IE5vTmF5TmV2ZXI8U2ltcGxpZmllZFNlcnZpY2U8VD4+O1xuLy8gTWFwIGV2ZXIgbWVtYmVyIGluIHRoZSB0eXBlIHRvIHRoZSBpbXBvcnRhbnQgQVdTIGNhbGwgb3ZlcmxvYWQsIG9yIHRvICduZXZlcidcbnR5cGUgU2ltcGxpZmllZFNlcnZpY2U8VD4gPSB7W2sgaW4ga2V5b2YgVF06IEF3c0NhbGxJTzxUW2tdPn07XG4vLyBSZW1vdmUgYWxsICduZXZlcicgdHlwZXMgZnJvbSBhbiBvYmplY3QgdHlwZVxudHlwZSBOb05heU5ldmVyPFQ+ID0gUGljazxULCB7W2sgaW4ga2V5b2YgVF06IFRba10gZXh0ZW5kcyBuZXZlciA/IG5ldmVyIDogayB9W2tleW9mIFRdPjtcblxuLy8gQmVjYXVzZSBvZiB0aGUgb3ZlcmxvYWRzIGFuIEFXUyBoYW5kbGVyIHR5cGUgbG9va3MgbGlrZSB0aGlzOlxuLy9cbi8vICAge1xuLy8gICAgICAocGFyYW1zOiBJTlBVVFNUUlVDVCwgY2FsbGJhY2s/OiAoKGVycjogQVdTRXJyb3IsIGRhdGE6IHt9KSA9PiB2b2lkKSB8IHVuZGVmaW5lZCk6IFJlcXVlc3Q8T1VUUFVULCAuLi4+O1xuLy8gICAgICAoY2FsbGJhY2s/OiAoKGVycjogQVdTLkFXU0Vycm9yLCBkYXRhOiB7fSkgPT4gdm9pZCkgfCB1bmRlZmluZWQpOiBBV1MuUmVxdWVzdDwuLi4+O1xuLy8gICB9XG4vL1xuLy8gR2V0IHRoZSBmaXJzdCBvdmVybG9hZCBhbmQgZXh0cmFjdCB0aGUgaW5wdXQgYW5kIG91dHB1dCBzdHJ1Y3QgdHlwZXNcbnR5cGUgQXdzQ2FsbElPPFQ+ID1cbiAgVCBleHRlbmRzIHtcbiAgICAoYXJnczogaW5mZXIgSU5QVVQsIGNhbGxiYWNrPzogKChlcnI6IEFXUy5BV1NFcnJvciwgZGF0YTogYW55KSA9PiB2b2lkKSB8IHVuZGVmaW5lZCk6IEFXUy5SZXF1ZXN0PGluZmVyIE9VVFBVVCwgQVdTLkFXU0Vycm9yPjtcbiAgICAoY2FsbGJhY2s/OiAoKGVycjogQVdTLkFXU0Vycm9yLCBkYXRhOiB7fSkgPT4gdm9pZCkgfCB1bmRlZmluZWQpOiBBV1MuUmVxdWVzdDxhbnksIGFueT47XG4gIH0gPyBbSU5QVVQsIE9VVFBVVF0gOiBuZXZlcjtcblxudHlwZSBGaXJzdDxUPiA9IFQgZXh0ZW5kcyBbYW55LCBhbnldID8gVFswXSA6IG5ldmVyO1xudHlwZSBTZWNvbmQ8VD4gPSBUIGV4dGVuZHMgW2FueSwgYW55XSA/IFRbMV0gOiBuZXZlcjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVN0YWNrcyguLi5zdGFja05hbWVzOiBzdHJpbmdbXSkge1xuICBpZiAoc3RhY2tOYW1lcy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChjb25zdCBzdGFja05hbWUgb2Ygc3RhY2tOYW1lcykge1xuICAgIGF3YWl0IGNsb3VkRm9ybWF0aW9uKCd1cGRhdGVUZXJtaW5hdGlvblByb3RlY3Rpb24nLCB7XG4gICAgICBFbmFibGVUZXJtaW5hdGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgICAgU3RhY2tOYW1lOiBzdGFja05hbWUsXG4gICAgfSk7XG4gICAgYXdhaXQgY2xvdWRGb3JtYXRpb24oJ2RlbGV0ZVN0YWNrJywge1xuICAgICAgU3RhY2tOYW1lOiBzdGFja05hbWUsXG4gICAgfSk7XG4gIH1cblxuICBhd2FpdCByZXRyeShgRGVsZXRpbmcgJHtzdGFja05hbWVzfWAsIHJldHJ5LmZvclNlY29uZHMoNjAwKSwgYXN5bmMgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tOYW1lIG9mIHN0YWNrTmFtZXMpIHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHN0YWNrU3RhdHVzKHN0YWNrTmFtZSk7XG4gICAgICBpZiAoc3RhdHVzICE9PSB1bmRlZmluZWQgJiYgc3RhdHVzLmVuZHNXaXRoKCdfRkFJTEVEJykpIHtcbiAgICAgICAgdGhyb3cgcmV0cnkuYWJvcnQobmV3IEVycm9yKGAnJHtzdGFja05hbWV9JyBpcyBpbiBzdGF0ZSAnJHtzdGF0dXN9J2ApKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0dXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlbGV0ZSBvZiAnJHtzdGFja05hbWV9JyBub3QgY29tcGxldGUgeWV0YCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YWNrU3RhdHVzKHN0YWNrTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gKGF3YWl0IGNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBzdGFja05hbWUgfSkpLlN0YWNrcz8uWzBdLlN0YWNrU3RhdHVzO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGlzU3RhY2tNaXNzaW5nRXJyb3IoZSkpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhY2tNaXNzaW5nRXJyb3IoZTogRXJyb3IpIHtcbiAgcmV0dXJuIGUubWVzc2FnZS5pbmRleE9mKCdkb2VzIG5vdCBleGlzdCcpID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0J1Y2tldE1pc3NpbmdFcnJvcihlOiBFcnJvcikge1xuICByZXR1cm4gZS5tZXNzYWdlLmluZGV4T2YoJ2RvZXMgbm90IGV4aXN0JykgPiAtMTtcbn1cblxuLyoqXG4gKiBSZXRyeSBhbiBhc3luYyBvcGVyYXRpb24gdW50aWwgYSBkZWFkbGluZSBpcyBoaXQuXG4gKlxuICogVXNlIGByZXRyeS5mb3JTZWNvbmRzKClgIHRvIGNvbnN0cnVjdCBhIGRlYWRsaW5lIHJlbGF0aXZlIHRvIHJpZ2h0IG5vdy5cbiAqXG4gKiBFeGNlcHRpb25zIHdpbGwgY2F1c2UgdGhlIG9wZXJhdGlvbiB0byByZXRyeS4gVXNlIGByZXRyeS5hYm9ydGAgdG8gYW5ub3RhdGUgYW4gZXhjZXB0aW9uXG4gKiB0byBzdG9wIHRoZSByZXRyeSBhbmQgZW5kIGluIGEgZmFpbHVyZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldHJ5PEE+KG9wZXJhdGlvbjogc3RyaW5nLCBkZWFkbGluZTogRGF0ZSwgYmxvY2s6ICgpID0+IFByb21pc2U8QT4pOiBQcm9taXNlPEE+IHtcbiAgbGV0IGkgPSAwO1xuICBsb2coYPCfkoggJHtvcGVyYXRpb259YCk7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGkrKztcbiAgICAgIGNvbnN0IHJldCA9IGF3YWl0IGJsb2NrKCk7XG4gICAgICBsb2coYPCfkoggJHtvcGVyYXRpb259OiBzdWNjZWVkZWQgYWZ0ZXIgJHtpfSBhdHRlbXB0c2ApO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5hYm9ydCB8fCBEYXRlLm5vdygpID4gZGVhZGxpbmUuZ2V0VGltZSggKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7b3BlcmF0aW9ufTogZGlkIG5vdCBzdWNjZWVkIGFmdGVyICR7aX0gYXR0ZW1wdHM6ICR7ZX1gKTtcbiAgICAgIH1cbiAgICAgIGxvZyhg4o+zICR7b3BlcmF0aW9ufSAoJHtlLm1lc3NhZ2V9KWApO1xuICAgICAgYXdhaXQgc2xlZXAoNTAwMCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWFrZSBhIGRlYWRsaW5lIGZvciB0aGUgYHJldHJ5YCBmdW5jdGlvbiByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB0aW1lLlxuICovXG5yZXRyeS5mb3JTZWNvbmRzID0gKHNlY29uZHM6IG51bWJlcik6IERhdGUgPT4ge1xuICByZXR1cm4gbmV3IERhdGUoRGF0ZS5ub3coKSArIHNlY29uZHMgKiAxMDAwKTtcbn07XG5cbi8qKlxuICogQW5ub3RhdGUgYW4gZXJyb3IgdG8gc3RvcCB0aGUgcmV0cnlpbmdcbiAqL1xucmV0cnkuYWJvcnQgPSAoZTogRXJyb3IpOiBFcnJvciA9PiB7XG4gIChlIGFzIGFueSkuYWJvcnQgPSB0cnVlO1xuICByZXR1cm4gZTtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShvayA9PiBzZXRUaW1lb3V0KG9rLCBtcykpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW1wdHlCdWNrZXQoYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IG9iamVjdHMgPSBhd2FpdCBzMygnbGlzdE9iamVjdHMnLCB7IEJ1Y2tldDogYnVja2V0TmFtZSB9KTtcbiAgY29uc3QgZGVsZXRlcyA9IChvYmplY3RzLkNvbnRlbnRzIHx8IFtdKS5tYXAob2JqID0+IG9iai5LZXkgfHwgJycpLmZpbHRlcihkID0+ICEhZCk7XG4gIGlmIChkZWxldGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICByZXR1cm4gczMoJ2RlbGV0ZU9iamVjdHMnLCB7XG4gICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgIERlbGV0ZToge1xuICAgICAgT2JqZWN0czogZGVsZXRlcy5tYXAoZCA9PiAoeyBLZXk6IGQgfSkpLFxuICAgICAgUXVpZXQ6IGZhbHNlLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlSW1hZ2VSZXBvc2l0b3J5KHJlcG9zaXRvcnlOYW1lOiBzdHJpbmcpIHtcbiAgYXdhaXQgZWNyKCdkZWxldGVSZXBvc2l0b3J5JywgeyByZXBvc2l0b3J5TmFtZSwgZm9yY2U6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVCdWNrZXQoYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgZW1wdHlCdWNrZXQoYnVja2V0TmFtZSk7XG4gICAgYXdhaXQgczMoJ2RlbGV0ZUJ1Y2tldCcsIHtcbiAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChpc0J1Y2tldE1pc3NpbmdFcnJvcihlKSkgeyByZXR1cm47IH1cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRwdXRGcm9tU3RhY2soa2V5OiBzdHJpbmcsIHN0YWNrOiBBV1MuQ2xvdWRGb3JtYXRpb24uU3RhY2spOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICByZXR1cm4gKHN0YWNrLk91dHB1dHMgPz8gW10pLmZpbmQobyA9PiBvLk91dHB1dEtleSA9PT0ga2V5KT8uT3V0cHV0VmFsdWU7XG59XG4iXX0=