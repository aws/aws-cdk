"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const integ = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
/**
 * Test verifies that node-proxy-agent is invoked successfully inside Lambda runtime.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-node-proxy-agent-integ-stack');
const layer = new lib_1.NodeProxyAgentLayer(stack, 'NodeProxyAgentLayer');
const provider = new cr.Provider(stack, 'ProviderNode14', {
    onEventHandler: new lambda.Function(stack, 'Lambda$Node14', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        layers: [layer],
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
    }),
});
new cdk.CustomResource(stack, 'CustomResourceNode14', {
    serviceToken: provider.serviceToken,
});
new integ.IntegTest(app, 'lambda-layer-node-proxy-agent-integ-test', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubm9kZS1wcm94eS1hZ2VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm5vZGUtcHJveHktYWdlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLHFDQUFxQztBQUNyQyxnREFBZ0Q7QUFDaEQsOENBQThDO0FBRTlDLGdDQUE2QztBQUU3Qzs7R0FFRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztBQUM5RSxNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDeEQsY0FBYyxFQUFFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQzFELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7UUFDbkMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2YsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0tBQ2xDLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO0lBQ3BELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtDQUNwQyxDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDBDQUEwQyxFQUFFO0lBQ25FLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQixpQkFBaUIsRUFBRTtRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcblxuaW1wb3J0IHsgTm9kZVByb3h5QWdlbnRMYXllciB9IGZyb20gJy4uL2xpYic7XG5cbi8qKlxuICogVGVzdCB2ZXJpZmllcyB0aGF0IG5vZGUtcHJveHktYWdlbnQgaXMgaW52b2tlZCBzdWNjZXNzZnVsbHkgaW5zaWRlIExhbWJkYSBydW50aW1lLlxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnbGFtYmRhLWxheWVyLW5vZGUtcHJveHktYWdlbnQtaW50ZWctc3RhY2snKTtcbmNvbnN0IGxheWVyID0gbmV3IE5vZGVQcm94eUFnZW50TGF5ZXIoc3RhY2ssICdOb2RlUHJveHlBZ2VudExheWVyJyk7XG5cbmNvbnN0IHByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXJOb2RlMTQnLCB7XG4gIG9uRXZlbnRIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTGFtYmRhJE5vZGUxNCcsIHtcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYS1oYW5kbGVyJykpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBsYXllcnM6IFtsYXllcl0sXG4gICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgfSksXG59KTtcblxubmV3IGNkay5DdXN0b21SZXNvdXJjZShzdGFjaywgJ0N1c3RvbVJlc291cmNlTm9kZTE0Jywge1xuICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2xhbWJkYS1sYXllci1ub2RlLXByb3h5LWFnZW50LWludGVnLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiXX0=