"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const core_1 = require("aws-cdk-lib/core");
const lib_1 = require("../lib");
test('empty fairshare policy', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        FairsharePolicy: {
            ShareDistribution: [],
        },
    });
});
test('fairshare policy respects computeReservation', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
        computeReservation: 75,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        FairsharePolicy: {
            ComputeReservation: 75,
            ShareDistribution: [],
        },
    });
});
test('fairshare policy respects name', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
        schedulingPolicyName: 'FairsharePolicyName',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        Name: 'FairsharePolicyName',
        FairsharePolicy: {
            ShareDistribution: [],
        },
    });
});
test('fairshare policy respects shareDecay', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
        shareDecay: core_1.Duration.hours(1),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        FairsharePolicy: {
            ShareDecaySeconds: 3600,
            ShareDistribution: [],
        },
    });
});
test('fairshare policy respects shares', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
        shares: [
            {
                shareIdentifier: 'myShareId',
                weightFactor: 0.5,
            },
            {
                shareIdentifier: 'myShareId2',
                weightFactor: 1,
            },
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        FairsharePolicy: {
            ShareDistribution: [
                {
                    ShareIdentifier: 'myShareId',
                    WeightFactor: 0.5,
                },
                {
                    ShareIdentifier: 'myShareId2',
                    WeightFactor: 1,
                },
            ],
        },
    });
});
test('addShare() works', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const policy = new lib_1.FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
        shares: [{
                shareIdentifier: 'myShareId',
                weightFactor: 0.5,
            }],
    });
    policy.addShare({
        shareIdentifier: 'addedShareId',
        weightFactor: 0.5,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
        FairsharePolicy: {
            ShareDistribution: [
                {
                    ShareIdentifier: 'myShareId',
                    WeightFactor: 0.5,
                },
                {
                    ShareIdentifier: 'addedShareId',
                    WeightFactor: 0.5,
                },
            ],
        },
    });
});
test('can be imported from ARN', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const policy = lib_1.FairshareSchedulingPolicy.fromFairshareSchedulingPolicyArn(stack, 'policyImport', 'arn:aws:batch:us-east-1:123456789012:scheduling-policy/policyImport');
    // THEN
    expect(policy.schedulingPolicyArn).toEqual('arn:aws:batch:us-east-1:123456789012:scheduling-policy/policyImport');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGluZy1wb2xpY3kudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaGVkdWxpbmctcG9saWN5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBa0Q7QUFDbEQsMkNBQW1EO0FBQ25ELGdDQUFtRDtBQUVuRCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRXpELE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtRQUM5RSxlQUFlLEVBQUU7WUFDZixpQkFBaUIsRUFBRSxFQUFFO1NBQ3RCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO0lBQ3hELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtRQUN2RCxrQkFBa0IsRUFBRSxFQUFFO0tBQ3ZCLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtRQUM5RSxlQUFlLEVBQUU7WUFDZixrQkFBa0IsRUFBRSxFQUFFO1lBQ3RCLGlCQUFpQixFQUFFLEVBQUU7U0FDdEI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFDMUMsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElB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QztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsTUFBTSxNQUFNLEdBQUcsK0JBQXlCLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFDN0YscUVBQXFFLENBQUMsQ0FBQztJQUV6RSxPQUFPO0lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO0FBQ3BILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHsgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeSB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ2VtcHR5IGZhaXJzaGFyZSBwb2xpY3knLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeShzdGFjaywgJ3NjaGVkdWxpbmdQb2xpY3knKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpTY2hlZHVsaW5nUG9saWN5Jywge1xuICAgIEZhaXJzaGFyZVBvbGljeToge1xuICAgICAgU2hhcmVEaXN0cmlidXRpb246IFtdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaXJzaGFyZSBwb2xpY3kgcmVzcGVjdHMgY29tcHV0ZVJlc2VydmF0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEZhaXJzaGFyZVNjaGVkdWxpbmdQb2xpY3koc3RhY2ssICdzY2hlZHVsaW5nUG9saWN5Jywge1xuICAgIGNvbXB1dGVSZXNlcnZhdGlvbjogNzUsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OlNjaGVkdWxpbmdQb2xpY3knLCB7XG4gICAgRmFpcnNoYXJlUG9saWN5OiB7XG4gICAgICBDb21wdXRlUmVzZXJ2YXRpb246IDc1LFxuICAgICAgU2hhcmVEaXN0cmlidXRpb246IFtdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaXJzaGFyZSBwb2xpY3kgcmVzcGVjdHMgbmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBGYWlyc2hhcmVTY2hlZHVsaW5nUG9saWN5KHN0YWNrLCAnc2NoZWR1bGluZ1BvbGljeScsIHtcbiAgICBzY2hlZHVsaW5nUG9saWN5TmFtZTogJ0ZhaXJzaGFyZVBvbGljeU5hbWUnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpTY2hlZHVsaW5nUG9saWN5Jywge1xuICAgIE5hbWU6ICdGYWlyc2hhcmVQb2xpY3lOYW1lJyxcbiAgICBGYWlyc2hhcmVQb2xpY3k6IHtcbiAgICAgIFNoYXJlRGlzdHJpYnV0aW9uOiBbXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmYWlyc2hhcmUgcG9saWN5IHJlc3BlY3RzIHNoYXJlRGVjYXknLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeShzdGFjaywgJ3NjaGVkdWxpbmdQb2xpY3knLCB7XG4gICAgc2hhcmVEZWNheTogRHVyYXRpb24uaG91cnMoMSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OlNjaGVkdWxpbmdQb2xpY3knLCB7XG4gICAgRmFpcnNoYXJlUG9saWN5OiB7XG4gICAgICBTaGFyZURlY2F5U2Vjb25kczogMzYwMCxcbiAgICAgIFNoYXJlRGlzdHJpYnV0aW9uOiBbXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmYWlyc2hhcmUgcG9saWN5IHJlc3BlY3RzIHNoYXJlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBGYWlyc2hhcmVTY2hlZHVsaW5nUG9saWN5KHN0YWNrLCAnc2NoZWR1bGluZ1BvbGljeScsIHtcbiAgICBzaGFyZXM6IFtcbiAgICAgIHtcbiAgICAgICAgc2hhcmVJZGVudGlmaWVyOiAnbXlTaGFyZUlkJyxcbiAgICAgICAgd2VpZ2h0RmFjdG9yOiAwLjUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzaGFyZUlkZW50aWZpZXI6ICdteVNoYXJlSWQyJyxcbiAgICAgICAgd2VpZ2h0RmFjdG9yOiAxLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpTY2hlZHVsaW5nUG9saWN5Jywge1xuICAgIEZhaXJzaGFyZVBvbGljeToge1xuICAgICAgU2hhcmVEaXN0cmlidXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIFNoYXJlSWRlbnRpZmllcjogJ215U2hhcmVJZCcsXG4gICAgICAgICAgV2VpZ2h0RmFjdG9yOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBTaGFyZUlkZW50aWZpZXI6ICdteVNoYXJlSWQyJyxcbiAgICAgICAgICBXZWlnaHRGYWN0b3I6IDEsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2FkZFNoYXJlKCkgd29ya3MnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwb2xpY3kgPSBuZXcgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeShzdGFjaywgJ3NjaGVkdWxpbmdQb2xpY3knLCB7XG4gICAgc2hhcmVzOiBbe1xuICAgICAgc2hhcmVJZGVudGlmaWVyOiAnbXlTaGFyZUlkJyxcbiAgICAgIHdlaWdodEZhY3RvcjogMC41LFxuICAgIH1dLFxuICB9KTtcbiAgcG9saWN5LmFkZFNoYXJlKHtcbiAgICBzaGFyZUlkZW50aWZpZXI6ICdhZGRlZFNoYXJlSWQnLFxuICAgIHdlaWdodEZhY3RvcjogMC41LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpTY2hlZHVsaW5nUG9saWN5Jywge1xuICAgIEZhaXJzaGFyZVBvbGljeToge1xuICAgICAgU2hhcmVEaXN0cmlidXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIFNoYXJlSWRlbnRpZmllcjogJ215U2hhcmVJZCcsXG4gICAgICAgICAgV2VpZ2h0RmFjdG9yOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBTaGFyZUlkZW50aWZpZXI6ICdhZGRlZFNoYXJlSWQnLFxuICAgICAgICAgIFdlaWdodEZhY3RvcjogMC41LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gYmUgaW1wb3J0ZWQgZnJvbSBBUk4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwb2xpY3kgPSBGYWlyc2hhcmVTY2hlZHVsaW5nUG9saWN5LmZyb21GYWlyc2hhcmVTY2hlZHVsaW5nUG9saWN5QXJuKHN0YWNrLCAncG9saWN5SW1wb3J0JyxcbiAgICAnYXJuOmF3czpiYXRjaDp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnNjaGVkdWxpbmctcG9saWN5L3BvbGljeUltcG9ydCcpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHBvbGljeS5zY2hlZHVsaW5nUG9saWN5QXJuKS50b0VxdWFsKCdhcm46YXdzOmJhdGNoOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6c2NoZWR1bGluZy1wb2xpY3kvcG9saWN5SW1wb3J0Jyk7XG59KTtcbiJdfQ==