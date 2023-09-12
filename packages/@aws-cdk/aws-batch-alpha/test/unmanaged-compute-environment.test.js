"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const utils_1 = require("./utils");
const unmanaged_compute_environment_1 = require("../lib/unmanaged-compute-environment");
const defaultExpectedProps = {
    type: 'unmanaged',
    computeEnvironmentName: undefined,
    computeResources: undefined,
    eksConfiguration: undefined,
    replaceComputeEnvironment: undefined,
    serviceRole: {
        'Fn::GetAtt': ['MyCEBatchServiceRole4FDA2CB6', 'Arn'],
    },
    state: 'ENABLED',
    tags: undefined,
    unmanagedvCpus: undefined,
    updatePolicy: undefined,
};
let stack = new core_1.Stack();
const pascalCaseExpectedProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedProps);
test('default props', () => {
    // GIVEN
    stack = new core_1.Stack();
    // WHEN
    new unmanaged_compute_environment_1.UnmanagedComputeEnvironment(stack, 'MyCE');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ...pascalCaseExpectedProps,
    });
});
test('respects enabled: false', () => {
    // GIVEN
    stack = new core_1.Stack();
    // WHEN
    new unmanaged_compute_environment_1.UnmanagedComputeEnvironment(stack, 'MyCE', {
        enabled: false,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ...pascalCaseExpectedProps,
        State: 'DISABLED',
    });
});
test('respects name', () => {
    // GIVEN
    stack = new core_1.Stack();
    // WHEN
    new unmanaged_compute_environment_1.UnmanagedComputeEnvironment(stack, 'MyCE', {
        computeEnvironmentName: 'magic',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ...pascalCaseExpectedProps,
        ComputeEnvironmentName: 'magic',
    });
});
test('respects serviceRole', () => {
    // GIVEN
    stack = new core_1.Stack();
    // WHEN
    new unmanaged_compute_environment_1.UnmanagedComputeEnvironment(stack, 'MyCE', {
        serviceRole: new aws_iam_1.Role(stack, 'myMagicRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('batch.amazonaws.com'),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ...pascalCaseExpectedProps,
        ServiceRole: {
            'Fn::GetAtt': ['myMagicRole2BBD827A', 'Arn'],
        },
    });
});
test('respects unmanagedvCpus', () => {
    // GIVEN
    stack = new core_1.Stack();
    // WHEN
    new unmanaged_compute_environment_1.UnmanagedComputeEnvironment(stack, 'MyCE', {
        unmanagedvCpus: 256,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
        ...pascalCaseExpectedProps,
        UnmanagedvCpus: 256,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5tYW5hZ2VkLWNvbXB1dGUtZW52aXJvbm1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVubWFuYWdlZC1jb21wdXRlLWVudmlyb25tZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBa0Q7QUFDbEQsaURBQTZEO0FBQzdELDJDQUF5QztBQUN6QyxtQ0FBa0Q7QUFFbEQsd0ZBQW1GO0FBRW5GLE1BQU0sb0JBQW9CLEdBQStCO0lBQ3ZELElBQUksRUFBRSxXQUFXO0lBQ2pCLHNCQUFzQixFQUFFLFNBQVM7SUFDakMsZ0JBQWdCLEVBQUUsU0FBUztJQUMzQixnQkFBZ0IsRUFBRSxTQUFTO0lBQzNCLHlCQUF5QixFQUFFLFNBQVM7SUFDcEMsV0FBVyxFQUFFO1FBQ1gsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDO0tBQy9DO0lBQ1IsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFNBQVM7SUFDZixjQUFjLEVBQUUsU0FBUztJQUN6QixZQUFZLEVBQUUsU0FBUztDQUN4QixDQUFDO0FBRUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztBQUN4QixNQUFNLHVCQUF1QixHQUFHLElBQUEsK0JBQXVCLEVBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFFckYsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDekIsUUFBUTtJQUNSLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRXBCLE9BQU87SUFDUCxJQUFJLDJEQUEyQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUvQyxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLEVBQUU7UUFDaEYsR0FBRyx1QkFBdUI7S0FDM0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLFFBQVE7SUFDUixLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUVwQixPQUFPO0lBQ1AsSUFBSSwyREFBMkIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQzdDLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdDQUFnQyxFQUFFO1FBQ2hGLEdBQUcsdUJBQXVCO1FBQzFCLEtBQUssRUFBRSxVQUFVO0tBQ2xCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDekIsUUFBUTtJQUNSLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRXBCLE9BQU87SUFDUCxJQUFJLDJEQUEyQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDN0Msc0JBQXNCLEVBQUUsT0FBTztLQUNoQyxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLEVBQUU7UUFDaEYsR0FBRyx1QkFBdUI7UUFDMUIsc0JBQXNCLEVBQUUsT0FBTztLQUNoQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsUUFBUTtJQUNSLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRXBCLE9BQU87SUFDUCxJQUFJLDJEQUEyQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDN0MsV0FBVyxFQUFFLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDMUMsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMscUJBQXFCLENBQUM7U0FDdkQsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNoRixHQUFHLHVCQUF1QjtRQUMxQixXQUFXLEVBQUU7WUFDWCxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUM7U0FDN0M7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsUUFBUTtJQUNSLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRXBCLE9BQU87SUFDUCxJQUFJLDJEQUEyQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDN0MsY0FBYyxFQUFFLEdBQUc7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdDQUFnQyxFQUFFO1FBQ2hGLEdBQUcsdUJBQXVCO1FBQzFCLGNBQWMsRUFBRSxHQUFHO0tBQ3BCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ2ZuQ29tcHV0ZUVudmlyb25tZW50UHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gnO1xuaW1wb3J0IHsgVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50IH0gZnJvbSAnLi4vbGliL3VubWFuYWdlZC1jb21wdXRlLWVudmlyb25tZW50JztcblxuY29uc3QgZGVmYXVsdEV4cGVjdGVkUHJvcHM6IENmbkNvbXB1dGVFbnZpcm9ubWVudFByb3BzID0ge1xuICB0eXBlOiAndW5tYW5hZ2VkJyxcbiAgY29tcHV0ZUVudmlyb25tZW50TmFtZTogdW5kZWZpbmVkLFxuICBjb21wdXRlUmVzb3VyY2VzOiB1bmRlZmluZWQsXG4gIGVrc0NvbmZpZ3VyYXRpb246IHVuZGVmaW5lZCxcbiAgcmVwbGFjZUNvbXB1dGVFbnZpcm9ubWVudDogdW5kZWZpbmVkLFxuICBzZXJ2aWNlUm9sZToge1xuICAgICdGbjo6R2V0QXR0JzogWydNeUNFQmF0Y2hTZXJ2aWNlUm9sZTRGREEyQ0I2JywgJ0FybiddLFxuICB9IGFzIGFueSxcbiAgc3RhdGU6ICdFTkFCTEVEJyxcbiAgdGFnczogdW5kZWZpbmVkLFxuICB1bm1hbmFnZWR2Q3B1czogdW5kZWZpbmVkLFxuICB1cGRhdGVQb2xpY3k6IHVuZGVmaW5lZCxcbn07XG5cbmxldCBzdGFjayA9IG5ldyBTdGFjaygpO1xuY29uc3QgcGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMgPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhzdGFjaywgZGVmYXVsdEV4cGVjdGVkUHJvcHMpO1xuXG50ZXN0KCdkZWZhdWx0IHByb3BzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Jlc3BlY3RzIGVuYWJsZWQ6IGZhbHNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICBTdGF0ZTogJ0RJU0FCTEVEJyxcbiAgfSk7XG59KTtcblxudGVzdCgncmVzcGVjdHMgbmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBVbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgIGNvbXB1dGVFbnZpcm9ubWVudE5hbWU6ICdtYWdpYycsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkNvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICBDb21wdXRlRW52aXJvbm1lbnROYW1lOiAnbWFnaWMnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdyZXNwZWN0cyBzZXJ2aWNlUm9sZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBVbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdNeUNFJywge1xuICAgIHNlcnZpY2VSb2xlOiBuZXcgUm9sZShzdGFjaywgJ215TWFnaWNSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnYmF0Y2guYW1hem9uYXdzLmNvbScpLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgU2VydmljZVJvbGU6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogWydteU1hZ2ljUm9sZTJCQkQ4MjdBJywgJ0FybiddLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Jlc3BlY3RzIHVubWFuYWdlZHZDcHVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ015Q0UnLCB7XG4gICAgdW5tYW5hZ2VkdkNwdXM6IDI1NixcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Q29tcHV0ZUVudmlyb25tZW50Jywge1xuICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgIFVubWFuYWdlZHZDcHVzOiAyNTYsXG4gIH0pO1xufSk7XG4iXX0=