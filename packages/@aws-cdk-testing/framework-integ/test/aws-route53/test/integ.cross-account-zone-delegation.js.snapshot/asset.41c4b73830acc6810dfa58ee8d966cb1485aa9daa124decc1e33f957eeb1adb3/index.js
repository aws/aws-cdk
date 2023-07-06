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
            clientConfig: { useGlobalEndpoint: !UseRegionalStsEndpoint },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QsOERBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCx3RUFBeUU7QUFZbEUsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLEtBQUssUUFBUTtZQUNYLE9BQU8sZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUM7QUFWRCwwQkFVQztBQUVELEtBQUssVUFBVSxlQUFlLENBQUMsS0FBeUIsRUFBRSxhQUFzQjtJQUM5RSxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRXhJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDcEMsTUFBTSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztLQUN4RTtJQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQU8sQ0FBQztRQUMxQixXQUFXLEVBQUUsSUFBQSwrQ0FBd0IsRUFBQztZQUNwQyxZQUFZLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQzVELE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsZUFBZSxFQUFFLGlDQUFpQyxTQUFTLEVBQUU7YUFDOUQ7U0FDRixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsTUFBTSxZQUFZLEdBQUcsWUFBWSxJQUFJLE1BQU0scUJBQXFCLENBQUMsY0FBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTNGLE1BQU0sT0FBTyxDQUFDLHdCQUF3QixDQUFDO1FBQ3JDLFlBQVksRUFBRSxZQUFZO1FBQzFCLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUTtvQkFDM0MsaUJBQWlCLEVBQUU7d0JBQ2pCLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxJQUFJO3dCQUNWLEdBQUc7d0JBQ0gsZUFBZSxFQUFFLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDckU7aUJBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxJQUFZLEVBQUUsT0FBZ0I7SUFDakUsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRSxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUV2RixJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM3QyxNQUFNLEtBQUssQ0FBQyw4REFBOEQsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDbEc7SUFFRCx5REFBeUQ7SUFDekQsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDO0FBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBSb3V0ZTUzIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXJvdXRlLTUzJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyB9IGZyb20gJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJztcblxuaW50ZXJmYWNlIFJlc291cmNlUHJvcGVydGllcyB7XG4gIEFzc3VtZVJvbGVBcm46IHN0cmluZyxcbiAgUGFyZW50Wm9uZU5hbWU/OiBzdHJpbmcsXG4gIFBhcmVudFpvbmVJZD86IHN0cmluZyxcbiAgRGVsZWdhdGVkWm9uZU5hbWU6IHN0cmluZyxcbiAgRGVsZWdhdGVkWm9uZU5hbWVTZXJ2ZXJzOiBzdHJpbmdbXSxcbiAgVFRMOiBudW1iZXIsXG4gIFVzZVJlZ2lvbmFsU3RzRW5kcG9pbnQ/OiBzdHJpbmcsXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnN0IHJlc291cmNlUHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMgYXMgdW5rbm93biBhcyBSZXNvdXJjZVByb3BlcnRpZXM7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybiBjZm5FdmVudEhhbmRsZXIocmVzb3VyY2VQcm9wcywgZmFsc2UpO1xuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm4gY2ZuRXZlbnRIYW5kbGVyKHJlc291cmNlUHJvcHMsIHRydWUpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNmbkV2ZW50SGFuZGxlcihwcm9wczogUmVzb3VyY2VQcm9wZXJ0aWVzLCBpc0RlbGV0ZUV2ZW50OiBib29sZWFuKSB7XG4gIGNvbnN0IHsgQXNzdW1lUm9sZUFybiwgUGFyZW50Wm9uZUlkLCBQYXJlbnRab25lTmFtZSwgRGVsZWdhdGVkWm9uZU5hbWUsIERlbGVnYXRlZFpvbmVOYW1lU2VydmVycywgVFRMLCBVc2VSZWdpb25hbFN0c0VuZHBvaW50IH0gPSBwcm9wcztcblxuICBpZiAoIVBhcmVudFpvbmVJZCAmJiAhUGFyZW50Wm9uZU5hbWUpIHtcbiAgICB0aHJvdyBFcnJvcignT25lIG9mIFBhcmVudFpvbmVJZCBvciBQYXJlbnRab25lTmFtZSBtdXN0IGJlIHNwZWNpZmllZCcpO1xuICB9XG5cbiAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgY29uc3Qgcm91dGU1MyA9IG5ldyBSb3V0ZTUzKHtcbiAgICBjcmVkZW50aWFsczogZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzKHtcbiAgICAgIGNsaWVudENvbmZpZzogeyB1c2VHbG9iYWxFbmRwb2ludDogIVVzZVJlZ2lvbmFsU3RzRW5kcG9pbnQgfSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBSb2xlQXJuOiBBc3N1bWVSb2xlQXJuLFxuICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGBjcm9zcy1hY2NvdW50LXpvbmUtZGVsZWdhdGlvbi0ke3RpbWVzdGFtcH1gLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgY29uc3QgcGFyZW50Wm9uZUlkID0gUGFyZW50Wm9uZUlkID8/IGF3YWl0IGdldEhvc3RlZFpvbmVJZEJ5TmFtZShQYXJlbnRab25lTmFtZSEsIHJvdXRlNTMpO1xuXG4gIGF3YWl0IHJvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHBhcmVudFpvbmVJZCxcbiAgICBDaGFuZ2VCYXRjaDoge1xuICAgICAgQ2hhbmdlczogW3tcbiAgICAgICAgQWN0aW9uOiBpc0RlbGV0ZUV2ZW50ID8gJ0RFTEVURScgOiAnVVBTRVJUJyxcbiAgICAgICAgUmVzb3VyY2VSZWNvcmRTZXQ6IHtcbiAgICAgICAgICBOYW1lOiBEZWxlZ2F0ZWRab25lTmFtZSxcbiAgICAgICAgICBUeXBlOiAnTlMnLFxuICAgICAgICAgIFRUTCxcbiAgICAgICAgICBSZXNvdXJjZVJlY29yZHM6IERlbGVnYXRlZFpvbmVOYW1lU2VydmVycy5tYXAobnMgPT4gKHsgVmFsdWU6IG5zIH0pKSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRIb3N0ZWRab25lSWRCeU5hbWUobmFtZTogc3RyaW5nLCByb3V0ZTUzOiBSb3V0ZTUzKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgem9uZXMgPSBhd2FpdCByb3V0ZTUzLmxpc3RIb3N0ZWRab25lc0J5TmFtZSh7IEROU05hbWU6IG5hbWUgfSk7XG4gIGNvbnN0IG1hdGNoZWRab25lcyA9IHpvbmVzLkhvc3RlZFpvbmVzPy5maWx0ZXIoem9uZSA9PiB6b25lLk5hbWUgPT09IGAke25hbWV9LmApID8/IFtdO1xuXG4gIGlmIChtYXRjaGVkWm9uZXMgJiYgbWF0Y2hlZFpvbmVzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IEVycm9yKGBFeHBlY3RlZCBvbmUgaG9zdGVkIHpvbmUgdG8gbWF0Y2ggdGhlIGdpdmVuIG5hbWUgYnV0IGZvdW5kICR7bWF0Y2hlZFpvbmVzLmxlbmd0aH1gKTtcbiAgfVxuXG4gIC8vIHdpbGwgYWx3YXlzIGJlIGRlZmluZWQgYmVjYXVzZSB3ZSB0aHJvdyBpZiBsZW5ndGggIT09MVxuICByZXR1cm4gbWF0Y2hlZFpvbmVzWzBdLklkITtcbn1cbiJdfQ==