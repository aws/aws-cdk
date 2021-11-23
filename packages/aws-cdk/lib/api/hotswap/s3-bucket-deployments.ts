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
  // meaning that the changes made to the Policy are artificial
  if (change.newValue.Type === 'AWS::IAM::Policy') {
    const roles = change.newValue.Properties?.Roles;
    for (const role of roles) {
      const roleLogicalName = await evaluateCfnTemplate.findLogicallNameFor(await evaluateCfnTemplate.evaluateCfnExpression(role));
      if (!roleLogicalName) {
        return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
      }

      const roleRefs = evaluateCfnTemplate.findReferencesTo(roleLogicalName);
      for (const roleRef of roleRefs) {
        if (roleRef.Type === 'AWS::Lambda::Function') {
          const lambdaRefs = evaluateCfnTemplate.findReferencesTo(roleRef.LogicalId);
          for (const lambdaRef of lambdaRefs) {
            // If S3Deployment -> Lambda -> Role and IAM::Policy -> Role, then this IAM::Policy change is an
            // artifact of old-style synthesis
            if (lambdaRef.Type === 'Custom::CDKBucketDeployment') {
              return new EmptyHotswapOperation();
            }
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

  const sourceBucketNames = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.SourceBucketNames);
  const sourceObjectKeys = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.SourceObjectKeys);
  const destinationBucketName = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.DestinationBucketName);
  const destinationBucketKeyPrefix = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.DestinationBucketKeyPrefix);

  return new S3BucketDeploymentHotswapOperation({
    FunctionName: functionName,
    SourceBucketNames: sourceBucketNames,
    SourceObjectKeys: sourceObjectKeys,
    DestinationBucketName: destinationBucketName,
    DestinationBucketKeyPrefix: destinationBucketKeyPrefix,
  });
}

interface S3BucketDeployment {
  FunctionName: string,
  SourceBucketNames: any,
  SourceObjectKeys: any,
  DestinationBucketName: any,
  DestinationBucketKeyPrefix: string,
}

class S3BucketDeploymentHotswapOperation implements HotswapOperation {
  constructor(private readonly s3BucketDeployment: S3BucketDeployment) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    const deployment = this.s3BucketDeployment;

    return sdk.lambda().invoke({
      FunctionName: deployment.FunctionName,
      // Lambda refuses to take a direct JSON object and requires it to be stringify()'d
      Payload: JSON.stringify({
        RequestType: 'Update',
        ResponseURL: REQUIRED_BY_CFN,
        PhysicalResourceId: REQUIRED_BY_CFN,
        StackId: REQUIRED_BY_CFN,
        RequestId: REQUIRED_BY_CFN,
        LogicalResourceId: REQUIRED_BY_CFN,
        ResourceProperties: {
          SourceBucketNames: deployment.SourceBucketNames,
          SourceObjectKeys: deployment.SourceObjectKeys,
          DestinationBucketName: deployment.DestinationBucketName,
          DestinationBucketKeyPrefix: deployment.DestinationBucketKeyPrefix,
        },
      }),
    }).promise();
  }
}

class EmptyHotswapOperation implements HotswapOperation {
  constructor() {
  }

  public async apply(sdk: ISDK): Promise<any> {
    return new Promise(() => { sdk; });
  }
}
