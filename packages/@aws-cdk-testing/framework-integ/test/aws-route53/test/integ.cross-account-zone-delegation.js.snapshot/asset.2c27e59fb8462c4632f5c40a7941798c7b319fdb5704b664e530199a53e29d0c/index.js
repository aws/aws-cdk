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
    const { AssumeRoleArn, ParentZoneId, ParentZoneName, DelegatedZoneName, DelegatedZoneNameServers, TTL, UseRegionalStsEndpoint } = props;
    if (!ParentZoneId && !ParentZoneName) {
        throw Error('One of ParentZoneId or ParentZoneName must be specified');
    }
    const timestamp = (new Date()).getTime();
    const route53 = new client_route_53_1.Route53({
        credentials: (0, credential_providers_1.fromTemporaryCredentials)({
            clientConfig: {
                useGlobalEndpoint: !UseRegionalStsEndpoint,
                region: 'us-east-1', // hardcoding is one option to avoid denied permission errors
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QsOERBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCx3RUFBeUU7QUFZbEUsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLEtBQUssUUFBUTtZQUNYLE9BQU8sZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUM7QUFWRCwwQkFVQztBQUVELEtBQUssVUFBVSxlQUFlLENBQUMsS0FBeUIsRUFBRSxhQUFzQjtJQUM5RSxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRXhJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDcEMsTUFBTSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztLQUN4RTtJQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQU8sQ0FBQztRQUMxQixXQUFXLEVBQUUsSUFBQSwrQ0FBd0IsRUFBQztZQUNwQyxZQUFZLEVBQUU7Z0JBQ1osaUJBQWlCLEVBQUUsQ0FBQyxzQkFBc0I7Z0JBQzFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsNkRBQTZEO2FBQ25GO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixlQUFlLEVBQUUsaUNBQWlDLFNBQVMsRUFBRTthQUM5RDtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxNQUFNLFlBQVksR0FBRyxZQUFZLElBQUksTUFBTSxxQkFBcUIsQ0FBQyxjQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFM0YsTUFBTSxPQUFPLENBQUMsd0JBQXdCLENBQUM7UUFDckMsWUFBWSxFQUFFLFlBQVk7UUFDMUIsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLENBQUM7b0JBQ1IsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRO29CQUMzQyxpQkFBaUIsRUFBRTt3QkFDakIsSUFBSSxFQUFFLGlCQUFpQjt3QkFDdkIsSUFBSSxFQUFFLElBQUk7d0JBQ1YsR0FBRzt3QkFDSCxlQUFlLEVBQUUsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNyRTtpQkFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLElBQVksRUFBRSxPQUFnQjtJQUNqRSxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRXZGLElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzdDLE1BQU0sS0FBSyxDQUFDLDhEQUE4RCxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUNsRztJQUVELHlEQUF5RDtJQUN6RCxPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFHLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFJvdXRlNTMgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtcm91dGUtNTMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzIH0gZnJvbSAnQGF3cy1zZGsvY3JlZGVudGlhbC1wcm92aWRlcnMnO1xuXG5pbnRlcmZhY2UgUmVzb3VyY2VQcm9wZXJ0aWVzIHtcbiAgQXNzdW1lUm9sZUFybjogc3RyaW5nLFxuICBQYXJlbnRab25lTmFtZT86IHN0cmluZyxcbiAgUGFyZW50Wm9uZUlkPzogc3RyaW5nLFxuICBEZWxlZ2F0ZWRab25lTmFtZTogc3RyaW5nLFxuICBEZWxlZ2F0ZWRab25lTmFtZVNlcnZlcnM6IHN0cmluZ1tdLFxuICBUVEw6IG51bWJlcixcbiAgVXNlUmVnaW9uYWxTdHNFbmRwb2ludD86IHN0cmluZyxcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcmVzb3VyY2VQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcyBhcyB1bmtub3duIGFzIFJlc291cmNlUHJvcGVydGllcztcblxuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgcmV0dXJuIGNmbkV2ZW50SGFuZGxlcihyZXNvdXJjZVByb3BzLCBmYWxzZSk7XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiBjZm5FdmVudEhhbmRsZXIocmVzb3VyY2VQcm9wcywgdHJ1ZSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2ZuRXZlbnRIYW5kbGVyKHByb3BzOiBSZXNvdXJjZVByb3BlcnRpZXMsIGlzRGVsZXRlRXZlbnQ6IGJvb2xlYW4pIHtcbiAgY29uc3QgeyBBc3N1bWVSb2xlQXJuLCBQYXJlbnRab25lSWQsIFBhcmVudFpvbmVOYW1lLCBEZWxlZ2F0ZWRab25lTmFtZSwgRGVsZWdhdGVkWm9uZU5hbWVTZXJ2ZXJzLCBUVEwsIFVzZVJlZ2lvbmFsU3RzRW5kcG9pbnQgfSA9IHByb3BzO1xuXG4gIGlmICghUGFyZW50Wm9uZUlkICYmICFQYXJlbnRab25lTmFtZSkge1xuICAgIHRocm93IEVycm9yKCdPbmUgb2YgUGFyZW50Wm9uZUlkIG9yIFBhcmVudFpvbmVOYW1lIG11c3QgYmUgc3BlY2lmaWVkJyk7XG4gIH1cblxuICBjb25zdCB0aW1lc3RhbXAgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICBjb25zdCByb3V0ZTUzID0gbmV3IFJvdXRlNTMoe1xuICAgIGNyZWRlbnRpYWxzOiBmcm9tVGVtcG9yYXJ5Q3JlZGVudGlhbHMoe1xuICAgICAgY2xpZW50Q29uZmlnOiB7XG4gICAgICAgIHVzZUdsb2JhbEVuZHBvaW50OiAhVXNlUmVnaW9uYWxTdHNFbmRwb2ludCxcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJywgLy8gaGFyZGNvZGluZyBpcyBvbmUgb3B0aW9uIHRvIGF2b2lkIGRlbmllZCBwZXJtaXNzaW9uIGVycm9yc1xuICAgICAgfSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBSb2xlQXJuOiBBc3N1bWVSb2xlQXJuLFxuICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGBjcm9zcy1hY2NvdW50LXpvbmUtZGVsZWdhdGlvbi0ke3RpbWVzdGFtcH1gLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgY29uc3QgcGFyZW50Wm9uZUlkID0gUGFyZW50Wm9uZUlkID8/IGF3YWl0IGdldEhvc3RlZFpvbmVJZEJ5TmFtZShQYXJlbnRab25lTmFtZSEsIHJvdXRlNTMpO1xuXG4gIGF3YWl0IHJvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHBhcmVudFpvbmVJZCxcbiAgICBDaGFuZ2VCYXRjaDoge1xuICAgICAgQ2hhbmdlczogW3tcbiAgICAgICAgQWN0aW9uOiBpc0RlbGV0ZUV2ZW50ID8gJ0RFTEVURScgOiAnVVBTRVJUJyxcbiAgICAgICAgUmVzb3VyY2VSZWNvcmRTZXQ6IHtcbiAgICAgICAgICBOYW1lOiBEZWxlZ2F0ZWRab25lTmFtZSxcbiAgICAgICAgICBUeXBlOiAnTlMnLFxuICAgICAgICAgIFRUTCxcbiAgICAgICAgICBSZXNvdXJjZVJlY29yZHM6IERlbGVnYXRlZFpvbmVOYW1lU2VydmVycy5tYXAobnMgPT4gKHsgVmFsdWU6IG5zIH0pKSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRIb3N0ZWRab25lSWRCeU5hbWUobmFtZTogc3RyaW5nLCByb3V0ZTUzOiBSb3V0ZTUzKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgem9uZXMgPSBhd2FpdCByb3V0ZTUzLmxpc3RIb3N0ZWRab25lc0J5TmFtZSh7IEROU05hbWU6IG5hbWUgfSk7XG4gIGNvbnN0IG1hdGNoZWRab25lcyA9IHpvbmVzLkhvc3RlZFpvbmVzPy5maWx0ZXIoem9uZSA9PiB6b25lLk5hbWUgPT09IGAke25hbWV9LmApID8/IFtdO1xuXG4gIGlmIChtYXRjaGVkWm9uZXMgJiYgbWF0Y2hlZFpvbmVzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IEVycm9yKGBFeHBlY3RlZCBvbmUgaG9zdGVkIHpvbmUgdG8gbWF0Y2ggdGhlIGdpdmVuIG5hbWUgYnV0IGZvdW5kICR7bWF0Y2hlZFpvbmVzLmxlbmd0aH1gKTtcbiAgfVxuXG4gIC8vIHdpbGwgYWx3YXlzIGJlIGRlZmluZWQgYmVjYXVzZSB3ZSB0aHJvdyBpZiBsZW5ndGggIT09MVxuICByZXR1cm4gbWF0Y2hlZFpvbmVzWzBdLklkITtcbn0iXX0=