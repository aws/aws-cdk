import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate } from './common';

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
    return changeIsForS3DeployCustomResourcePolicy(logicalId, change, evaluateCfnTemplate);
  }

  if (change.newValue.Type !== 'Custom::CDKBucketDeployment') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  // note that this gives the ARN of the lambda, not the name. This is fine though, the invoke() sdk call will take either
  const functionName = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.ServiceToken);
  if (!functionName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const customResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression({
    ...change.newValue.Properties,
    ServiceToken: undefined,
  });

  return new S3BucketDeploymentHotswapOperation(functionName, customResourceProperties);
}

class S3BucketDeploymentHotswapOperation implements HotswapOperation {
  public readonly service = 'custom-s3-deployment';
  public readonly resourceNames: string[];

  constructor(private readonly functionName: string, private readonly customResourceProperties: any) {
    this.resourceNames = [`Contents of S3 Bucket '${this.customResourceProperties.DestinationBucketName}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.lambda().invoke({
      FunctionName: this.functionName,
      // Lambda refuses to take a direct JSON object and requires it to be stringify()'d
      Payload: JSON.stringify({
        RequestType: 'Update',
        ResponseURL: REQUIRED_BY_CFN,
        PhysicalResourceId: REQUIRED_BY_CFN,
        StackId: REQUIRED_BY_CFN,
        RequestId: REQUIRED_BY_CFN,
        LogicalResourceId: REQUIRED_BY_CFN,
        ResourceProperties: stringifyObject(this.customResourceProperties), // JSON.stringify() doesn't turn the actual objects to strings, but the lambda expects strings
      }),
    }).promise();
  }
}

async function changeIsForS3DeployCustomResourcePolicy(
  iamPolicyLogicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
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
      if (roleRef.Type === 'AWS::Lambda::Function') {
        const lambdaRefs = evaluateCfnTemplate.findReferencesTo(roleRef.LogicalId);
        for (const lambdaRef of lambdaRefs) {
          // If S3Deployment -> Lambda -> Role and IAM::Policy -> Role, then this IAM::Policy change is an
          // artifact of old-style synthesis
          if (lambdaRef.Type !== 'Custom::CDKBucketDeployment') {
            return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
          }
        }
      } else if (roleRef.Type === 'AWS::IAM::Policy') {
        if (roleRef.LogicalId !== iamPolicyLogicalId) {
          return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
        }
      } else {
        return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
      }
    }
  }

  return ChangeHotswapImpact.IRRELEVANT;
}

function stringifyObject(obj: any): any {
  if (obj == null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(stringifyObject);
  }
  if (typeof obj !== 'object') {
    return obj.toString();
  }

  const ret: { [k: string]: any } = {};
  for (const [k, v] of Object.entries(obj)) {
    ret[k] = stringifyObject(v);
  }
  return ret;
}
