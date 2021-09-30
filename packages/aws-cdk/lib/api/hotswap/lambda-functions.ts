import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';
import { assetMetadataChanged, ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation } from './common';
import { CfnEvaluationException, EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

/**
 * Returns `false` if the change cannot be short-circuited,
 * `true` if the change is irrelevant from a short-circuit perspective
 * (like a change to CDKMetadata),
 * or a LambdaFunctionResource if the change can be short-circuited.
 */
export async function isHotswappableLambdaFunctionChange(
  logicalId: string, change: cfn_diff.ResourceDifference, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
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

    const functionName = await establishFunctionPhysicalName(logicalId, change, evaluateCfnTemplate);
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
 * Returns `true` if the change is not for a AWS::Lambda::Function,
 * but doesn't prevent short-circuiting
 * (like a change to CDKMetadata resource),
 * `false` if the change is to a AWS::Lambda::Function,
 * but not only to its Code property,
 * or a LambdaFunctionCode if the change is to a AWS::Lambda::Function,
 * and only affects its Code property.
 */
async function isLambdaFunctionCodeOnlyChange(
  change: cfn_diff.ResourceDifference, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<LambdaFunctionCode | ChangeHotswapImpact> {
  if (!change.newValue) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }
  const newResourceType = change.newValue.Type;
  // Ignore Metadata changes
  if (newResourceType === 'AWS::CDK::Metadata') {
    return ChangeHotswapImpact.IRRELEVANT;
  }
  // The only other resource change we should see is a Lambda function
  if (newResourceType !== 'AWS::Lambda::Function') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }
  if (change.oldValue?.Type == null) {
    // this means this is a brand-new Lambda function -
    // obviously, we can't short-circuit that!
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
    if (updatedProp.newValue === undefined) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
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

async function establishFunctionPhysicalName(
  logicalId: string, change: cfn_diff.ResourceDifference, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<string | undefined> {
  const functionNameInCfnTemplate = change.newValue?.Properties?.FunctionName;
  if (functionNameInCfnTemplate != null) {
    try {
      return await evaluateCfnTemplate.evaluateCfnExpression(functionNameInCfnTemplate);
    } catch (e) {
      // If we can't evaluate the function's name CloudFormation expression,
      // just look it up in the currently deployed Stack
      if (!(e instanceof CfnEvaluationException)) {
        throw e;
      }
    }
  }
  return evaluateCfnTemplate.findPhysicalNameFor(logicalId);
}
