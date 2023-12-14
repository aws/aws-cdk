"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* eslint-disable-next-line import/no-extraneous-dependencies */
const sdk = require("@aws-sdk/client-ec2");
const ec2 = new sdk.EC2({});
/**
 * The default security group ingress rule. This can be used to both revoke and authorize the rules
 */
function ingressRuleParams(groupId, account) {
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
function egressRuleParams(groupId) {
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
async function handler(event) {
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
exports.handler = handler;
async function onUpdate(event) {
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
async function revokeRules(groupId, account) {
    await ec2.revokeSecurityGroupEgress(egressRuleParams(groupId));
    await ec2.revokeSecurityGroupIngress(ingressRuleParams(groupId, account));
    return;
}
/**
 * Authorize both ingress and egress rules
 */
async function authorizeRules(groupId, account) {
    await ec2.authorizeSecurityGroupIngress(ingressRuleParams(groupId, account));
    await ec2.authorizeSecurityGroupEgress(egressRuleParams(groupId));
    return;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBZ0U7QUFDaEUsMkNBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUU1Qjs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFHekQsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGFBQWEsRUFBRSxDQUFDO2dCQUNkLGdCQUFnQixFQUFFLENBQUM7d0JBQ2pCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixNQUFNLEVBQUUsT0FBTztxQkFDaEIsQ0FBQztnQkFDRixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsT0FBZTtJQUN2QyxPQUFPO1FBQ0wsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLENBQUM7d0JBQ1QsTUFBTSxFQUFFLFdBQVc7cUJBQ3BCLENBQUM7Z0JBQ0YsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0ksS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUM7SUFDeEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztJQUNqRCxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxXQUFXLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEtBQUssUUFBUTtZQUNYLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLEtBQUssUUFBUTtZQUNYLE9BQU8sY0FBYyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUM7QUFYRCwwQkFXQztBQUNELEtBQUssVUFBVSxRQUFRLENBQUMsS0FBd0Q7SUFDOUUsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDO0lBQ2pFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQztJQUM5RCxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5RCxNQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsT0FBTztBQUNULENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxXQUFXLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFDekQsTUFBTSxHQUFHLENBQUMseUJBQXlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvRCxNQUFNLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMxRSxPQUFPO0FBQ1QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGNBQWMsQ0FBQyxPQUFlLEVBQUUsT0FBZTtJQUM1RCxNQUFNLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM3RSxNQUFNLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLE9BQU87QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0ICogYXMgc2RrIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1lYzInO1xuXG5jb25zdCBlYzIgPSBuZXcgc2RrLkVDMih7fSk7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgc2VjdXJpdHkgZ3JvdXAgaW5ncmVzcyBydWxlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGJvdGggcmV2b2tlIGFuZCBhdXRob3JpemUgdGhlIHJ1bGVzXG4gKi9cbmZ1bmN0aW9uIGluZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQ6IHN0cmluZywgYWNjb3VudDogc3RyaW5nKTpcbnNkay5SZXZva2VTZWN1cml0eUdyb3VwSW5ncmVzc0NvbW1hbmRJbnB1dFxufCBzZGsuQXV0aG9yaXplU2VjdXJpdHlHcm91cEluZ3Jlc3NDb21tYW5kSW5wdXQge1xuICByZXR1cm4ge1xuICAgIEdyb3VwSWQ6IGdyb3VwSWQsXG4gICAgSXBQZXJtaXNzaW9uczogW3tcbiAgICAgIFVzZXJJZEdyb3VwUGFpcnM6IFt7XG4gICAgICAgIEdyb3VwSWQ6IGdyb3VwSWQsXG4gICAgICAgIFVzZXJJZDogYWNjb3VudCxcbiAgICAgIH1dLFxuICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICB9XSxcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBzZWN1cml0eSBncm91cCBlZ3Jlc3MgcnVsZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBib3RoIHJldm9rZSBhbmQgYXV0aG9yaXplIHRoZSBydWxlc1xuICovXG5mdW5jdGlvbiBlZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQ6IHN0cmluZyk6IHNkay5SZXZva2VTZWN1cml0eUdyb3VwRWdyZXNzQ29tbWFuZElucHV0IHwgc2RrLkF1dGhvcml6ZVNlY3VyaXR5R3JvdXBFZ3Jlc3NDb21tYW5kSW5wdXQge1xuICByZXR1cm4ge1xuICAgIEdyb3VwSWQ6IGdyb3VwSWQsXG4gICAgSXBQZXJtaXNzaW9uczogW3tcbiAgICAgIElwUmFuZ2VzOiBbe1xuICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgfV0sXG4gICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFByb2Nlc3MgYSBjdXN0b20gcmVzb3VyY2UgcmVxdWVzdCB0byByZXN0cmljdCB0aGUgZGVmYXVsdCBzZWN1cml0eSBncm91cFxuICogaW5ncmVzcyAmIGVncmVzcyBydWxlcy5cbiAqXG4gKiBXaGVuIHNvbWVvbmUgdHVybnMgb2ZmIHRoZSBwcm9wZXJ0eSB0aGVuIHRoaXMgY3VzdG9tIHJlc291cmNlIHdpbGwgYmUgZGVsZXRlZCBpbiB3aGljaFxuICogY2FzZSB3ZSBzaG91bGQgYWRkIGJhY2sgdGhlIHJ1bGVzIHRoYXQgd2VyZSByZW1vdmVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzZWN1cml0eUdyb3VwSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVmYXVsdFNlY3VyaXR5R3JvdXBJZDtcbiAgY29uc3QgYWNjb3VudCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50O1xuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIHJldHVybiByZXZva2VSdWxlcyhzZWN1cml0eUdyb3VwSWQsIGFjY291bnQpO1xuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICByZXR1cm4gb25VcGRhdGUoZXZlbnQpO1xuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm4gYXV0aG9yaXplUnVsZXMoc2VjdXJpdHlHcm91cElkLCBhY2NvdW50KTtcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24gb25VcGRhdGUoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlVXBkYXRlRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgb2xkU2cgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMuRGVmYXVsdFNlY3VyaXR5R3JvdXBJZDtcbiAgY29uc3QgbmV3U2cgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVmYXVsdFNlY3VyaXR5R3JvdXBJZDtcbiAgaWYgKG9sZFNnICE9PSBuZXdTZykge1xuICAgIGF3YWl0IGF1dGhvcml6ZVJ1bGVzKG9sZFNnLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQWNjb3VudCk7XG4gICAgYXdhaXQgcmV2b2tlUnVsZXMobmV3U2csIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50KTtcbiAgfVxuICByZXR1cm47XG59XG5cbi8qKlxuICogUmV2b2tlIGJvdGggaW5ncmVzcyBhbmQgZWdyZXNzIHJ1bGVzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJldm9rZVJ1bGVzKGdyb3VwSWQ6IHN0cmluZywgYWNjb3VudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGVjMi5yZXZva2VTZWN1cml0eUdyb3VwRWdyZXNzKGVncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCkpO1xuICBhd2FpdCBlYzIucmV2b2tlU2VjdXJpdHlHcm91cEluZ3Jlc3MoaW5ncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCwgYWNjb3VudCkpO1xuICByZXR1cm47XG59XG5cbi8qKlxuICogQXV0aG9yaXplIGJvdGggaW5ncmVzcyBhbmQgZWdyZXNzIHJ1bGVzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGF1dGhvcml6ZVJ1bGVzKGdyb3VwSWQ6IHN0cmluZywgYWNjb3VudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGVjMi5hdXRob3JpemVTZWN1cml0eUdyb3VwSW5ncmVzcyhpbmdyZXNzUnVsZVBhcmFtcyhncm91cElkLCBhY2NvdW50KSk7XG4gIGF3YWl0IGVjMi5hdXRob3JpemVTZWN1cml0eUdyb3VwRWdyZXNzKGVncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCkpO1xuICByZXR1cm47XG59XG4iXX0=