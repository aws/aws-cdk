import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, HotswappableChangeCandidate } from './common';

/**
 * This means that the value is required to exist by CloudFormation's Custom Resource API (or our S3 Bucket Deployment Lambda's API)
 * but the actual value specified is irrelevant
 */
export const REQUIRED_BY_CFN = 'required-to-be-present-by-cfn';

export async function isHotswappableS3BucketDeploymentChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // In old-style synthesis, the policy used by the lambda to copy assets Ref's the assets directly,
  // meaning that the changes made to the Policy are artifacts that can be safely ignored
  const ret: ChangeHotswapResult = [];
  if (change.newValue.Type === 'AWS::IAM::Policy') {
    return changeIsForS3DeployCustomResourcePolicy(logicalId, change, evaluateCfnTemplate);
  }

  if (change.newValue.Type !== 'Custom::CDKBucketDeployment') {
    return [];
  }

  // no classification to be done here; all the properties of this custom resource thing are hotswappable
  const customResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression({
    ...change.newValue.Properties,
    ServiceToken: undefined,
  });

  ret.push({
    hotswappable: true,
    resourceType: change.newValue.Type,
    propsChanged: ['*'],
    service: 'custom-s3-deployment',
    resourceNames: [`Contents of S3 Bucket '${customResourceProperties.DestinationBucketName}'`],
    apply: async (sdk: ISDK) => {
      // note that this gives the ARN of the lambda, not the name. This is fine though, the invoke() sdk call will take either
      const functionName = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.ServiceToken);
      if (!functionName) {
        return;
      }

      await sdk.lambda().invoke({
        FunctionName: functionName,
        // Lambda refuses to take a direct JSON object and requires it to be stringify()'d
        Payload: JSON.stringify({
          RequestType: 'Update',
          ResponseURL: REQUIRED_BY_CFN,
          PhysicalResourceId: REQUIRED_BY_CFN,
          StackId: REQUIRED_BY_CFN,
          RequestId: REQUIRED_BY_CFN,
          LogicalResourceId: REQUIRED_BY_CFN,
          ResourceProperties: stringifyObject(customResourceProperties), // JSON.stringify() doesn't turn the actual objects to strings, but the lambda expects strings
        }),
      }).promise();
    },
  });

  return ret;
}

async function changeIsForS3DeployCustomResourcePolicy(
  iamPolicyLogicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const roles = change.newValue.Properties?.Roles;
  if (!roles) {
    return [{
      hotswappable: false,
      rejectedChanges: ['Roles'],
      logicalId: iamPolicyLogicalId,
      reason: 'This IAM Policy does not have have any Roles',
      resourceType: change.newValue.Type,
    }];
  }

  for (const role of roles) {
    const roleArn = await evaluateCfnTemplate.evaluateCfnExpression(role);
    const roleLogicalId = await evaluateCfnTemplate.findLogicalIdForPhysicalName(roleArn);
    if (!roleLogicalId) {
      return [{
        hotswappable: false,
        reason: `could not find logicalId for role with name '${roleArn}'`,
        rejectedChanges: [],
        logicalId: 'could not be found',
        resourceType: change.newValue.Type,
      }];
    }

    const roleRefs = evaluateCfnTemplate.findReferencesTo(roleLogicalId);
    for (const roleRef of roleRefs) {
      if (roleRef.Type === 'AWS::Lambda::Function') {
        const lambdaRefs = evaluateCfnTemplate.findReferencesTo(roleRef.LogicalId);
        for (const lambdaRef of lambdaRefs) {
          // If S3Deployment -> Lambda -> Role and IAM::Policy -> Role, then this IAM::Policy change is an
          // artifact of old-style synthesis
          if (lambdaRef.Type !== 'Custom::CDKBucketDeployment') {
            return [{
              hotswappable: false,
              reason: `found an AWS::IAM::Policy that has Role '${roleLogicalId}' that is referred to by AWS::Lambda::Function '${roleRef.LogicalId}' that is referred to by ${lambdaRef.Type} '${lambdaRef.LogicalId}', which does not have type 'Custom::CDKBucketDeployment'`,
              rejectedChanges: [],
              logicalId: iamPolicyLogicalId,
              resourceType: change.newValue.Type,
            }];
          }
        }
      } else if (roleRef.Type === 'AWS::IAM::Policy') {
        if (roleRef.LogicalId !== iamPolicyLogicalId) {
          return [{
            hotswappable: false,
            reason: `found an AWS::IAM::Policy that has Role '${roleLogicalId}' that is referred to by AWS::IAM::Policy '${roleRef.LogicalId}' that is not the policy of the s3 bucket deployment`,
            rejectedChanges: [],
            logicalId: roleRef.LogicalId,
            resourceType: change.newValue.Type,
          }];
        }
      } else {
        return [{
          hotswappable: false,
          reason: `found a reference to the role '${roleLogicalId}' that is not of type AWS::Lambda::Function or AWS::IAM::Policy, so the bucket deployment cannot be hotswapped`,
          rejectedChanges: [],
          logicalId: roleRef.LogicalId,
          resourceType: change.newValue.Type,
        }];
      }
    }
  }

  // this doesn't block the hotswap, but it also isn't a hotswappable change by itself. Return
  // an empty change to signify this.
  return [];
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
