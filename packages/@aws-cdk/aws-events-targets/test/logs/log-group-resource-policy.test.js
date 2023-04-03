"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const log_group_resource_policy_1 = require("../../lib/log-group-resource-policy");
let app;
let stack;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'Stack', {
        env: { account: '1234', region: 'testregion' },
    });
});
test('minimal example renders correctly', () => {
    new log_group_resource_policy_1.LogGroupResourcePolicy(stack, 'LogGroupResourcePolicy', {
        policyName: 'TestPolicy',
        policyStatements: [new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
                resources: ['*'],
                principals: [new iam.ServicePrincipal('es.amazonaws.com')],
            })],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CloudwatchLogResourcePolicy', {
        ServiceToken: {
            'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                'Arn',
            ],
        },
        Create: '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"TestPolicy","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"*\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"LogGroupResourcePolicy"}}',
        Update: '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"TestPolicy","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"*\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"LogGroupResourcePolicy"}}',
        Delete: '{"service":"CloudWatchLogs","action":"deleteResourcePolicy","parameters":{"policyName":"TestPolicy"},"ignoreErrorCodesMatching":"400"}',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLXJlc291cmNlLXBvbGljeS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLWdyb3VwLXJlc291cmNlLXBvbGljeS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBMkM7QUFDM0MsbUZBQTZFO0FBRTdFLElBQUksR0FBUSxDQUFDO0FBQ2IsSUFBSSxLQUFZLENBQUM7QUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO1FBQzlCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtLQUMvQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7SUFDN0MsSUFBSSxrREFBc0IsQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUU7UUFDMUQsVUFBVSxFQUFFLFlBQVk7UUFDeEIsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQ3pDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO2dCQUN0RCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDM0QsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUNBQXFDLEVBQUU7UUFDckYsWUFBWSxFQUFFO1lBQ1osWUFBWSxFQUFFO2dCQUNaLDZDQUE2QztnQkFDN0MsS0FBSzthQUNOO1NBQ0Y7UUFDRCxNQUFNLEVBQUUsMFlBQTBZO1FBQ2xaLE1BQU0sRUFBRSwwWUFBMFk7UUFDbFosTUFBTSxFQUFFLHdJQUF3STtLQUNqSixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBMb2dHcm91cFJlc291cmNlUG9saWN5IH0gZnJvbSAnLi4vLi4vbGliL2xvZy1ncm91cC1yZXNvdXJjZS1wb2xpY3knO1xuXG5sZXQgYXBwOiBBcHA7XG5sZXQgc3RhY2s6IFN0YWNrO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdtaW5pbWFsIGV4YW1wbGUgcmVuZGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gIG5ldyBMb2dHcm91cFJlc291cmNlUG9saWN5KHN0YWNrLCAnTG9nR3JvdXBSZXNvdXJjZVBvbGljeScsIHtcbiAgICBwb2xpY3lOYW1lOiAnVGVzdFBvbGljeScsXG4gICAgcG9saWN5U3RhdGVtZW50czogW25ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpQdXRMb2dFdmVudHMnLCAnbG9nczpDcmVhdGVMb2dTdHJlYW0nXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlcy5hbWF6b25hd3MuY29tJyldLFxuICAgIH0pXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q2xvdWR3YXRjaExvZ1Jlc291cmNlUG9saWN5Jywge1xuICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdBV1M2NzlmNTNmYWMwMDI0MzBjYjBkYTViNzk4MmJkMjI4NzJEMTY0QzRDJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgQ3JlYXRlOiAne1wic2VydmljZVwiOlwiQ2xvdWRXYXRjaExvZ3NcIixcImFjdGlvblwiOlwicHV0UmVzb3VyY2VQb2xpY3lcIixcInBhcmFtZXRlcnNcIjp7XCJwb2xpY3lOYW1lXCI6XCJUZXN0UG9saWN5XCIsXCJwb2xpY3lEb2N1bWVudFwiOlwie1xcXFxcIlN0YXRlbWVudFxcXFxcIjpbe1xcXFxcIkFjdGlvblxcXFxcIjpbXFxcXFwibG9nczpQdXRMb2dFdmVudHNcXFxcXCIsXFxcXFwibG9nczpDcmVhdGVMb2dTdHJlYW1cXFxcXCJdLFxcXFxcIkVmZmVjdFxcXFxcIjpcXFxcXCJBbGxvd1xcXFxcIixcXFxcXCJQcmluY2lwYWxcXFxcXCI6e1xcXFxcIlNlcnZpY2VcXFxcXCI6XFxcXFwiZXMuYW1hem9uYXdzLmNvbVxcXFxcIn0sXFxcXFwiUmVzb3VyY2VcXFxcXCI6XFxcXFwiKlxcXFxcIn1dLFxcXFxcIlZlcnNpb25cXFxcXCI6XFxcXFwiMjAxMi0xMC0xN1xcXFxcIn1cIn0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiTG9nR3JvdXBSZXNvdXJjZVBvbGljeVwifX0nLFxuICAgIFVwZGF0ZTogJ3tcInNlcnZpY2VcIjpcIkNsb3VkV2F0Y2hMb2dzXCIsXCJhY3Rpb25cIjpcInB1dFJlc291cmNlUG9saWN5XCIsXCJwYXJhbWV0ZXJzXCI6e1wicG9saWN5TmFtZVwiOlwiVGVzdFBvbGljeVwiLFwicG9saWN5RG9jdW1lbnRcIjpcIntcXFxcXCJTdGF0ZW1lbnRcXFxcXCI6W3tcXFxcXCJBY3Rpb25cXFxcXCI6W1xcXFxcImxvZ3M6UHV0TG9nRXZlbnRzXFxcXFwiLFxcXFxcImxvZ3M6Q3JlYXRlTG9nU3RyZWFtXFxcXFwiXSxcXFxcXCJFZmZlY3RcXFxcXCI6XFxcXFwiQWxsb3dcXFxcXCIsXFxcXFwiUHJpbmNpcGFsXFxcXFwiOntcXFxcXCJTZXJ2aWNlXFxcXFwiOlxcXFxcImVzLmFtYXpvbmF3cy5jb21cXFxcXCJ9LFxcXFxcIlJlc291cmNlXFxcXFwiOlxcXFxcIipcXFxcXCJ9XSxcXFxcXCJWZXJzaW9uXFxcXFwiOlxcXFxcIjIwMTItMTAtMTdcXFxcXCJ9XCJ9LFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6e1wiaWRcIjpcIkxvZ0dyb3VwUmVzb3VyY2VQb2xpY3lcIn19JyxcbiAgICBEZWxldGU6ICd7XCJzZXJ2aWNlXCI6XCJDbG91ZFdhdGNoTG9nc1wiLFwiYWN0aW9uXCI6XCJkZWxldGVSZXNvdXJjZVBvbGljeVwiLFwicGFyYW1ldGVyc1wiOntcInBvbGljeU5hbWVcIjpcIlRlc3RQb2xpY3lcIn0sXCJpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdcIjpcIjQwMFwifScsXG4gIH0pO1xufSk7XG4iXX0=