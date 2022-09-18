import { Writable } from 'stream';
import * as AWS from 'aws-sdk';
import { flatMap } from '../../util';
import { ISDK } from '../aws-auth';
import { CfnEvaluationException, EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate } from './common';

// namespace object imports won't work in the bundle for function exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver');

/**
 * Returns `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` if the change cannot be short-circuited,
 * `ChangeHotswapImpact.IRRELEVANT` if the change is irrelevant from a short-circuit perspective
 * (like a change to CDKMetadata),
 * or a LambdaFunctionResource if the change can be short-circuited.
 */
export async function isHotswappableLambdaFunctionChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // if the change is for a Lambda Version,
  // ignore it by returning an empty hotswap operation -
  // we will publish a new version when we get to hotswapping the actual Function this Version points to, below
  // (Versions can't be changed in CloudFormation anyway, they're immutable)
  if (change.newValue.Type === 'AWS::Lambda::Version') {
    return ChangeHotswapImpact.IRRELEVANT;
  }

  // we handle Aliases specially too
  if (change.newValue.Type === 'AWS::Lambda::Alias') {
    return checkAliasHasVersionOnlyChange(change);
  }

  const lambdaCodeChange = await isLambdaFunctionCodeOnlyChange(change, evaluateCfnTemplate);
  if (typeof lambdaCodeChange === 'string') {
    return lambdaCodeChange;
  }

  const functionName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, change.newValue.Properties?.FunctionName);
  if (!functionName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const functionArn = await evaluateCfnTemplate.evaluateCfnExpression({
    'Fn::Sub': 'arn:${AWS::Partition}:lambda:${AWS::Region}:${AWS::AccountId}:function:' + functionName,
  });

  // find all Lambda Versions that reference this Function
  const versionsReferencingFunction = evaluateCfnTemplate.findReferencesTo(logicalId)
    .filter(r => r.Type === 'AWS::Lambda::Version');
  // find all Lambda Aliases that reference the above Versions
  const aliasesReferencingVersions = flatMap(versionsReferencingFunction, v =>
    evaluateCfnTemplate.findReferencesTo(v.LogicalId));
  const aliasesNames = await Promise.all(aliasesReferencingVersions.map(a =>
    evaluateCfnTemplate.evaluateCfnExpression(a.Properties?.Name)));

  return new LambdaFunctionHotswapOperation({
    physicalName: functionName,
    functionArn: functionArn,
    resource: lambdaCodeChange,
    publishVersion: versionsReferencingFunction.length > 0,
    aliasesNames,
  });
}

/**
 * Returns  is a given Alias change is only in the 'FunctionVersion' property,
 * and `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` is the change is for any other property.
 */
function checkAliasHasVersionOnlyChange(change: HotswappableChangeCandidate): ChangeHotswapResult {
  for (const updatedPropName in change.propertyUpdates) {
    if (updatedPropName !== 'FunctionVersion') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }
  return ChangeHotswapImpact.IRRELEVANT;
}

/**
 * Returns `ChangeHotswapImpact.IRRELEVANT` if the change is not for a AWS::Lambda::Function,
 * but doesn't prevent short-circuiting
 * (like a change to CDKMetadata resource),
 * `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` if the change is to a AWS::Lambda::Function,
 * but not only to its Code property,
 * or a LambdaFunctionCode if the change is to a AWS::Lambda::Function,
 * and only affects its Code property.
 */
