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
    try {
        await ec2.revokeSecurityGroupEgress(egressRuleParams(groupId));
    }
    catch (e) {
        if (e.name !== 'InvalidPermission.NotFound') {
            throw (e);
        }
    }
    try {
        await ec2.revokeSecurityGroupIngress(ingressRuleParams(groupId, account));
    }
    catch (e) {
        if (e.name !== 'InvalidPermission.NotFound') {
            throw (e);
        }
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRUFBZ0U7QUFDaEUsMkNBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUU1Qjs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFHekQsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGFBQWEsRUFBRSxDQUFDO2dCQUNkLGdCQUFnQixFQUFFLENBQUM7d0JBQ2pCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixNQUFNLEVBQUUsT0FBTztxQkFDaEIsQ0FBQztnQkFDRixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsT0FBZTtJQUN2QyxPQUFPO1FBQ0wsT0FBTyxFQUFFLE9BQU87UUFDaEIsYUFBYSxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLENBQUM7d0JBQ1QsTUFBTSxFQUFFLFdBQVc7cUJBQ3BCLENBQUM7Z0JBQ0YsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0ksS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUM7SUFDeEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztJQUNqRCxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxXQUFXLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEtBQUssUUFBUTtZQUNYLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLEtBQUssUUFBUTtZQUNYLE9BQU8sY0FBYyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUM7QUFYRCwwQkFXQztBQUNELEtBQUssVUFBVSxRQUFRLENBQUMsS0FBd0Q7SUFDOUUsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDO0lBQ2pFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQztJQUM5RCxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5RCxNQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsT0FBTztBQUNULENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxXQUFXLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFDekQsSUFBSTtRQUNGLE1BQU0sR0FBRyxDQUFDLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDaEU7SUFBQyxPQUFPLENBQU0sRUFBRTtRQUNmLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyw0QkFBNEIsRUFBRTtZQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDWDtLQUNGO0lBQ0QsSUFBSTtRQUNGLE1BQU0sR0FBRyxDQUFDLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQzNFO0lBQUMsT0FBTyxDQUFNLEVBQUU7UUFDZixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssNEJBQTRCLEVBQUU7WUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1g7S0FDRjtJQUNELE9BQU87QUFDVCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsY0FBYyxDQUFDLE9BQWUsRUFBRSxPQUFlO0lBQzVELE1BQU0sR0FBRyxDQUFDLDZCQUE2QixDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sR0FBRyxDQUFDLDRCQUE0QixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEUsT0FBTztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgKiBhcyBzZGsgZnJvbSAnQGF3cy1zZGsvY2xpZW50LWVjMic7XG5cbmNvbnN0IGVjMiA9IG5ldyBzZGsuRUMyKHt9KTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBzZWN1cml0eSBncm91cCBpbmdyZXNzIHJ1bGUuIFRoaXMgY2FuIGJlIHVzZWQgdG8gYm90aCByZXZva2UgYW5kIGF1dGhvcml6ZSB0aGUgcnVsZXNcbiAqL1xuZnVuY3Rpb24gaW5ncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZDogc3RyaW5nLCBhY2NvdW50OiBzdHJpbmcpOlxuc2RrLlJldm9rZVNlY3VyaXR5R3JvdXBJbmdyZXNzQ29tbWFuZElucHV0XG58IHNkay5BdXRob3JpemVTZWN1cml0eUdyb3VwSW5ncmVzc0NvbW1hbmRJbnB1dCB7XG4gIHJldHVybiB7XG4gICAgR3JvdXBJZDogZ3JvdXBJZCxcbiAgICBJcFBlcm1pc3Npb25zOiBbe1xuICAgICAgVXNlcklkR3JvdXBQYWlyczogW3tcbiAgICAgICAgR3JvdXBJZDogZ3JvdXBJZCxcbiAgICAgICAgVXNlcklkOiBhY2NvdW50LFxuICAgICAgfV0sXG4gICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwIGVncmVzcyBydWxlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGJvdGggcmV2b2tlIGFuZCBhdXRob3JpemUgdGhlIHJ1bGVzXG4gKi9cbmZ1bmN0aW9uIGVncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZDogc3RyaW5nKTogc2RrLlJldm9rZVNlY3VyaXR5R3JvdXBFZ3Jlc3NDb21tYW5kSW5wdXQgfCBzZGsuQXV0aG9yaXplU2VjdXJpdHlHcm91cEVncmVzc0NvbW1hbmRJbnB1dCB7XG4gIHJldHVybiB7XG4gICAgR3JvdXBJZDogZ3JvdXBJZCxcbiAgICBJcFBlcm1pc3Npb25zOiBbe1xuICAgICAgSXBSYW5nZXM6IFt7XG4gICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICB9XSxcbiAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgfV0sXG4gIH07XG59XG5cbi8qKlxuICogUHJvY2VzcyBhIGN1c3RvbSByZXNvdXJjZSByZXF1ZXN0IHRvIHJlc3RyaWN0IHRoZSBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwXG4gKiBpbmdyZXNzICYgZWdyZXNzIHJ1bGVzLlxuICpcbiAqIFdoZW4gc29tZW9uZSB0dXJucyBvZmYgdGhlIHByb3BlcnR5IHRoZW4gdGhpcyBjdXN0b20gcmVzb3VyY2Ugd2lsbCBiZSBkZWxldGVkIGluIHdoaWNoXG4gKiBjYXNlIHdlIHNob3VsZCBhZGQgYmFjayB0aGUgcnVsZXMgdGhhdCB3ZXJlIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNlY3VyaXR5R3JvdXBJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBjb25zdCBhY2NvdW50ID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFjY291bnQ7XG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgcmV0dXJuIHJldm9rZVJ1bGVzKHNlY3VyaXR5R3JvdXBJZCwgYWNjb3VudCk7XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybiBvblVwZGF0ZShldmVudCk7XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiBhdXRob3JpemVSdWxlcyhzZWN1cml0eUdyb3VwSWQsIGFjY291bnQpO1xuICB9XG59XG5hc3luYyBmdW5jdGlvbiBvblVwZGF0ZShldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VVcGRhdGVFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBvbGRTZyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBjb25zdCBuZXdTZyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWZhdWx0U2VjdXJpdHlHcm91cElkO1xuICBpZiAob2xkU2cgIT09IG5ld1NnKSB7XG4gICAgYXdhaXQgYXV0aG9yaXplUnVsZXMob2xkU2csIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50KTtcbiAgICBhd2FpdCByZXZva2VSdWxlcyhuZXdTZywgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFjY291bnQpO1xuICB9XG4gIHJldHVybjtcbn1cblxuLyoqXG4gKiBSZXZva2UgYm90aCBpbmdyZXNzIGFuZCBlZ3Jlc3MgcnVsZXNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV2b2tlUnVsZXMoZ3JvdXBJZDogc3RyaW5nLCBhY2NvdW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBlYzIucmV2b2tlU2VjdXJpdHlHcm91cEVncmVzcyhlZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQpKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgaWYgKGUubmFtZSAhPT0gJ0ludmFsaWRQZXJtaXNzaW9uLk5vdEZvdW5kJykge1xuICAgICAgdGhyb3cgKGUpO1xuICAgIH1cbiAgfVxuICB0cnkge1xuICAgIGF3YWl0IGVjMi5yZXZva2VTZWN1cml0eUdyb3VwSW5ncmVzcyhpbmdyZXNzUnVsZVBhcmFtcyhncm91cElkLCBhY2NvdW50KSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGlmIChlLm5hbWUgIT09ICdJbnZhbGlkUGVybWlzc2lvbi5Ob3RGb3VuZCcpIHtcbiAgICAgIHRocm93IChlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuO1xufVxuXG4vKipcbiAqIEF1dGhvcml6ZSBib3RoIGluZ3Jlc3MgYW5kIGVncmVzcyBydWxlc1xuICovXG5hc3luYyBmdW5jdGlvbiBhdXRob3JpemVSdWxlcyhncm91cElkOiBzdHJpbmcsIGFjY291bnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBlYzIuYXV0aG9yaXplU2VjdXJpdHlHcm91cEluZ3Jlc3MoaW5ncmVzc1J1bGVQYXJhbXMoZ3JvdXBJZCwgYWNjb3VudCkpO1xuICBhd2FpdCBlYzIuYXV0aG9yaXplU2VjdXJpdHlHcm91cEVncmVzcyhlZ3Jlc3NSdWxlUGFyYW1zKGdyb3VwSWQpKTtcbiAgcmV0dXJuO1xufVxuIl19