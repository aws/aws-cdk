import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, HotswappableChangeCandidate } from './common';

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
  const ret: ChangeHotswapResult = [];
  if (change.newValue.Type === 'AWS::IAM::Policy') {
    return changeIsForS3DeployCustomResourcePolicy(logicalId, change, evaluateCfnTemplate);
  }

  if (change.newValue.Type !== 'Custom::CDKBucketDeployment') {
    return [];
  }

  // no classification to be done here; all the properties of this custom resource thing are hotswappable
  ret.push({
    hotswappable: true,
    resourceType: change.newValue.Type,
    propsChanged: ['*'],
    service: 'custom-s3-deployment',
    resourceNames: ['blah'], //TODO: this will probably have to be resovled during `apply()` somehow
    apply: async (sdk: ISDK) => {
      // note that this gives the ARN of the lambda, not the name. This is fine though, the invoke() sdk call will take either
      const functionName = await evaluateCfnTemplate.evaluateCfnExpression(change.newValue.Properties?.ServiceToken);
      if (!functionName) {
        return;
      }

      const customResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression({
        ...change.newValue.Properties,
        ServiceToken: undefined,
      });
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

/*class S3BucketDeploymentHotswapOperation implements HotswapOperation {
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
*/

async function changeIsForS3DeployCustomResourcePolicy(
  iamPolicyLogicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const roles = change.newValue.Properties?.Roles;
  if (!roles) {
    return [{
      hotswappable: false,
      reason: 'WTF IS THIS',
      rejectedChanges: ['Roles'],
      resourceType: change.newValue.Type,
    }];
  }

  for (const role of roles) {
    const roleArn = await evaluateCfnTemplate.evaluateCfnExpression(role);
    const roleLogicalId = await evaluateCfnTemplate.findLogicalIdForPhysicalName(roleArn);
    if (!roleLogicalId) {
      return [{
        hotswappable: false,
        reason: `could not find logicalId for role with name ${roleArn}`,
        rejectedChanges: ['Roles'],
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
              reason: `found an AWS::Lambda::Function with LogicalId ${roleRef.LogicalId} that is referred to by ${lambdaRef.LogicalId} which does not have type 'Custom::CDKBucketDeployment'`,
              rejectedChanges: ['Roles'],
              resourceType: change.newValue.Type,
            }];
          }
        }
      } else if (roleRef.Type === 'AWS::IAM::Policy') {
        if (roleRef.LogicalId !== iamPolicyLogicalId) {
          return [{
            hotswappable: false,
            reason: `found an AWS::IAM::Policy with LogicalId ${roleRef.LogicalId} which refers to ${roleLogicalId} but is not the policy of the s3 bucket deployment`,
            rejectedChanges: ['Roles'],
            resourceType: change.newValue.Type,
          }];
        }
      } else {
        return [{
          hotswappable: false,
          reason: `found a reference to the role with logicalId ${roleLogicalId} that is not of type AWS::Lambda::Function or AWS::IAM::Policy, so this cannot be hotswapped`,
          rejectedChanges: ['Roles'],
          resourceType: change.newValue.Type,
        }];
      }
    }
  }

  // this doesn't block the hotswap, but it also isn't a hotswappable change by itself. Return
  // an empty change to signify this.
  return [{
    hotswappable: true,
    resourceType: 'AWS::IAM::Policy',
    resourceNames: [],
    propsChanged: [],
    service: 'iam',
    apply: async (_sdk: ISDK) => {},
  }];
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