async function isLambdaFunctionCodeOnlyChange(
  change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<LambdaFunctionChange | ChangeHotswapImpact> {
  const newResourceType = change.newValue.Type;
  if (newResourceType !== 'AWS::Lambda::Function') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  /*
   * At first glance, we would want to initialize these using the "previous" values (change.oldValue),
   * in case only one of them changed, like the key, and the Bucket stayed the same.
   * However, that actually fails for old-style synthesis, which uses CFN Parameters!
   * Because the names of the Parameters depend on the hash of the Asset,
   * the Parameters used for the "old" values no longer exist in `assetParams` at this point,
   * which means we don't have the correct values available to evaluate the CFN expression with.
   * Fortunately, the diff will always include both the s3Bucket and s3Key parts of the Lambda's Code property,
   * even if only one of them was actually changed,
   * which means we don't need the "old" values at all, and we can safely initialize these with just `''`.
   */
  const propertyUpdates = change.propertyUpdates;
  let code: LambdaFunctionCode | undefined = undefined;
  let tags: LambdaFunctionTags | undefined = undefined;
  let description: string | undefined = undefined;
  let environment: { [key: string]: string } | undefined = undefined;

  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];

    switch (updatedPropName) {
      case 'Code':
        let foundCodeDifference = false;
        let s3Bucket, s3Key, imageUri, functionCodeZip;

        for (const newPropName in updatedProp.newValue) {
          switch (newPropName) {
            case 'S3Bucket':
              foundCodeDifference = true;
              s3Bucket = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue[newPropName]);
              break;
            case 'S3Key':
              foundCodeDifference = true;
              s3Key = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue[newPropName]);
              break;
            case 'ImageUri':
              foundCodeDifference = true;
              imageUri = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue[newPropName]);
              break;
            case 'ZipFile':
              foundCodeDifference = true;
              // We must create a zip package containing a file with the inline code
              const functionCode = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue[newPropName]);
              const functionRuntime = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.Runtime);
              if (!functionRuntime) {
                return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
              }
              // file extension must be chosen depending on the runtime
              const codeFileExt = determineCodeFileExtFromRuntime(functionRuntime);
              functionCodeZip = await zipString(`index.${codeFileExt}`, functionCode);
              break;
            default:
              return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
          }
        }
        if (foundCodeDifference) {
          code = {
            s3Bucket,
            s3Key,
            imageUri,
            functionCodeZip,
          };
        }
        break;
      case 'Tags':
        /*
         * Tag updates are a bit odd; they manifest as two lists, are flagged only as
         * `isDifferent`, and we have to reconcile them.
         */
        const tagUpdates: { [tag: string]: string | TagDeletion } = {};
        if (updatedProp?.isDifferent) {
          updatedProp.newValue.forEach((tag: CfnDiffTagValue) => {
            tagUpdates[tag.Key] = await evaluateCfnTemplate.evaluateCfnExpression(tag.Value);
          });

          updatedProp.oldValue.forEach((tag: CfnDiffTagValue) => {
            if (tagUpdates[tag.Key] === undefined) {
              tagUpdates[tag.Key] = TagDeletion.DELETE;
            }
          });

          tags = { tagUpdates };
        }
        break;
      case 'Description':
        description = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue);
        break;
      case 'Environment':
        environment = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue);
        break;
      default:
        return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  const configurations = description || environment ? { description, environment } : undefined;
  return code || tags || configurations ? { code, tags, configurations } : ChangeHotswapImpact.IRRELEVANT;
}

interface CfnDiffTagValue {
  readonly Key: string;
  readonly Value: string;
}

interface LambdaFunctionCode {
  readonly s3Bucket?: string;
  readonly s3Key?: string;
  readonly imageUri?: string;
  readonly functionCodeZip?: Buffer;
}

enum TagDeletion {
  DELETE = -1,
}

interface LambdaFunctionTags {
  readonly tagUpdates: { [tag : string] : string | TagDeletion };
}

interface LambdaFunctionConfigurations {
  readonly description?: string;
  readonly environment?: { [key: string]: string };
}

interface LambdaFunctionChange {
  readonly code?: LambdaFunctionCode;
  readonly tags?: LambdaFunctionTags;
  readonly configurations?: LambdaFunctionConfigurations;
}

interface LambdaFunctionResource {
  readonly physicalName: string;
  readonly functionArn: string;
  readonly resource: LambdaFunctionChange;
  readonly publishVersion: boolean;
  readonly aliasesNames: string[];
}

class LambdaFunctionHotswapOperation implements HotswapOperation {
  public readonly service = 'lambda-function';
  public readonly resourceNames: string[];

  constructor(private readonly lambdaFunctionResource: LambdaFunctionResource) {
    this.resourceNames = [
      `Lambda Function '${lambdaFunctionResource.physicalName}'`,
      // add Version here if we're publishing a new one
      ...(lambdaFunctionResource.publishVersion ? [`Lambda Version for Function '${lambdaFunctionResource.physicalName}'`] : []),
      // add any Aliases that we are hotswapping here
      ...lambdaFunctionResource.aliasesNames.map(alias => `Lambda Alias '${alias}' for Function '${lambdaFunctionResource.physicalName}'`),
    ];
  }

