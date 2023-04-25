// eslint-disable-next-line import/no-extraneous-dependencies
import { EC2 } from 'aws-sdk';

const ec2 = new EC2();

/**
 * The default security group ingress rule. This can be used to both revoke and authorize the rules
 */
function ingressRuleParams(groupId: string, account: string): EC2.RevokeSecurityGroupIngressRequest | EC2.AuthorizeSecurityGroupIngressRequest {
  return {
    GroupId: groupId,
    IpPermissions: [{
      UserIdGroupPairs: [{
        GroupId: groupId,
        UserId: account,
      }],
      IpProtocol: '-1',
    }],
  };
}

/**
 * The default security group egress rule. This can be used to both revoke and authorize the rules
 */
function egressRuleParams(groupId: string): EC2.RevokeSecurityGroupEgressRequest | EC2.AuthorizeSecurityGroupEgressRequest {
  return {
    GroupId: groupId,
    IpPermissions: [{
      IpRanges: [{
        CidrIp: '0.0.0.0/0',
      }],
      IpProtocol: '-1',
    }],
  };
}

/**
 * Process a custom resource request to restrict the default security group
 * ingress & egress rules.
 *
 * When someone turns off the property then this custom resource will be deleted in which
 * case we should add back the rules that were removed.
 */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<void> {
  const securityGroupId = event.ResourceProperties.DefaultSecurityGroupId;
  const account = event.ResourceProperties.Account;
  switch (event.RequestType) {
    case 'Create':
      return revokeRules(securityGroupId, account);
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return authorizeRules(securityGroupId, account);
  }
}
async function onUpdate(event: AWSLambda.CloudFormationCustomResourceUpdateEvent): Promise<void> {
  const oldSg = event.OldResourceProperties.DefaultSecurityGroupId;
  const newSg = event.ResourceProperties.DefaultSecurityGroupId;
  if (oldSg !== newSg) {
    await authorizeRules(oldSg, event.ResourceProperties.Account);
    await revokeRules(newSg, event.ResourceProperties.Account);
  }
  return;
}

/**
 * Revoke both ingress and egress rules
 */
async function revokeRules(groupId: string, account: string): Promise<void> {
  await ec2.revokeSecurityGroupEgress(egressRuleParams(groupId)).promise();
  await ec2.revokeSecurityGroupIngress(ingressRuleParams(groupId, account)).promise();
  return;
}

/**
 * Authorize both ingress and egress rules
 */
async function authorizeRules(groupId: string, account: string): Promise<void> {
  await ec2.authorizeSecurityGroupIngress(ingressRuleParams(groupId, account)).promise();
  await ec2.authorizeSecurityGroupEgress(egressRuleParams(groupId)).promise();
  return;
}
