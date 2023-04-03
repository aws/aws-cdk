"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockListResourceRecordSetsResponse = jest.fn();
const mockChangeResourceRecordSetsResponse = jest.fn();
const mockRoute53 = {
    listResourceRecordSets: jest.fn().mockReturnValue({
        promise: mockListResourceRecordSetsResponse,
    }),
    changeResourceRecordSets: jest.fn().mockReturnValue({
        promise: mockChangeResourceRecordSetsResponse,
    }),
    waitFor: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
    }),
};
jest.mock('aws-sdk', () => {
    return {
        Route53: jest.fn(() => mockRoute53),
    };
});
const delete_existing_record_set_handler_1 = require("../lib/delete-existing-record-set-handler");
const event = {
    RequestType: 'Create',
    ServiceToken: 'service-token',
    ResponseURL: 'response-url',
    StackId: 'stack-id',
    RequestId: 'request-id',
    LogicalResourceId: 'logical-resource-id',
    ResourceType: 'Custom::DeleteExistingRecordSet',
    ResourceProperties: {
        ServiceToken: 'service-token',
        HostedZoneId: 'hosted-zone-id',
        RecordName: 'dev.cdk.aws.',
        RecordType: 'A',
    },
};
beforeEach(() => {
    jest.clearAllMocks();
});
test('create request with existing record', async () => {
    mockListResourceRecordSetsResponse.mockResolvedValueOnce({
        ResourceRecordSets: [
            {
                Name: 'dev.cdk.aws.',
                Type: 'A',
                TTL: 900,
            },
            {
                Name: 'dev.cdk.aws.',
                Type: 'AAAA',
                TTL: 900,
            },
        ],
    });
    mockChangeResourceRecordSetsResponse.mockResolvedValueOnce({
        ChangeInfo: {
            Id: 'change-id',
        },
    });
    await delete_existing_record_set_handler_1.handler(event);
    expect(mockRoute53.listResourceRecordSets).toHaveBeenCalledWith({
        HostedZoneId: 'hosted-zone-id',
        StartRecordName: 'dev.cdk.aws.',
        StartRecordType: 'A',
    });
    expect(mockRoute53.changeResourceRecordSets).toHaveBeenCalledWith({
        HostedZoneId: 'hosted-zone-id',
        ChangeBatch: {
            Changes: [
                {
                    Action: 'DELETE',
                    ResourceRecordSet: {
                        Name: 'dev.cdk.aws.',
                        TTL: 900,
                        Type: 'A',
                    },
                },
            ],
        },
    });
    expect(mockRoute53.waitFor).toHaveBeenCalledWith('resourceRecordSetsChanged', {
        Id: 'change-id',
    });
});
test('create request with non existing record', async () => {
    mockListResourceRecordSetsResponse.mockResolvedValueOnce({
        ResourceRecordSets: [
            {
                Name: 'www.cdk.aws.',
                Type: 'A',
                TTL: 900,
            },
            {
                Name: 'dev.cdk.aws.',
                Type: 'MX',
                TTL: 900,
            },
        ],
    });
    await delete_existing_record_set_handler_1.handler(event);
    expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});
test('update request', async () => {
    await delete_existing_record_set_handler_1.handler({
        ...event,
        RequestType: 'Update',
        PhysicalResourceId: 'id',
        OldResourceProperties: {},
    });
    expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});
test('delete request', async () => {
    await delete_existing_record_set_handler_1.handler({
        ...event,
        RequestType: 'Delete',
        PhysicalResourceId: 'id',
    });
    expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});