  public async apply(sdk: ISDK): Promise<any> {
    const lambda = sdk.lambda();
    const resource = this.lambdaFunctionResource.resource;
    const operations: Promise<any>[] = [];

    if (resource.code !== undefined || resource.configurations !== undefined) {
      if (resource.code !== undefined) {
        const updateFunctionCodeResponse = await lambda.updateFunctionCode({
          FunctionName: this.lambdaFunctionResource.physicalName,
          S3Bucket: resource.code.s3Bucket,
          S3Key: resource.code.s3Key,
          ImageUri: resource.code.imageUri,
          ZipFile: resource.code.functionCodeZip,
        }).promise();

        await this.waitForLambdasPropertiesUpdateToFinish(updateFunctionCodeResponse, lambda);
      }

      if (resource.configurations !== undefined) {
        const updateRequest: AWS.Lambda.UpdateFunctionConfigurationRequest = {
          FunctionName: this.lambdaFunctionResource.physicalName,
        };
        if (resource.configurations.description !== undefined) {
          updateRequest.Description = resource.configurations.description;
        }
        if (resource.configurations.environment !== undefined) {
          updateRequest.Environment = resource.configurations.environment;
        }
        const updateFunctionCodeResponse = await lambda.updateFunctionConfiguration(updateRequest).promise();
        await this.waitForLambdasPropertiesUpdateToFinish(updateFunctionCodeResponse, lambda);
      }

      // only if the code changed is there any point in publishing a new Version
      if (this.lambdaFunctionResource.publishVersion) {
        const publishVersionPromise = lambda.publishVersion({
          FunctionName: this.lambdaFunctionResource.physicalName,
        }).promise();

        if (this.lambdaFunctionResource.aliasesNames.length > 0) {
          // we need to wait for the Version to finish publishing
          const versionUpdate = await publishVersionPromise;

          for (const alias of this.lambdaFunctionResource.aliasesNames) {
            operations.push(lambda.updateAlias({
              FunctionName: this.lambdaFunctionResource.physicalName,
              Name: alias,
              FunctionVersion: versionUpdate.Version,
            }).promise());
          }
        } else {
          operations.push(publishVersionPromise);
        }
      }
    }

    if (resource.tags !== undefined) {
      const tagsToDelete: string[] = Object.entries(resource.tags.tagUpdates)
        .filter(([_key, val]) => val === TagDeletion.DELETE)
        .map(([key, _val]) => key);

      const tagsToSet: { [tag: string]: string } = {};
      Object.entries(resource.tags!.tagUpdates)
        .filter(([_key, val]) => val !== TagDeletion.DELETE)
        .forEach(([tagName, tagValue]) => {
          tagsToSet[tagName] = tagValue as string;
        });

      if (tagsToDelete.length > 0) {
        operations.push(lambda.untagResource({
          Resource: this.lambdaFunctionResource.functionArn,
          TagKeys: tagsToDelete,
        }).promise());
      }

      if (Object.keys(tagsToSet).length > 0) {
        operations.push(lambda.tagResource({
          Resource: this.lambdaFunctionResource.functionArn,
          Tags: tagsToSet,
        }).promise());
      }
    }

    // run all of our updates in parallel
    return Promise.all(operations);
  }

  /**
   * After a Lambda Function is updated, it cannot be updated again until the
   * `State=Active` and the `LastUpdateStatus=Successful`.
   *
   * Depending on the configuration of the Lambda Function this could happen relatively quickly
   * or very slowly. For example, Zip based functions _not_ in a VPC can take ~1 second whereas VPC
   * or Container functions can take ~25 seconds (and 'idle' VPC functions can take minutes).
   */
  private async waitForLambdasPropertiesUpdateToFinish(
    currentFunctionConfiguration: AWS.Lambda.FunctionConfiguration, lambda: AWS.Lambda,
  ): Promise<void> {
    const functionIsInVpcOrUsesDockerForCode = currentFunctionConfiguration.VpcConfig?.VpcId ||
        currentFunctionConfiguration.PackageType === 'Image';

    // if the function is deployed in a VPC or if it is a container image function
    // then the update will take much longer and we can wait longer between checks
    // otherwise, the update will be quick, so a 1-second delay is fine
    const delaySeconds = functionIsInVpcOrUsesDockerForCode ? 5 : 1;

    // configure a custom waiter to wait for the function update to complete
    (lambda as any).api.waiters.updateFunctionPropertiesToFinish = {
      name: 'UpdateFunctionPropertiesToFinish',
      operation: 'getFunction',
      // equates to 1 minute for zip function not in a VPC and
      // 5 minutes for container functions or function in a VPC
      maxAttempts: 60,
      delay: delaySeconds,
      acceptors: [
        {
          matcher: 'path',
          argument: "Configuration.LastUpdateStatus == 'Successful' && Configuration.State == 'Active'",
          expected: true,
          state: 'success',
        },
        {
          matcher: 'path',
          argument: 'Configuration.LastUpdateStatus',
          expected: 'Failed',
          state: 'failure',
        },
      ],
    };

    const updateFunctionPropertiesWaiter = new (AWS as any).ResourceWaiter(lambda, 'updateFunctionPropertiesToFinish');
    await updateFunctionPropertiesWaiter.wait({
      FunctionName: this.lambdaFunctionResource.physicalName,
    }).promise();
  }
}

/**
 * Compress a string as a file, returning a promise for the zip buffer
 * https://github.com/archiverjs/node-archiver/issues/342
 */
function zipString(fileName: string, rawString: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];

    const converter = new Writable();

    converter._write = (chunk: Buffer, _: string, callback: () => void) => {
      buffers.push(chunk);
      process.nextTick(callback);
    };

    converter.on('finish', () => {
      resolve(Buffer.concat(buffers));
    });

    const archive = archiver('zip');

    archive.on('error', (err: any) => {
      reject(err);
    });

    archive.pipe(converter);

    archive.append(rawString, {
      name: fileName,
      date: new Date('1980-01-01T00:00:00.000Z'), // Add date to make resulting zip file deterministic
    });

    void archive.finalize();
  });
}

/**
 * Get file extension from Lambda runtime string.
 * We use this extension to create a deployment package from Lambda inline code.
 */
function determineCodeFileExtFromRuntime(runtime: string): string {
  if (runtime.startsWith('node')) {
    return 'js';
  }
  if (runtime.startsWith('python')) {
    return 'py';
  }
  // Currently inline code only supports Node.js and Python, ignoring other runtimes.
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#aws-properties-lambda-function-code-properties
  throw new CfnEvaluationException(`runtime ${runtime} is unsupported, only node.js and python runtimes are currently supported.`);
}
