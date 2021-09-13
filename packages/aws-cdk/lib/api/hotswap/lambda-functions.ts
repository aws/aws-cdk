import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';
import { assetMetadataChanged, ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, ListStackResources, stringifyPotentialCfnExpression } from './common';

/**
 * Returns `false` if the change cannot be short-circuited,
 * `true` if the change is irrelevant from a short-circuit perspective
 * (like a change to CDKMetadata),
 * or a LambdaFunctionResource if the change can be short-circuited.
 */
export function isHotswappableLambdaFunctionChange(
  logicalId: string, change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): ChangeHotswapResult {
  const lambdaCodeChange = isLambdaFunctionCodeOnlyChange(change, assetParamsWithEnv);
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

    let functionPhysicalName: string | undefined;
    try {
      functionPhysicalName = stringifyPotentialCfnExpression(change.newValue?.Properties?.FunctionName, assetParamsWithEnv);
    } catch (e) {
      // It's possible we can't evaluate the function's name -
      // for example, it can use a Ref to a different resource,
      // which we wouldn't have in `assetParamsWithEnv`.
      // That's fine though - ignore any errors,
      // and treat this case the same way as if the name wasn't provided at all,
      // which means it will be looked up using the listStackResources() call
      // by the later phase (which actually does the Lambda function update)
      functionPhysicalName = undefined;
    }

    return new LambdaFunctionHotswapOperation({
      logicalId,
      physicalName: functionPhysicalName,
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
function isLambdaFunctionCodeOnlyChange(
  change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): LambdaFunctionCode | ChangeHotswapImpact {
/*eslint-disable*/
  /*console.log("new val: ")
  console.log(change.newValue);
  console.log("updates.newval: ");
  console.log(change.propertyUpdates.newValue);
  const propertyUpdates2 = change.propertyUpdates;
  for (const updatedPropName in propertyUpdates2) {
  console.log("updatedpropname: ");
    console.log(updatedPropName);
    const updatedProp = propertyUpdates2[updatedPropName];
    //if (updatedProp.newValue === undefined) {
    //}
    console.log(updatedProp.newValue);

    console.log('---------------------------------------------')
    for (const newPropName in updatedProp.newValue) {
      console.log(newPropName);
    }
  }*/

  const newResourceType = change.newValue?.Type;

  // if we see a different resource type, it will be caught by isNonHotswappableResourceChange()
  // this also ignores Metadata changes
  if (newResourceType !== 'AWS::Lambda::Function') {
    return ChangeHotswapImpact.IRRELEVANT;
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
          s3Bucket = stringifyPotentialCfnExpression(updatedProp.newValue[newPropName], assetParamsWithEnv);
          break;
        case 'S3Key':
          foundCodeDifference = true;
          s3Key = stringifyPotentialCfnExpression(updatedProp.newValue[newPropName], assetParamsWithEnv);
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
  readonly logicalId: string;
  readonly physicalName?: string;
  readonly code: LambdaFunctionCode;
}

class LambdaFunctionHotswapOperation implements HotswapOperation {
  constructor(private readonly lambdaFunctionResource: LambdaFunctionResource) {
  }

  public async apply(sdk: ISDK, stackResources: ListStackResources): Promise<any> {
    let functionPhysicalName: string;
    if (this.lambdaFunctionResource.physicalName) {
      //console.log(if)
      functionPhysicalName = this.lambdaFunctionResource.physicalName;
    } else {
      //console.log(else)
      const stackResourceList = await stackResources.listStackResources();
      const foundFunctionName = stackResourceList
        .find(resSummary => resSummary.LogicalResourceId === this.lambdaFunctionResource.logicalId)
        ?.PhysicalResourceId;
      if (!foundFunctionName) {
        // if we couldn't find the function in the current stack, we can't update it
        return;
      }
      functionPhysicalName = foundFunctionName;
    }

    return sdk.lambda().updateFunctionCode({
      FunctionName: functionPhysicalName,
      S3Bucket: this.lambdaFunctionResource.code.s3Bucket,
      S3Key: this.lambdaFunctionResource.code.s3Key,
    }).promise();
  }
}