test('with alias target', async () => {
    mockListResourceRecordSetsResponse.mockResolvedValueOnce({
        ResourceRecordSets: [
            {
                Name: 'dev.cdk.aws.',
                Type: 'A',
                TTL: undefined,
                ResourceRecords: [],
                AliasTarget: {
                    HostedZoneId: 'hosted-zone-id',
                    DNSName: 'dns-name',
                    EvaluateTargetHealth: false,
                },
            },
        ],
    });
    mockChangeResourceRecordSetsResponse.mockResolvedValueOnce({
        ChangeInfo: {
            Id: 'change-id',
        },
    });
    await delete_existing_record_set_handler_1.handler(event);
    expect(mockRoute53.changeResourceRecordSets).toHaveBeenCalledWith({
        HostedZoneId: 'hosted-zone-id',
        ChangeBatch: {
            Changes: [
                {
                    Action: 'DELETE',
                    ResourceRecordSet: {
                        Name: 'dev.cdk.aws.',
                        Type: 'A',
                        AliasTarget: {
                            HostedZoneId: 'hosted-zone-id',
                            DNSName: 'dns-name',
                            EvaluateTargetHealth: false,
                        },
                    },
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLWV4aXN0aW5nLXJlY29yZC1zZXQtaGFuZGxlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVsZXRlLWV4aXN0aW5nLXJlY29yZC1zZXQtaGFuZGxlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxrQ0FBa0MsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDckQsTUFBTSxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFdkQsTUFBTSxXQUFXLEdBQUc7SUFDbEIsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUNoRCxPQUFPLEVBQUUsa0NBQWtDO0tBQzVDLENBQUM7SUFDRix3QkFBd0IsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQ2xELE9BQU8sRUFBRSxvQ0FBb0M7S0FDOUMsQ0FBQztJQUNGLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQ2pDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO0tBQ3pDLENBQUM7Q0FDSCxDQUFDO0FBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLE9BQU87UUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7S0FDcEMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0dBQW9FO0FBRXBFLE1BQU0sS0FBSyxHQUFrRjtJQUMzRixXQUFXLEVBQUUsUUFBUTtJQUNyQixZQUFZLEVBQUUsZUFBZTtJQUM3QixXQUFXLEVBQUUsY0FBYztJQUMzQixPQUFPLEVBQUUsVUFBVTtJQUNuQixTQUFTLEVBQUUsWUFBWTtJQUN2QixpQkFBaUIsRUFBRSxxQkFBcUI7SUFD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QUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vY2tMaXN0UmVzb3VyY2VSZWNvcmRTZXRzUmVzcG9uc2UgPSBqZXN0LmZuKCk7XG5jb25zdCBtb2NrQ2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzUmVzcG9uc2UgPSBqZXN0LmZuKCk7XG5cbmNvbnN0IG1vY2tSb3V0ZTUzID0ge1xuICBsaXN0UmVzb3VyY2VSZWNvcmRTZXRzOiBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICBwcm9taXNlOiBtb2NrTGlzdFJlc291cmNlUmVjb3JkU2V0c1Jlc3BvbnNlLFxuICB9KSxcbiAgY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzOiBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICBwcm9taXNlOiBtb2NrQ2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzUmVzcG9uc2UsXG4gIH0pLFxuICB3YWl0Rm9yOiBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICBwcm9taXNlOiBqZXN0LmZuKCkubW9ja1Jlc29sdmVkVmFsdWUoe30pLFxuICB9KSxcbn07XG5cbmplc3QubW9jaygnYXdzLXNkaycsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBSb3V0ZTUzOiBqZXN0LmZuKCgpID0+IG1vY2tSb3V0ZTUzKSxcbiAgfTtcbn0pO1xuXG5pbXBvcnQgeyBoYW5kbGVyIH0gZnJvbSAnLi4vbGliL2RlbGV0ZS1leGlzdGluZy1yZWNvcmQtc2V0LWhhbmRsZXInO1xuXG5jb25zdCBldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCAmIHsgUGh5c2ljYWxSZXNvdXJjZUlkPzogc3RyaW5nIH0gPSB7XG4gIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgU2VydmljZVRva2VuOiAnc2VydmljZS10b2tlbicsXG4gIFJlc3BvbnNlVVJMOiAncmVzcG9uc2UtdXJsJyxcbiAgU3RhY2tJZDogJ3N0YWNrLWlkJyxcbiAgUmVxdWVzdElkOiAncmVxdWVzdC1pZCcsXG4gIExvZ2ljYWxSZXNvdXJjZUlkOiAnbG9naWNhbC1yZXNvdXJjZS1pZCcsXG4gIFJlc291cmNlVHlwZTogJ0N1c3RvbTo6RGVsZXRlRXhpc3RpbmdSZWNvcmRTZXQnLFxuICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICBTZXJ2aWNlVG9rZW46ICdzZXJ2aWNlLXRva2VuJyxcbiAgICBIb3N0ZWRab25lSWQ6ICdob3N0ZWQtem9uZS1pZCcsXG4gICAgUmVjb3JkTmFtZTogJ2Rldi5jZGsuYXdzLicsXG4gICAgUmVjb3JkVHlwZTogJ0EnLFxuICB9LFxufTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIGplc3QuY2xlYXJBbGxNb2NrcygpO1xufSk7XG5cbnRlc3QoJ2NyZWF0ZSByZXF1ZXN0IHdpdGggZXhpc3RpbmcgcmVjb3JkJywgYXN5bmMgKCkgPT4ge1xuICBtb2NrTGlzdFJlc291cmNlUmVjb3JkU2V0c1Jlc3BvbnNlLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgUmVzb3VyY2VSZWNvcmRTZXRzOiBbXG4gICAgICB7XG4gICAgICAgIE5hbWU6ICdkZXYuY2RrLmF3cy4nLFxuICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgIFRUTDogOTAwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgTmFtZTogJ2Rldi5jZGsuYXdzLicsXG4gICAgICAgIFR5cGU6ICdBQUFBJyxcbiAgICAgICAgVFRMOiA5MDAsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIG1vY2tDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNSZXNwb25zZS5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgIENoYW5nZUluZm86IHtcbiAgICAgIElkOiAnY2hhbmdlLWlkJyxcbiAgICB9LFxuICB9KTtcblxuICBhd2FpdCBoYW5kbGVyKGV2ZW50KTtcblxuICBleHBlY3QobW9ja1JvdXRlNTMubGlzdFJlc291cmNlUmVjb3JkU2V0cykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgIEhvc3RlZFpvbmVJZDogJ2hvc3RlZC16b25lLWlkJyxcbiAgICBTdGFydFJlY29yZE5hbWU6ICdkZXYuY2RrLmF3cy4nLFxuICAgIFN0YXJ0UmVjb3JkVHlwZTogJ0EnLFxuICB9KTtcblxuICBleHBlY3QobW9ja1JvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgSG9zdGVkWm9uZUlkOiAnaG9zdGVkLXpvbmUtaWQnLFxuICAgIENoYW5nZUJhdGNoOiB7XG4gICAgICBDaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdERUxFVEUnLFxuICAgICAgICAgIFJlc291cmNlUmVjb3JkU2V0OiB7XG4gICAgICAgICAgICBOYW1lOiAnZGV2LmNkay5hd3MuJyxcbiAgICAgICAgICAgIFRUTDogOTAwLFxuICAgICAgICAgICAgVHlwZTogJ0EnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xuXG4gIGV4cGVjdChtb2NrUm91dGU1My53YWl0Rm9yKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncmVzb3VyY2VSZWNvcmRTZXRzQ2hhbmdlZCcsIHtcbiAgICBJZDogJ2NoYW5nZS1pZCcsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NyZWF0ZSByZXF1ZXN0IHdpdGggbm9uIGV4aXN0aW5nIHJlY29yZCcsIGFzeW5jICgpID0+IHtcbiAgbW9ja0xpc3RSZXNvdXJjZVJlY29yZFNldHNSZXNwb25zZS5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgIFJlc291cmNlUmVjb3JkU2V0czogW1xuICAgICAge1xuICAgICAgICBOYW1lOiAnd3d3LmNkay5hd3MuJyxcbiAgICAgICAgVHlwZTogJ0EnLFxuICAgICAgICBUVEw6IDkwMCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIE5hbWU6ICdkZXYuY2RrLmF3cy4nLFxuICAgICAgICBUeXBlOiAnTVgnLFxuICAgICAgICBUVEw6IDkwMCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgYXdhaXQgaGFuZGxlcihldmVudCk7XG5cbiAgZXhwZWN0KG1vY2tSb3V0ZTUzLmNoYW5nZVJlc291cmNlUmVjb3JkU2V0cykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbn0pO1xuXG50ZXN0KCd1cGRhdGUgcmVxdWVzdCcsIGFzeW5jICgpID0+IHtcbiAgYXdhaXQgaGFuZGxlcih7XG4gICAgLi4uZXZlbnQsXG4gICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ2lkJyxcbiAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHt9LFxuICB9KTtcblxuICBleHBlY3QobW9ja1JvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xufSk7XG5cbnRlc3QoJ2RlbGV0ZSByZXF1ZXN0JywgYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBoYW5kbGVyKHtcbiAgICAuLi5ldmVudCxcbiAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnaWQnLFxuICB9KTtcblxuICBleHBlY3QobW9ja1JvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xufSk7XG5cbnRlc3QoJ3dpdGggYWxpYXMgdGFyZ2V0JywgYXN5bmMgKCkgPT4ge1xuICBtb2NrTGlzdFJlc291cmNlUmVjb3JkU2V0c1Jlc3BvbnNlLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgUmVzb3VyY2VSZWNvcmRTZXRzOiBbXG4gICAgICB7XG4gICAgICAgIE5hbWU6ICdkZXYuY2RrLmF3cy4nLFxuICAgICAgICBUeXBlOiAnQScsXG4gICAgICAgIFRUTDogdW5kZWZpbmVkLFxuICAgICAgICBSZXNvdXJjZVJlY29yZHM6IFtdLFxuICAgICAgICBBbGlhc1RhcmdldDoge1xuICAgICAgICAgIEhvc3RlZFpvbmVJZDogJ2hvc3RlZC16b25lLWlkJyxcbiAgICAgICAgICBETlNOYW1lOiAnZG5zLW5hbWUnLFxuICAgICAgICAgIEV2YWx1YXRlVGFyZ2V0SGVhbHRoOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgbW9ja0NoYW5nZVJlc291cmNlUmVjb3JkU2V0c1Jlc3BvbnNlLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgQ2hhbmdlSW5mbzoge1xuICAgICAgSWQ6ICdjaGFuZ2UtaWQnLFxuICAgIH0sXG4gIH0pO1xuXG4gIGF3YWl0IGhhbmRsZXIoZXZlbnQpO1xuXG4gIGV4cGVjdChtb2NrUm91dGU1My5jaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICBIb3N0ZWRab25lSWQ6ICdob3N0ZWQtem9uZS1pZCcsXG4gICAgQ2hhbmdlQmF0Y2g6IHtcbiAgICAgIENoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ0RFTEVURScsXG4gICAgICAgICAgUmVzb3VyY2VSZWNvcmRTZXQ6IHtcbiAgICAgICAgICAgIE5hbWU6ICdkZXYuY2RrLmF3cy4nLFxuICAgICAgICAgICAgVHlwZTogJ0EnLFxuICAgICAgICAgICAgQWxpYXNUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgSG9zdGVkWm9uZUlkOiAnaG9zdGVkLXpvbmUtaWQnLFxuICAgICAgICAgICAgICBETlNOYW1lOiAnZG5zLW5hbWUnLFxuICAgICAgICAgICAgICBFdmFsdWF0ZVRhcmdldEhlYWx0aDogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=