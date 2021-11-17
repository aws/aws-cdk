import { ISDK } from '../aws-auth';
import { /*assetMetadataChanged,*/ ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, establishResourcePhysicalName } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

/**
 * Returns `false` if the change cannot be short-circuited,
 * `true` if the change is irrelevant from a short-circuit perspective
 * (like a change to CDKMetadata),
 * or a LambdaFunctionResource if the change can be short-circuited.
 */
/*eslint-disable*/
export async function isHotswappableS3BucketDeploymentChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  /*const s3BucketDeployment =*/ await isS3BucketDeploymentOnlyChange(change, evaluateCfnTemplate);

  //if (typeof s3BucketDeployment === 'string') {
  //  return s3BucketDeployment;
  //}
  if (change.newValue.Type === 'AWS::IAM::Policy') {
    return ChangeHotswapImpact.NONE;
  }

  logicalId;

  const deployment = {
    SourceBucketNames: '',
    SourceObjectKeys: '',
    DestinationBucketName: '',
  };

  console.log(change.newValue.Type)
  console.log(change.newValue.Properties)

  // note that this gives the ARN of the lambda, not the name. This is fine though, because thankfully the invoke sdk call will take either
  const functionName = await establishResourcePhysicalName(logicalId, change.newValue.Properties?.ServiceToken, evaluateCfnTemplate);
  if (!functionName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  console.log('function name')
  console.log(functionName)

  return new S3BucketDeploymentHotswapOperation({
    FunctionName: functionName,
    s3BucketDeployment: deployment,
  });
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
async function isS3BucketDeploymentOnlyChange(
  change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<S3BucketDeployment | ChangeHotswapImpact> {
  const newResourceType = change.newValue.Type;
  evaluateCfnTemplate;
  /*eslint-disable*/
  console.log(newResourceType)

  //if (newResourceType !== 'Custom::CDKBucketDeployment') {
  //  return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  //}

  /*
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
    */

    return ChangeHotswapImpact.IRRELEVANT;
}

interface S3BucketDeployment {
  SourceBucketNames: any,
  SourceObjectKeys: any,
  DestinationBucketName: any,

}

interface S3BucketDeploymentResource {
  FunctionName: string,
  s3BucketDeployment: S3BucketDeployment,
}

class S3BucketDeploymentHotswapOperation implements HotswapOperation {
  constructor(private readonly s3BucketDeploymentResource: S3BucketDeploymentResource) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    console.log('applying invoke')
    return sdk.lambda().invoke({
      FunctionName: this.s3BucketDeploymentResource.FunctionName,
      Payload: {
        SourceBucketNames: this.s3BucketDeploymentResource.s3BucketDeployment.SourceBucketNames,
        SourceObjectKeys: this.s3BucketDeploymentResource.s3BucketDeployment.SourceObjectKeys,
        DestinationBucketName: this.s3BucketDeploymentResource.s3BucketDeployment.DestinationBucketName,
      },
    }).promise();
  }
}
