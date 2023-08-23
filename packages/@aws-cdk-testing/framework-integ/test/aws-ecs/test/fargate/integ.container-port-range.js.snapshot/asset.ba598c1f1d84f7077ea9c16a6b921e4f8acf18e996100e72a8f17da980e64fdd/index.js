"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const aws_sdk_1 = require("aws-sdk");
const ec2 = new aws_sdk_1.EC2();
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
    await ec2.revokeSecurityGroupEgress(egressRuleParams(groupId)).promise();
    await ec2.revokeSecurityGroupIngress(ingressRuleParams(groupId, account)).promise();
    return;
}
/**
 * Authorize both ingress and egress rules
 */
async function authorizeRules(groupId, account) {
    await ec2.authorizeSecurityGroupIngress(ingressRuleParams(groupId, account)).promise();
    await ec2.authorizeSecurityGroupEgress(egressRuleParams(groupId)).promise();
    return;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QscUNBQThCO0FBRTlCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFFdEI7O0dBRUc7QUFDSCxTQUFTLGlCQUFpQixDQUFDLE9BQWUsRUFBRSxPQUFlO0lBQ3pELE9BQU87UUFDTCxPQUFPLEVBQUUsT0FBTztRQUNoQixhQUFhLEVBQUUsQ0FBQztnQkFDZCxnQkFBZ0IsRUFBRSxDQUFDO3dCQUNqQixPQUFPLEVBQUUsT0FBTzt3QkFDaEIsTUFBTSxFQUFFLE9BQU87cUJBQ2hCLENBQUM7Z0JBQ0YsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLE9BQWU7SUFDdkMsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGFBQWEsRUFBRSxDQUFDO2dCQUNkLFFBQVEsRUFBRSxDQUFDO3dCQUNULE1BQU0sRUFBRSxXQUFXO3FCQUNwQixDQUFDO2dCQUNGLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUM7S0FDSCxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNJLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7SUFDOUUsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7SUFDakQsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUTtZQUNYLE9BQU8sV0FBVyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFLLFFBQVE7WUFDWCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixLQUFLLFFBQVE7WUFDWCxPQUFPLGNBQWMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbkQ7QUFDSCxDQUFDO0FBWEQsMEJBV0M7QUFDRCxLQUFLLFVBQVUsUUFBUSxDQUFDLEtBQXdEO0lBQzlFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQztJQUNqRSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUM7SUFDOUQsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO1FBQ25CLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUQsTUFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM1RDtJQUNELE9BQU87QUFDVCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsV0FBVyxDQUFDLE9BQWUsRUFBRSxPQUFlO0lBQ3pELE1BQU0sR0FBRyxDQUFDLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekUsTUFBTSxHQUFHLENBQUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEYsT0FBTztBQUNULENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxjQUFjLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFDNUQsTUFBTSxHQUFHLENBQUMsNkJBQTZCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkYsTUFBTSxHQUFHLENBQUMsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1RSxPQUFPO0FBQ1QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEVDMiB9IGZyb20gJ2F3cy1zZGsnO1xuXG5jb25zdCBlYzIgPSBuZXcgRUMyKCk7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgc2VjdXJpdHkgZ3JvdXAgaW5ncmVzcyBydWxlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGJvdGggcmV2b2tlIGFuZCBhdXRob3JpemUgdGhlIHJ1bGVzXG4gKi9cbmZ1bmN0aW9uIGluZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQ6IHN0cmluZywgYWNjb3VudDogc3RyaW5nKTogRUMyLlJldm9rZVNlY3VyaXR5R3JvdXBJbmdyZXNzUmVxdWVzdCB8IEVDMi5BdXRob3JpemVTZWN1cml0eUdyb3VwSW5ncmVzc1JlcXVlc3Qge1xuICByZXR1cm4ge1xuICAgIEdyb3VwSWQ6IGdyb3VwSWQsXG4gICAgSXBQZXJtaXNzaW9uczogW3tcbiAgICAgIFVzZXJJZEdyb3VwUGFpcnM6IFt7XG4gICAgICAgIEdyb3VwSWQ6IGdyb3VwSWQsXG4gICAgICAgIFVzZXJJZDogYWNjb3VudCxcbiAgICAgIH1dLFxuICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICB9XSxcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBzZWN1cml0eSBncm91cCBlZ3Jlc3MgcnVsZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBib3RoIHJldm9rZSBhbmQgYXV0aG9yaXplIHRoZSBydWxlc1xuICovXG5mdW5jdGlvbiBlZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQ6IHN0cmluZyk6IEVDMi5SZXZva2VTZWN1cml0eUdyb3VwRWdyZXNzUmVxdWVzdCB8IEVDMi5BdXRob3JpemVTZWN1cml0eUdyb3VwRWdyZXNzUmVxdWVzdCB7XG4gIHJldHVybiB7XG4gICAgR3JvdXBJZDogZ3JvdXBJZCxcbiAgICBJcFBlcm1pc3Npb25zOiBbe1xuICAgICAgSXBSYW5nZXM6IFt7XG4gICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICB9XSxcbiAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgfV0sXG4gIH07XG59XG5cbi8qKlxuICogUHJvY2VzcyBhIGN1c3RvbSByZXNvdXJjZSByZXF1ZXN0IHRvIHJlc3RyaWN0IHRoZSBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwXG4gKiBpbmdyZXNzICYgZWdyZXNzIHJ1bGVzLlxuICpcbiAqIFdoZW4gc29tZW9uZSB0dXJucyBvZmYgdGhlIHByb3BlcnR5IHRoZW4gdGhpcyBjdXN0b20gcmVzb3VyY2Ugd2lsbCBiZSBkZWxldGVkIGluIHdoaWNoXG4gKiBjYXNlIHdlIHNob3VsZCBhZGQgYmFjayB0aGUgcnVsZXMgdGhhdCB3ZXJlIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNlY3VyaXR5R3JvdXBJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBjb25zdCBhY2NvdW50ID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFjY291bnQ7XG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgcmV0dXJuIHJldm9rZVJ1bGVzKHNlY3VyaXR5R3JvdXBJZCwgYWNjb3VudCk7XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybiBvblVwZGF0ZShldmVudCk7XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiBhdXRob3JpemVSdWxlcyhzZWN1cml0eUdyb3VwSWQsIGFjY291bnQpO1xuICB9XG59XG5hc3luYyBmdW5jdGlvbiBvblVwZGF0ZShldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VVcGRhdGVFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBvbGRTZyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBjb25zdCBuZXdTZyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBpZiAob2xkU2cgIT09IG5ld1NnKSB7XG4gICAgYXdhaXQgYXV0aG9yaXplUnVsZXMob2xkU2csIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50KTtcbiAgICBhd2FpdCByZXZva2VSdWxlcyhuZXdTZywgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFjY291bnQpO1xuICB9XG4gIHJldHVybjtcbn1cblxuLyoqXG4gKiBSZXZva2UgYm90aCBpbmdyZXNzIGFuZCBlZ3Jlc3MgcnVsZXNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV2b2tlUnVsZXMoZ3JvdXBJZDogc3RyaW5nLCBhY2NvdW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgZWMyLnJldm9rZVNlY3VyaXR5R3JvdXBFZ3Jlc3MoZWdyZXNzUnVsZVBhcmFtcyhncm91cElkKSkucHJvbWlzZSgpO1xuICBhd2FpdCBlYzIucmV2b2tlU2VjdXJpdHlHcm91cEluZ3Jlc3MoaW5ncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCwgYWNjb3VudCkpLnByb21pc2UoKTtcbiAgcmV0dXJuO1xufVxuXG4vKipcbiAqIEF1dGhvcml6ZSBib3RoIGluZ3Jlc3MgYW5kIGVncmVzcyBydWxlc1xuICovXG5hc3luYyBmdW5jdGlvbiBhdXRob3JpemVSdWxlcyhncm91cElkOiBzdHJpbmcsIGFjY291bnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBlYzIuYXV0aG9yaXplU2VjdXJpdHlHcm91cEluZ3Jlc3MoaW5ncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCwgYWNjb3VudCkpLnByb21pc2UoKTtcbiAgYXdhaXQgZWMyLmF1dGhvcml6ZVNlY3VyaXR5R3JvdXBFZ3Jlc3MoZWdyZXNzUnVsZVBhcmFtcyhncm91cElkKSkucHJvbWlzZSgpO1xuICByZXR1cm47XG59XG4iXX0=