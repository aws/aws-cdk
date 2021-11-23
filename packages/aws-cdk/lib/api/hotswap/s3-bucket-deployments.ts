import { ISDK } from '../aws-auth';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, establishResourcePhysicalName } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

/**
 * This means that the value is required to exist by CloudFormation's API (or our S3 Bucket Deployment Lambda)
 * but the actual value specified is irrelevant
 */
export const REQUIRED_BY_CFN = 'required-to-be-present-by-cfn';

export async function isHotswappableS3BucketDeploymentChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // In old-style synthesis, the policy used by the lambda to copy assets Ref's the assets directly,
  // meaning that the changes made to the Policy are artifacts that can be safely ignored
  if (change.newValue.Type === 'AWS::IAM::Policy') {
    const roles = change.newValue.Properties?.Roles;
    if (!roles) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
    for (const role of roles) {
      const roleLogicalId = await evaluateCfnTemplate.findLogicalIdForPhysicalName(await evaluateCfnTemplate.evaluateCfnExpression(role));
      if (!roleLogicalId) {
        return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
      }

      const roleRefs = evaluateCfnTemplate.findReferencesTo(roleLogicalId);
      for (const roleRef of roleRefs) {
        if (roleRef.Type !== 'AWS::Lambda::Function' && roleRef.Type !== 'AWS::IAM::Policy') {
          return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
        } else if (roleRef.Type === 'AWS::Lambda::Function') {
          const lambdaRefs = evaluateCfnTemplate.findReferencesTo(roleRef.LogicalId);
          for (const lambdaRef of lambdaRefs) {
            // If S3Deployment -> Lambda -> Role and IAM::Policy -> Role, then this IAM::Policy change is an
            // artifact of old-style synthesis
            if (lambdaRef.Type === 'Custom::CDKBucketDeployment') {
              return new EmptyHotswapOperation();
            }

            return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
          }
        }
      }
    }
  }

  if (change.newValue.Type !== 'Custom::CDKBucketDeployment') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  // note that this gives the ARN of the lambda, not the name. This is fine though, the invoke() sdk call will take either
  const functionName = await establishResourcePhysicalName(logicalId, change.newValue.Properties?.ServiceToken, evaluateCfnTemplate);
  if (!functionName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const props = change.newValue.Properties;

  return new S3BucketDeploymentHotswapOperation({
    functionName: functionName,
    sourceBucketNames: await evaluateCfnTemplate.evaluateCfnExpression(props?.SourceBucketNames),
    sourceObjectKeys: await evaluateCfnTemplate.evaluateCfnExpression(props?.SourceObjectKeys),
    destinationBucketName: await evaluateCfnTemplate.evaluateCfnExpression(props?.DestinationBucketName),
    destinationBucketKeyPrefix: await evaluateCfnTemplate.evaluateCfnExpression(props?.DestinationBucketKeyPrefix),
  });
}

interface S3BucketDeploymentHotswapOperationOptions {
  functionName: string;
  sourceBucketNames: string[];
  sourceObjectKeys: string[];
  destinationBucketName: string;
  destinationBucketKeyPrefix: string;
}

class S3BucketDeploymentHotswapOperation implements HotswapOperation {
  constructor(private readonly s3BucketDeployment: S3BucketDeploymentHotswapOperationOptions) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    const deployment = this.s3BucketDeployment;

    return sdk.lambda().invoke({
      FunctionName: deployment.functionName,
      // Lambda refuses to take a direct JSON object and requires it to be stringify()'d
      Payload: JSON.stringify({
        RequestType: 'Update',
        ResponseURL: REQUIRED_BY_CFN,
        PhysicalResourceId: REQUIRED_BY_CFN,
        StackId: REQUIRED_BY_CFN,
        RequestId: REQUIRED_BY_CFN,
        LogicalResourceId: REQUIRED_BY_CFN,
        ResourceProperties: {
          SourceBucketNames: deployment.sourceBucketNames,
          SourceObjectKeys: deployment.sourceObjectKeys,
          DestinationBucketName: deployment.destinationBucketName,
          DestinationBucketKeyPrefix: deployment.destinationBucketKeyPrefix,
        },
      }),
    }).promise();
  }
}

class EmptyHotswapOperation implements HotswapOperation {
  constructor() {
  }

  public async apply(sdk: ISDK): Promise<any> {
    return Promise.resolve(sdk);
  }
}
