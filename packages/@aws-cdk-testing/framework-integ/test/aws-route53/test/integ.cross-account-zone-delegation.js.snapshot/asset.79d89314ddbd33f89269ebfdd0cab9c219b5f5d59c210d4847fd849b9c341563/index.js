"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const client_route_53_1 = require("@aws-sdk/client-route-53");
// eslint-disable-next-line import/no-extraneous-dependencies
const credential_providers_1 = require("@aws-sdk/credential-providers");
async function handler(event) {
    const resourceProps = event.ResourceProperties;
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return cfnEventHandler(resourceProps, false);
        case 'Delete':
            return cfnEventHandler(resourceProps, true);
    }
}
exports.handler = handler;
async function cfnEventHandler(props, isDeleteEvent) {
    const { AssumeRoleArn, ParentZoneId, ParentZoneName, DelegatedZoneName, DelegatedZoneNameServers, TTL } = props;
    if (!ParentZoneId && !ParentZoneName) {
        throw Error('One of ParentZoneId or ParentZoneName must be specified');
    }
    const timestamp = (new Date()).getTime();
    const route53 = new client_route_53_1.Route53({
        credentials: (0, credential_providers_1.fromTemporaryCredentials)({
            clientConfig: {
                region: route53Region(process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? ''),
            },
            params: {
                RoleArn: AssumeRoleArn,
                RoleSessionName: `cross-account-zone-delegation-${timestamp}`,
            },
        }),
    });
    const parentZoneId = ParentZoneId ?? await getHostedZoneIdByName(ParentZoneName, route53);
    await route53.changeResourceRecordSets({
        HostedZoneId: parentZoneId,
        ChangeBatch: {
            Changes: [{
                    Action: isDeleteEvent ? 'DELETE' : 'UPSERT',
                    ResourceRecordSet: {
                        Name: DelegatedZoneName,
                        Type: 'NS',
                        TTL,
                        ResourceRecords: DelegatedZoneNameServers.map(ns => ({ Value: ns })),
                    },
                }],
        },
    });
}
async function getHostedZoneIdByName(name, route53) {
    const zones = await route53.listHostedZonesByName({ DNSName: name });
    const matchedZones = zones.HostedZones?.filter(zone => zone.Name === `${name}.`) ?? [];
    if (matchedZones && matchedZones.length !== 1) {
        throw Error(`Expected one hosted zone to match the given name but found ${matchedZones.length}`);
    }
    // will always be defined because we throw if length !==1
    return matchedZones[0].Id;
}
/**
 * Return the region that hosts the Route53 endpoint
 *
 * Route53 is a partitional service: the control plane lives in one particular region,
 * which is different for every partition.
 *
 * The SDK knows how to convert a "target region" to a "route53 endpoint", which
 * equates to a (potentially different) region. However, when we use STS
 * AssumeRole credentials, we must grab credentials that will work in that
 * region.
 *
 * By default, STS AssumeRole will call the STS endpoint for the same region
 * as the Lambda runs in. Normally, this is all good. However, when the AssumeRole
 * is used to assume a role in a different account A, the AssumeRole will fail if the
 * Lambda is executing in an an opt-in region R to which account A has not been opted in.
 *
 * To solve this, we will always AssumeRole in the same region as the Route53 call will
 * resolve to.
 */
