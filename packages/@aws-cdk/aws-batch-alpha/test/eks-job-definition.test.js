"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lib_1 = require("../lib");
test('EcsJobDefinition respects dnsPolicy', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EksJobDefinition(stack, 'EKSJobDefn', {
        container: new lib_1.EksContainerDefinition(stack, 'EksContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        dnsPolicy: lib_1.DnsPolicy.CLUSTER_FIRST,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        EksProperties: {
            PodProperties: {
                DnsPolicy: lib_1.DnsPolicy.CLUSTER_FIRST,
            },
        },
    });
});
test('EcsJobDefinition respects useHostNetwork', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EksJobDefinition(stack, 'EKSJobDefn', {
        container: new lib_1.EksContainerDefinition(stack, 'EksContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        useHostNetwork: true,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        EksProperties: {
            PodProperties: {
                HostNetwork: true,
            },
        },
    });
});
test('EcsJobDefinition respects serviceAccount', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EksJobDefinition(stack, 'EKSJobDefn', {
        container: new lib_1.EksContainerDefinition(stack, 'EksContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        serviceAccount: 'my-service-account',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        EksProperties: {
            PodProperties: {
                ServiceAccountName: 'my-service-account',
            },
        },
    });
});
test('can be imported from ARN', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    const importedJob = lib_1.EksJobDefinition.fromEksJobDefinitionArn(stack, 'importedJobDefinition', 'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
    // THEN
    expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWpvYi1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJla3Mtam9iLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsNkNBQW9DO0FBQ3BDLGdDQUE2RTtBQUU3RSxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO0lBQy9DLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3hDLFNBQVMsRUFBRSxJQUFJLDRCQUFzQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDM0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO1NBQ25FLENBQUM7UUFDRixTQUFTLEVBQUUsZUFBUyxDQUFDLGFBQWE7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLGFBQWEsRUFBRTtZQUNiLGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsZUFBUyxDQUFDLGFBQWE7YUFDbkM7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtRQUN4QyxTQUFTLEVBQUUsSUFBSSw0QkFBc0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQzNELEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztTQUNuRSxDQUFDO1FBQ0YsY0FBYyxFQUFFLElBQUk7S0FDckIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLGFBQWEsRUFBRTtZQUNiLGFBQWEsRUFBRTtnQkFDYixXQUFXLEVBQUUsSUFBSTthQUNsQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO0lBQ3BELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3hDLFNBQVMsRUFBRSxJQUFJLDRCQUFzQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDM0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO1NBQ25FLENBQUM7UUFDRixjQUFjLEVBQUUsb0JBQW9CO0tBQ3JDLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtRQUMzRSxhQUFhLEVBQUU7WUFDYixhQUFhLEVBQUU7Z0JBQ2Isa0JBQWtCLEVBQUUsb0JBQW9CO2FBQ3pDO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDcEMsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxNQUFNLFdBQVcsR0FBRyxzQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQ3pGLG9FQUFvRSxDQUFDLENBQUM7SUFFeEUsT0FBTztJQUNQLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsb0VBQW9FLENBQUMsQ0FBQztBQUNySCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IERuc1BvbGljeSwgRWtzQ29udGFpbmVyRGVmaW5pdGlvbiwgRWtzSm9iRGVmaW5pdGlvbiB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ0Vjc0pvYkRlZmluaXRpb24gcmVzcGVjdHMgZG5zUG9saWN5JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFS1NKb2JEZWZuJywge1xuICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFa3NDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgfSksXG4gICAgZG5zUG9saWN5OiBEbnNQb2xpY3kuQ0xVU1RFUl9GSVJTVCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgIERuc1BvbGljeTogRG5zUG9saWN5LkNMVVNURVJfRklSU1QsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0Vjc0pvYkRlZmluaXRpb24gcmVzcGVjdHMgdXNlSG9zdE5ldHdvcmsnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VLU0pvYkRlZm4nLCB7XG4gICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICB9KSxcbiAgICB1c2VIb3N0TmV0d29yazogdHJ1ZSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgIEhvc3ROZXR3b3JrOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdFY3NKb2JEZWZpbml0aW9uIHJlc3BlY3RzIHNlcnZpY2VBY2NvdW50JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFS1NKb2JEZWZuJywge1xuICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFa3NDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgfSksXG4gICAgc2VydmljZUFjY291bnQ6ICdteS1zZXJ2aWNlLWFjY291bnQnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZUFjY291bnROYW1lOiAnbXktc2VydmljZS1hY2NvdW50JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIGJlIGltcG9ydGVkIGZyb20gQVJOJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgaW1wb3J0ZWRKb2IgPSBFa3NKb2JEZWZpbml0aW9uLmZyb21Fa3NKb2JEZWZpbml0aW9uQXJuKHN0YWNrLCAnaW1wb3J0ZWRKb2JEZWZpbml0aW9uJyxcbiAgICAnYXJuOmF3czpiYXRjaDp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmpvYi1kZWZpbml0aW9uL2pvYi1kZWYtbmFtZToxJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoaW1wb3J0ZWRKb2Iuam9iRGVmaW5pdGlvbkFybikudG9FcXVhbCgnYXJuOmF3czpiYXRjaDp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmpvYi1kZWZpbml0aW9uL2pvYi1kZWYtbmFtZToxJyk7XG59KTtcblxuIl19