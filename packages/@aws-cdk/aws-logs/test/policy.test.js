"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('resource policy', () => {
    test('ResourcePolicy is added to stack, when .addToResourcePolicy() is provided a valid Statement', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        logGroup.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ['logs:CreateLogStream'],
            resources: ['*'],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
            PolicyName: 'LogGroupPolicy643B329C',
            PolicyDocument: JSON.stringify({
                Statement: [
                    {
                        Action: 'logs:CreateLogStream',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            }),
        });
    });
    test('ResourcePolicy is added to stack, when created manually/directly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        const resourcePolicy = new lib_1.ResourcePolicy(stack, 'ResourcePolicy');
        resourcePolicy.document.addStatements(new aws_iam_1.PolicyStatement({
            actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            principals: [new aws_iam_1.ServicePrincipal('es.amazonaws.com')],
            resources: [logGroup.logGroupArn],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
            PolicyName: 'ResourcePolicy',
        });
    });
    test('ResourcePolicy has a defaultChild', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const resourcePolicy = new lib_1.ResourcePolicy(stack, 'ResourcePolicy');
        // THEN
        expect(resourcePolicy.node.defaultChild).toBeDefined();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2xpY3kudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4Q0FBcUU7QUFDckUsd0NBQXNDO0FBQ3RDLGdDQUFrRDtBQUVsRCxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUksQ0FBQyw2RkFBNkYsRUFBRSxHQUFHLEVBQUU7UUFDdkcsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpELE9BQU87UUFDUCxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSx5QkFBZSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUM3QixTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLHNCQUFzQjt3QkFDOUIsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFLEdBQUc7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLFlBQVk7YUFDdEIsQ0FBQztTQUNILENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFakQsT0FBTztRQUNQLE1BQU0sY0FBYyxHQUFHLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRSxjQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsbUJBQW1CLENBQUM7WUFDdEQsVUFBVSxFQUFFLENBQUMsSUFBSSwwQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3RELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7U0FDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsVUFBVSxFQUFFLGdCQUFnQjtTQUM3QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sY0FBYyxHQUFHLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVuRSxPQUFPO1FBQ1AsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBMb2dHcm91cCwgUmVzb3VyY2VQb2xpY3kgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgncmVzb3VyY2UgcG9saWN5JywgKCkgPT4ge1xuICB0ZXN0KCdSZXNvdXJjZVBvbGljeSBpcyBhZGRlZCB0byBzdGFjaywgd2hlbiAuYWRkVG9SZXNvdXJjZVBvbGljeSgpIGlzIHByb3ZpZGVkIGEgdmFsaWQgU3RhdGVtZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbG9nR3JvdXAuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpDcmVhdGVMb2dTdHJlYW0nXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlJlc291cmNlUG9saWN5Jywge1xuICAgICAgUG9saWN5TmFtZTogJ0xvZ0dyb3VwUG9saWN5NjQzQjMyOUMnLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnUmVzb3VyY2VQb2xpY3kgaXMgYWRkZWQgdG8gc3RhY2ssIHdoZW4gY3JlYXRlZCBtYW51YWxseS9kaXJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc291cmNlUG9saWN5ID0gbmV3IFJlc291cmNlUG9saWN5KHN0YWNrLCAnUmVzb3VyY2VQb2xpY3knKTtcbiAgICByZXNvdXJjZVBvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdlcy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgcmVzb3VyY2VzOiBbbG9nR3JvdXAubG9nR3JvdXBBcm5dLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpSZXNvdXJjZVBvbGljeScsIHtcbiAgICAgIFBvbGljeU5hbWU6ICdSZXNvdXJjZVBvbGljeScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Jlc291cmNlUG9saWN5IGhhcyBhIGRlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb3VyY2VQb2xpY3kgPSBuZXcgUmVzb3VyY2VQb2xpY3koc3RhY2ssICdSZXNvdXJjZVBvbGljeScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvdXJjZVBvbGljeS5ub2RlLmRlZmF1bHRDaGlsZCkudG9CZURlZmluZWQoKTtcbiAgfSk7XG59KTtcbiJdfQ==