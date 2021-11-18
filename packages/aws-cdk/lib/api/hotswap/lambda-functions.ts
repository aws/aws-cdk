import { ISDK } from '../aws-auth';
import { assetMetadataChanged, ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, establishResourcePhysicalName } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

/**
 * Returns `false` if the change cannot be short-circuited,
 * `true` if the change is irrelevant from a short-circuit perspective
 * (like a change to CDKMetadata),
 * or a LambdaFunctionResource if the change can be short-circuited.
 */
export async function isHotswappableLambdaFunctionChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const lambdaCodeChange = await isLambdaFunctionCodeOnlyChange(change, evaluateCfnTemplate);
  if (typeof lambdaCodeChange === 'string') {
    return lambdaCodeChange;
  } else {
    // verify that the Asset changed - otherwise,
    // it's a Code property-only change,
    // but not to an asset change
    // (for example, going from Code.fromAsset() to Code.fromInline())
    if (!assetMetadataChanged(change)) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }

    const functionName = await establishResourcePhysicalName(logicalId, change.newValue.Properties?.FunctionName, evaluateCfnTemplate);
    if (!functionName) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }

    return new LambdaFunctionHotswapOperation({
      physicalName: functionName,
      code: lambdaCodeChange,
    });
  }
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
): Promise<LambdaFunctionCode | ChangeHotswapImpact> {
  const newResourceType = change.newValue.Type;
  if (newResourceType !== 'AWS::Lambda::Function') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  /*
   * On first glance, we would want to initialize these using the "previous" values (change.oldValue),
   * in case only one of them changed, like the key, and the Bucket stayed the same.
   * However, that actually fails for old-style synthesis, which uses CFN Parameters!
   * Because the names of the Parameters depend on the hash of the Asset,
   * the Parameters used for the "old" values no longer exist in `assetParams` at this point,
   * which means we don't have the correct values available to evaluate the CFN expression with.
   * Fortunately, the diff will always include both the s3Bucket and s3Key parts of the Lambda's Code property,
   * even if only one of them was actually changed,
   * which means we don't need the "old" values at all, and we can safely initialize these with just `''`.
   */
  let s3Bucket = '', s3Key = '';
  let foundCodeDifference = false;
  // Make sure only the code in the Lambda function changed
  const propertyUpdates = change.propertyUpdates;
  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];
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
        default:
          return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
      }
    }
  }

  return foundCodeDifference
    ? {
      s3Bucket,
      s3Key,
    }
    : ChangeHotswapImpact.IRRELEVANT;
}

interface LambdaFunctionCode {
  readonly s3Bucket: string;
  readonly s3Key: string;
}

interface LambdaFunctionResource {
  readonly physicalName: string;
  readonly code: LambdaFunctionCode;
}

class LambdaFunctionHotswapOperation implements HotswapOperation {
  public readonly service = 'lambda-function';

  constructor(private readonly lambdaFunctionResource: LambdaFunctionResource) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.lambda().updateFunctionCode({
      FunctionName: this.lambdaFunctionResource.physicalName,
      S3Bucket: this.lambdaFunctionResource.code.s3Bucket,
      S3Key: this.lambdaFunctionResource.code.s3Key,
    }).promise();
  }
}
