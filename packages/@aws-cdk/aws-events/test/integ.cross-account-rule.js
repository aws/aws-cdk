"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
/**
 * Basic idea for this test is to create an EventBridge that "connects"
 *  an SQS queue in one account to another account. Nothing is sent on the
 *  queue, it's just used to set up the condition where aws-events creates
 *  a support stack.
 */
const app = new core_1.App();
const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '987654321';
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;
const fromCrossAccountStack = new core_1.Stack(app, 'FromCrossAccountRuleStack', {
    env: {
        account: crossAccount,
        region,
    },
});
/**
 * To make this testable, we need to have the stack that stores the event bridge be in
 *  the same account that the IntegTest stack is deployed into. Otherwise, we have no
 *  access to the IAM policy that the EventBusPolicy-account-region support stack creates.
 */
const toCrossAccountStack = new core_1.Stack(app, 'ToCrossAccountRuleStack', {
    env: {
        account,
        region,
    },
});
const queueName = 'IntegTestCrossEnvRule';
const queue = new core_1.CfnResource(toCrossAccountStack, 'Queue', {
    type: 'AWS::SQS::Queue',
    properties: {
        QueueName: queueName,
        ReceiveMessageWaitTimeSeconds: 20,
    },
});
const target = {
    bind: () => ({
        id: 'SQS',
        arn: core_1.Arn.format({
            resource: queueName,
            service: 'sqs',
        }, toCrossAccountStack),
        targetResource: queue,
    }),
};
new lib_1.Rule(fromCrossAccountStack, 'MyRule', {
    eventPattern: {
        detail: {
            foo: ['bar'],
        },
        detailType: ['cdk-integ-custom-rule'],
        source: ['cdk-integ'],
    },
    targets: [target],
});
toCrossAccountStack.addDependency(fromCrossAccountStack);
const integ = new integ_tests_1.IntegTest(app, 'CrossAccountDeploy', {
    testCases: [
        toCrossAccountStack,
    ],
});
// We are using the default event bus, don't need to define any parameters for this call.
const eventVerification = integ.assertions.awsApiCall('EventBridge', 'describeEventBus');
integ.node.addDependency(toCrossAccountStack);
eventVerification.provider.addPolicyStatementFromSdkCall('events', 'DescribeEventBus');
// IAM policy will be created by the support stack, assert that everything created as expected.
eventVerification.assertAtPath('Policy', integ_tests_1.ExpectedResult.objectLike({
    Statement: integ_tests_1.Match.arrayWith([integ_tests_1.Match.objectLike({
            Sid: integ_tests_1.Match.stringLikeRegexp(`Allow-account-${crossAccount}`),
            Principal: {
                AWS: `arn:aws:iam::${crossAccount}:root`,
            },
            Resource: integ_tests_1.Match.stringLikeRegexp(`arn:aws:events:us-east-1:${account}`),
        })]),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY3Jvc3MtYWNjb3VudC1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY3Jvc3MtYWNjb3VudC1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0JBQWdCO0FBQ2hCLHdDQUE2RDtBQUM3RCxzREFBd0U7QUFDeEUsZ0NBQTJDO0FBRTNDOzs7OztHQUtHO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7QUFFakYsK0VBQStFO0FBQy9FLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksV0FBVyxDQUFDO0FBQ3hFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUU5RSxNQUFNLHFCQUFxQixHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRTtJQUN4RSxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsWUFBWTtRQUNyQixNQUFNO0tBQ1A7Q0FDRixDQUFDLENBQUM7QUFFSDs7OztHQUlHO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDcEUsR0FBRyxFQUFFO1FBQ0gsT0FBTztRQUNQLE1BQU07S0FDUDtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sU0FBUyxHQUFHLHVCQUF1QixDQUFDO0FBRTFDLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQVcsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLEVBQUU7SUFDMUQsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixVQUFVLEVBQUU7UUFDVixTQUFTLEVBQUUsU0FBUztRQUNwQiw2QkFBNkIsRUFBRSxFQUFFO0tBQ2xDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQWdCO0lBQzFCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsRUFBRSxFQUFFLEtBQUs7UUFDVCxHQUFHLEVBQUUsVUFBRyxDQUFDLE1BQU0sQ0FBQztZQUNkLFFBQVEsRUFBRSxTQUFTO1lBQ25CLE9BQU8sRUFBRSxLQUFLO1NBQ2YsRUFBRSxtQkFBbUIsQ0FBQztRQUN2QixjQUFjLEVBQUUsS0FBSztLQUN0QixDQUFDO0NBQ0gsQ0FBQztBQUVGLElBQUksVUFBSSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsRUFBRTtJQUN4QyxZQUFZLEVBQUU7UUFDWixNQUFNLEVBQUU7WUFDTixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDYjtRQUNELFVBQVUsRUFBRSxDQUFDLHVCQUF1QixDQUFDO1FBQ3JDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUN0QjtJQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztDQUNsQixDQUFDLENBQUM7QUFFSCxtQkFBbUIsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUV6RCxNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFO0lBQ3JELFNBQVMsRUFBRTtRQUNULG1CQUFtQjtLQUNwQjtDQUNGLENBQUMsQ0FBQztBQUVILHlGQUF5RjtBQUN6RixNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXpGLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFOUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXZGLCtGQUErRjtBQUMvRixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLDRCQUFjLENBQUMsVUFBVSxDQUFDO0lBQ2pFLFNBQVMsRUFBRSxtQkFBSyxDQUFDLFNBQVMsQ0FDeEIsQ0FBQyxtQkFBSyxDQUFDLFVBQVUsQ0FBQztZQUNoQixHQUFHLEVBQUUsbUJBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsWUFBWSxFQUFFLENBQUM7WUFDNUQsU0FBUyxFQUFFO2dCQUNULEdBQUcsRUFBRSxnQkFBZ0IsWUFBWSxPQUFPO2FBQ3pDO1lBQ0QsUUFBUSxFQUFFLG1CQUFLLENBQUMsZ0JBQWdCLENBQUMsNEJBQTRCLE9BQU8sRUFBRSxDQUFDO1NBQ3hFLENBQUMsQ0FBQyxDQUNKO0NBQ0YsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyAqXG5pbXBvcnQgeyBBcHAsIEFybiwgQ2ZuUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBFeHBlY3RlZFJlc3VsdCwgSW50ZWdUZXN0LCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IFJ1bGUsIElSdWxlVGFyZ2V0IH0gZnJvbSAnLi4vbGliJztcblxuLyoqXG4gKiBCYXNpYyBpZGVhIGZvciB0aGlzIHRlc3QgaXMgdG8gY3JlYXRlIGFuIEV2ZW50QnJpZGdlIHRoYXQgXCJjb25uZWN0c1wiXG4gKiAgYW4gU1FTIHF1ZXVlIGluIG9uZSBhY2NvdW50IHRvIGFub3RoZXIgYWNjb3VudC4gTm90aGluZyBpcyBzZW50IG9uIHRoZVxuICogIHF1ZXVlLCBpdCdzIGp1c3QgdXNlZCB0byBzZXQgdXAgdGhlIGNvbmRpdGlvbiB3aGVyZSBhd3MtZXZlbnRzIGNyZWF0ZXNcbiAqICBhIHN1cHBvcnQgc3RhY2suXG4gKi9cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBhY2NvdW50ID0gcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0FDQ09VTlQgfHwgcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVDtcblxuLy8gQXMgdGhlIGludGVnLXJ1bm5lciBkb2VzbnQgcHJvdmlkZSBhIGRlZmF1bHQgY3Jvc3MgYWNjb3VudCwgd2UgbWFrZSBvdXIgb3duLlxuY29uc3QgY3Jvc3NBY2NvdW50ID0gcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0NST1NTX0FDQ09VTlQgfHwgJzk4NzY1NDMyMSc7XG5jb25zdCByZWdpb24gPSBwcm9jZXNzLmVudi5DREtfSU5URUdfUkVHSU9OIHx8IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTjtcblxuY29uc3QgZnJvbUNyb3NzQWNjb3VudFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0Zyb21Dcm9zc0FjY291bnRSdWxlU3RhY2snLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQ6IGNyb3NzQWNjb3VudCxcbiAgICByZWdpb24sXG4gIH0sXG59KTtcblxuLyoqXG4gKiBUbyBtYWtlIHRoaXMgdGVzdGFibGUsIHdlIG5lZWQgdG8gaGF2ZSB0aGUgc3RhY2sgdGhhdCBzdG9yZXMgdGhlIGV2ZW50IGJyaWRnZSBiZSBpblxuICogIHRoZSBzYW1lIGFjY291bnQgdGhhdCB0aGUgSW50ZWdUZXN0IHN0YWNrIGlzIGRlcGxveWVkIGludG8uIE90aGVyd2lzZSwgd2UgaGF2ZSBub1xuICogIGFjY2VzcyB0byB0aGUgSUFNIHBvbGljeSB0aGF0IHRoZSBFdmVudEJ1c1BvbGljeS1hY2NvdW50LXJlZ2lvbiBzdXBwb3J0IHN0YWNrIGNyZWF0ZXMuXG4gKi9cbmNvbnN0IHRvQ3Jvc3NBY2NvdW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVG9Dcm9zc0FjY291bnRSdWxlU3RhY2snLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQsXG4gICAgcmVnaW9uLFxuICB9LFxufSk7XG5jb25zdCBxdWV1ZU5hbWUgPSAnSW50ZWdUZXN0Q3Jvc3NFbnZSdWxlJztcblxuY29uc3QgcXVldWUgPSBuZXcgQ2ZuUmVzb3VyY2UodG9Dcm9zc0FjY291bnRTdGFjaywgJ1F1ZXVlJywge1xuICB0eXBlOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgcHJvcGVydGllczoge1xuICAgIFF1ZXVlTmFtZTogcXVldWVOYW1lLFxuICAgIFJlY2VpdmVNZXNzYWdlV2FpdFRpbWVTZWNvbmRzOiAyMCxcbiAgfSxcbn0pO1xuXG5jb25zdCB0YXJnZXQ6IElSdWxlVGFyZ2V0ID0ge1xuICBiaW5kOiAoKSA9PiAoe1xuICAgIGlkOiAnU1FTJyxcbiAgICBhcm46IEFybi5mb3JtYXQoe1xuICAgICAgcmVzb3VyY2U6IHF1ZXVlTmFtZSxcbiAgICAgIHNlcnZpY2U6ICdzcXMnLFxuICAgIH0sIHRvQ3Jvc3NBY2NvdW50U3RhY2spLFxuICAgIHRhcmdldFJlc291cmNlOiBxdWV1ZSxcbiAgfSksXG59O1xuXG5uZXcgUnVsZShmcm9tQ3Jvc3NBY2NvdW50U3RhY2ssICdNeVJ1bGUnLCB7XG4gIGV2ZW50UGF0dGVybjoge1xuICAgIGRldGFpbDoge1xuICAgICAgZm9vOiBbJ2JhciddLFxuICAgIH0sXG4gICAgZGV0YWlsVHlwZTogWydjZGstaW50ZWctY3VzdG9tLXJ1bGUnXSxcbiAgICBzb3VyY2U6IFsnY2RrLWludGVnJ10sXG4gIH0sXG4gIHRhcmdldHM6IFt0YXJnZXRdLFxufSk7XG5cbnRvQ3Jvc3NBY2NvdW50U3RhY2suYWRkRGVwZW5kZW5jeShmcm9tQ3Jvc3NBY2NvdW50U3RhY2spO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnQ3Jvc3NBY2NvdW50RGVwbG95Jywge1xuICB0ZXN0Q2FzZXM6IFtcbiAgICB0b0Nyb3NzQWNjb3VudFN0YWNrLFxuICBdLFxufSk7XG5cbi8vIFdlIGFyZSB1c2luZyB0aGUgZGVmYXVsdCBldmVudCBidXMsIGRvbid0IG5lZWQgdG8gZGVmaW5lIGFueSBwYXJhbWV0ZXJzIGZvciB0aGlzIGNhbGwuXG5jb25zdCBldmVudFZlcmlmaWNhdGlvbiA9IGludGVnLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnRXZlbnRCcmlkZ2UnLCAnZGVzY3JpYmVFdmVudEJ1cycpO1xuXG5pbnRlZy5ub2RlLmFkZERlcGVuZGVuY3kodG9Dcm9zc0FjY291bnRTdGFjayk7XG5cbmV2ZW50VmVyaWZpY2F0aW9uLnByb3ZpZGVyLmFkZFBvbGljeVN0YXRlbWVudEZyb21TZGtDYWxsKCdldmVudHMnLCAnRGVzY3JpYmVFdmVudEJ1cycpO1xuXG4vLyBJQU0gcG9saWN5IHdpbGwgYmUgY3JlYXRlZCBieSB0aGUgc3VwcG9ydCBzdGFjaywgYXNzZXJ0IHRoYXQgZXZlcnl0aGluZyBjcmVhdGVkIGFzIGV4cGVjdGVkLlxuZXZlbnRWZXJpZmljYXRpb24uYXNzZXJ0QXRQYXRoKCdQb2xpY3knLCBFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoXG4gICAgW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgU2lkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKGBBbGxvdy1hY2NvdW50LSR7Y3Jvc3NBY2NvdW50fWApLFxuICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgIEFXUzogYGFybjphd3M6aWFtOjoke2Nyb3NzQWNjb3VudH06cm9vdGAsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2U6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoYGFybjphd3M6ZXZlbnRzOnVzLWVhc3QtMToke2FjY291bnR9YCksXG4gICAgfSldLFxuICApLFxufSkpO1xuIl19