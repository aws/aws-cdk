import { ChangeHotswapResult, HotswappableChangeCandidate } from './common';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

/**
 * This means that the value is required to exist by CloudFormation's Custom Resource API (or our S3 Bucket Deployment Lambda's API)
 * but the actual value specified is irrelevant
 */
export const REQUIRED_BY_CFN = 'required-to-be-present-by-cfn';

export async function isHotswappableS3BucketDeploymentChange(
  _logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  // In old-style synthesis, the policy used by the lambda to copy assets Ref's the assets directly,
  // meaning that the changes made to the Policy are artifacts that can be safely ignored
  const ret: ChangeHotswapResult = [];

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

export async function skipChangeForS3DeployCustomResourcePolicy(
  iamPolicyLogicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<boolean> {
  if (change.newValue.Type !== 'AWS::IAM::Policy') {
    return false;
  }
  const roles: string[] = change.newValue.Properties?.Roles;

  // If no roles are referenced, the policy is definitely not used for a S3Deployment
  if (!roles || !roles.length) {
    return false;
  }

  // Check if every role this policy is referenced by is only used for a S3Deployment
  for (const role of roles) {
    const roleArn = await evaluateCfnTemplate.evaluateCfnExpression(role);
    const roleLogicalId = await evaluateCfnTemplate.findLogicalIdForPhysicalName(roleArn);

    // We must assume this role is used for something else, because we can't check it
    if (!roleLogicalId) {
      return false;
    }

    // Find all interesting reference to the role
    const roleRefs = evaluateCfnTemplate.findReferencesTo(roleLogicalId)
      // we are not interested in the reference from the original policy - it always exists
      .filter(roleRef => !(roleRef.Type == 'AWS::IAM::Policy' && roleRef.LogicalId === iamPolicyLogicalId));

    // Check if the role is only used for S3Deployment
    // We know this is the case, if S3Deployment -> Lambda -> Role is satisfied for every reference
    // And we have at least one reference.
    const isRoleOnlyForS3Deployment = roleRefs.length >= 1 && roleRefs.every(roleRef => {
      if (roleRef.Type === 'AWS::Lambda::Function') {
        const lambdaRefs = evaluateCfnTemplate.findReferencesTo(roleRef.LogicalId);
        // Every reference must be to the custom resource and at least one reference must be present
        return lambdaRefs.length >= 1 && lambdaRefs.every(lambdaRef => lambdaRef.Type === 'Custom::CDKBucketDeployment');
      }
      return false;
    });

    // We have determined this role is used for something else, so we can't skip the change
    if (!isRoleOnlyForS3Deployment) {
      return false;
    }
  }

  // We have checked that any use of this policy is only for S3Deployment and we can safely skip it
  return true;
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
