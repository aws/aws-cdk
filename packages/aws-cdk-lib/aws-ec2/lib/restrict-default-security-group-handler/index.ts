/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as sdk from '@aws-sdk/client-ec2';

const ec2 = new sdk.EC2({});

/**
 * The default security group ingress rule. This can be used to both revoke and authorize the rules
 */
function ingressRuleParams(groupId: string, account: string):
sdk.RevokeSecurityGroupIngressCommandInput
| sdk.AuthorizeSecurityGroupIngressCommandInput {
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
function egressRuleParams(groupId: string): sdk.RevokeSecurityGroupEgressCommandInput | sdk.AuthorizeSecurityGroupEgressCommandInput {
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
  try {
    await ec2.revokeSecurityGroupEgress(egressRuleParams(groupId));
  } catch (e: any) {
    if (e.name !== 'InvalidPermission.NotFound') {
      throw (e);
    }
  }
  try {
    await ec2.revokeSecurityGroupIngress(ingressRuleParams(groupId, account));
  } catch (e: any) {
    if (e.name !== 'InvalidPermission.NotFound') {
      throw (e);
    }
  }
  return;
}

/**
 * Authorize both ingress and egress rules
 */
async function authorizeRules(groupId: string, account: string): Promise<void> {
  await ec2.authorizeSecurityGroupIngress(ingressRuleParams(groupId, account));
  await ec2.authorizeSecurityGroupEgress(egressRuleParams(groupId));
  return;
}