function route53Region(region) {
    const partitions = {
        'cn': 'cn-northwest-1',
        'us-gov': 'us-gov-west-1',
        'us-iso': 'us-iso-east-1',
        'us-isob': 'us-isob-east-1',
    };
    for (const [prefix, mainRegion] of Object.entries(partitions)) {
        if (region.startsWith(`${prefix}-`)) {
            return mainRegion;
        }
    }
    // Default for commercial partition
    return 'us-east-1';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QsOERBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCx3RUFBeUU7QUFXbEUsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLEtBQUssUUFBUTtZQUNYLE9BQU8sZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUM7QUFWRCwwQkFVQztBQUVELEtBQUssVUFBVSxlQUFlLENBQUMsS0FBeUIsRUFBRSxhQUFzQjtJQUM5RSxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRWhILElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDcEMsTUFBTSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztLQUN4RTtJQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQU8sQ0FBQztRQUMxQixXQUFXLEVBQUUsSUFBQSwrQ0FBd0IsRUFBQztZQUNwQyxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQzthQUN0RjtZQUNELE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsZUFBZSxFQUFFLGlDQUFpQyxTQUFTLEVBQUU7YUFDOUQ7U0FDRixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsTUFBTSxZQUFZLEdBQUcsWUFBWSxJQUFJLE1BQU0scUJBQXFCLENBQUMsY0FBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTNGLE1BQU0sT0FBTyxDQUFDLHdCQUF3QixDQUFDO1FBQ3JDLFlBQVksRUFBRSxZQUFZO1FBQzFCLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUTtvQkFDM0MsaUJBQWlCLEVBQUU7d0JBQ2pCLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxJQUFJO3dCQUNWLEdBQUc7d0JBQ0gsZUFBZSxFQUFFLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDckU7aUJBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxJQUFZLEVBQUUsT0FBZ0I7SUFDakUsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRSxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUV2RixJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM3QyxNQUFNLEtBQUssQ0FBQyw4REFBOEQsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDbEc7SUFFRCx5REFBeUQ7SUFDekQsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDO0FBQzdCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsU0FBUyxhQUFhLENBQUMsTUFBYztJQUNuQyxNQUFNLFVBQVUsR0FBRztRQUNqQixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLFFBQVEsRUFBRSxlQUFlO1FBQ3pCLFFBQVEsRUFBRSxlQUFlO1FBQ3pCLFNBQVMsRUFBRSxnQkFBZ0I7S0FDNUIsQ0FBQztJQUVGLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzdELElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxVQUFVLENBQUM7U0FDbkI7S0FDRjtJQUVELG1DQUFtQztJQUNuQyxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgUm91dGU1MyB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1yb3V0ZS01Myc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBmcm9tVGVtcG9yYXJ5Q3JlZGVudGlhbHMgfSBmcm9tICdAYXdzLXNkay9jcmVkZW50aWFsLXByb3ZpZGVycyc7XG5cbmludGVyZmFjZSBSZXNvdXJjZVByb3BlcnRpZXMge1xuICBBc3N1bWVSb2xlQXJuOiBzdHJpbmcsXG4gIFBhcmVudFpvbmVOYW1lPzogc3RyaW5nLFxuICBQYXJlbnRab25lSWQ/OiBzdHJpbmcsXG4gIERlbGVnYXRlZFpvbmVOYW1lOiBzdHJpbmcsXG4gIERlbGVnYXRlZFpvbmVOYW1lU2VydmVyczogc3RyaW5nW10sXG4gIFRUTDogbnVtYmVyLFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zdCByZXNvdXJjZVByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzIGFzIHVua25vd24gYXMgUmVzb3VyY2VQcm9wZXJ0aWVzO1xuXG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICByZXR1cm4gY2ZuRXZlbnRIYW5kbGVyKHJlc291cmNlUHJvcHMsIGZhbHNlKTtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIGNmbkV2ZW50SGFuZGxlcihyZXNvdXJjZVByb3BzLCB0cnVlKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjZm5FdmVudEhhbmRsZXIocHJvcHM6IFJlc291cmNlUHJvcGVydGllcywgaXNEZWxldGVFdmVudDogYm9vbGVhbikge1xuICBjb25zdCB7IEFzc3VtZVJvbGVBcm4sIFBhcmVudFpvbmVJZCwgUGFyZW50Wm9uZU5hbWUsIERlbGVnYXRlZFpvbmVOYW1lLCBEZWxlZ2F0ZWRab25lTmFtZVNlcnZlcnMsIFRUTCB9ID0gcHJvcHM7XG5cbiAgaWYgKCFQYXJlbnRab25lSWQgJiYgIVBhcmVudFpvbmVOYW1lKSB7XG4gICAgdGhyb3cgRXJyb3IoJ09uZSBvZiBQYXJlbnRab25lSWQgb3IgUGFyZW50Wm9uZU5hbWUgbXVzdCBiZSBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gIGNvbnN0IHJvdXRlNTMgPSBuZXcgUm91dGU1Myh7XG4gICAgY3JlZGVudGlhbHM6IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICBjbGllbnRDb25maWc6IHtcbiAgICAgICAgcmVnaW9uOiByb3V0ZTUzUmVnaW9uKHByb2Nlc3MuZW52LkFXU19SRUdJT04gPz8gcHJvY2Vzcy5lbnYuQVdTX0RFRkFVTFRfUkVHSU9OID8/ICcnKSxcbiAgICAgIH0sXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgUm9sZUFybjogQXNzdW1lUm9sZUFybixcbiAgICAgICAgUm9sZVNlc3Npb25OYW1lOiBgY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24tJHt0aW1lc3RhbXB9YCxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0pO1xuXG4gIGNvbnN0IHBhcmVudFpvbmVJZCA9IFBhcmVudFpvbmVJZCA/PyBhd2FpdCBnZXRIb3N0ZWRab25lSWRCeU5hbWUoUGFyZW50Wm9uZU5hbWUhLCByb3V0ZTUzKTtcblxuICBhd2FpdCByb3V0ZTUzLmNoYW5nZVJlc291cmNlUmVjb3JkU2V0cyh7XG4gICAgSG9zdGVkWm9uZUlkOiBwYXJlbnRab25lSWQsXG4gICAgQ2hhbmdlQmF0Y2g6IHtcbiAgICAgIENoYW5nZXM6IFt7XG4gICAgICAgIEFjdGlvbjogaXNEZWxldGVFdmVudCA/ICdERUxFVEUnIDogJ1VQU0VSVCcsXG4gICAgICAgIFJlc291cmNlUmVjb3JkU2V0OiB7XG4gICAgICAgICAgTmFtZTogRGVsZWdhdGVkWm9uZU5hbWUsXG4gICAgICAgICAgVHlwZTogJ05TJyxcbiAgICAgICAgICBUVEwsXG4gICAgICAgICAgUmVzb3VyY2VSZWNvcmRzOiBEZWxlZ2F0ZWRab25lTmFtZVNlcnZlcnMubWFwKG5zID0+ICh7IFZhbHVlOiBucyB9KSksXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9LFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdGVkWm9uZUlkQnlOYW1lKG5hbWU6IHN0cmluZywgcm91dGU1MzogUm91dGU1Myk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHpvbmVzID0gYXdhaXQgcm91dGU1My5saXN0SG9zdGVkWm9uZXNCeU5hbWUoeyBETlNOYW1lOiBuYW1lIH0pO1xuICBjb25zdCBtYXRjaGVkWm9uZXMgPSB6b25lcy5Ib3N0ZWRab25lcz8uZmlsdGVyKHpvbmUgPT4gem9uZS5OYW1lID09PSBgJHtuYW1lfS5gKSA/PyBbXTtcblxuICBpZiAobWF0Y2hlZFpvbmVzICYmIG1hdGNoZWRab25lcy5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBFcnJvcihgRXhwZWN0ZWQgb25lIGhvc3RlZCB6b25lIHRvIG1hdGNoIHRoZSBnaXZlbiBuYW1lIGJ1dCBmb3VuZCAke21hdGNoZWRab25lcy5sZW5ndGh9YCk7XG4gIH1cblxuICAvLyB3aWxsIGFsd2F5cyBiZSBkZWZpbmVkIGJlY2F1c2Ugd2UgdGhyb3cgaWYgbGVuZ3RoICE9PTFcbiAgcmV0dXJuIG1hdGNoZWRab25lc1swXS5JZCE7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSByZWdpb24gdGhhdCBob3N0cyB0aGUgUm91dGU1MyBlbmRwb2ludFxuICpcbiAqIFJvdXRlNTMgaXMgYSBwYXJ0aXRpb25hbCBzZXJ2aWNlOiB0aGUgY29udHJvbCBwbGFuZSBsaXZlcyBpbiBvbmUgcGFydGljdWxhciByZWdpb24sXG4gKiB3aGljaCBpcyBkaWZmZXJlbnQgZm9yIGV2ZXJ5IHBhcnRpdGlvbi5cbiAqXG4gKiBUaGUgU0RLIGtub3dzIGhvdyB0byBjb252ZXJ0IGEgXCJ0YXJnZXQgcmVnaW9uXCIgdG8gYSBcInJvdXRlNTMgZW5kcG9pbnRcIiwgd2hpY2hcbiAqIGVxdWF0ZXMgdG8gYSAocG90ZW50aWFsbHkgZGlmZmVyZW50KSByZWdpb24uIEhvd2V2ZXIsIHdoZW4gd2UgdXNlIFNUU1xuICogQXNzdW1lUm9sZSBjcmVkZW50aWFscywgd2UgbXVzdCBncmFiIGNyZWRlbnRpYWxzIHRoYXQgd2lsbCB3b3JrIGluIHRoYXRcbiAqIHJlZ2lvbi5cbiAqXG4gKiBCeSBkZWZhdWx0LCBTVFMgQXNzdW1lUm9sZSB3aWxsIGNhbGwgdGhlIFNUUyBlbmRwb2ludCBmb3IgdGhlIHNhbWUgcmVnaW9uXG4gKiBhcyB0aGUgTGFtYmRhIHJ1bnMgaW4uIE5vcm1hbGx5LCB0aGlzIGlzIGFsbCBnb29kLiBIb3dldmVyLCB3aGVuIHRoZSBBc3N1bWVSb2xlXG4gKiBpcyB1c2VkIHRvIGFzc3VtZSBhIHJvbGUgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCBBLCB0aGUgQXNzdW1lUm9sZSB3aWxsIGZhaWwgaWYgdGhlXG4gKiBMYW1iZGEgaXMgZXhlY3V0aW5nIGluIGFuIGFuIG9wdC1pbiByZWdpb24gUiB0byB3aGljaCBhY2NvdW50IEEgaGFzIG5vdCBiZWVuIG9wdGVkIGluLlxuICpcbiAqIFRvIHNvbHZlIHRoaXMsIHdlIHdpbGwgYWx3YXlzIEFzc3VtZVJvbGUgaW4gdGhlIHNhbWUgcmVnaW9uIGFzIHRoZSBSb3V0ZTUzIGNhbGwgd2lsbFxuICogcmVzb2x2ZSB0by5cbiAqL1xuZnVuY3Rpb24gcm91dGU1M1JlZ2lvbihyZWdpb246IHN0cmluZykge1xuICBjb25zdCBwYXJ0aXRpb25zID0ge1xuICAgICdjbic6ICdjbi1ub3J0aHdlc3QtMScsXG4gICAgJ3VzLWdvdic6ICd1cy1nb3Ytd2VzdC0xJyxcbiAgICAndXMtaXNvJzogJ3VzLWlzby1lYXN0LTEnLFxuICAgICd1cy1pc29iJzogJ3VzLWlzb2ItZWFzdC0xJyxcbiAgfTtcblxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIG1haW5SZWdpb25dIG9mIE9iamVjdC5lbnRyaWVzKHBhcnRpdGlvbnMpKSB7XG4gICAgaWYgKHJlZ2lvbi5zdGFydHNXaXRoKGAke3ByZWZpeH0tYCkpIHtcbiAgICAgIHJldHVybiBtYWluUmVnaW9uO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlZmF1bHQgZm9yIGNvbW1lcmNpYWwgcGFydGl0aW9uXG4gIHJldHVybiAndXMtZWFzdC0xJztcbn0iXX0=