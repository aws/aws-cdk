"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const cr = require("aws-cdk-lib/custom-resources");
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_awscli_1 = require("aws-cdk-lib/lambda-layer-awscli");
/**
 * Test verifies that AWS CLI is invoked successfully inside Lambda runtime.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-awscli-integ-stack');
const layer = new lambda_layer_awscli_1.AwsCliLayer(stack, 'AwsCliLayer');
const runtimes = [
    lambda.Runtime.PYTHON_3_7,
    lambda.Runtime.PYTHON_3_9,
];
for (const runtime of runtimes) {
    const provider = new cr.Provider(stack, `Provider${runtime.name}`, {
        onEventHandler: new lambda.Function(stack, `Lambda$${runtime.name}`, {
            code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
            handler: 'index.handler',
            runtime: runtime,
            layers: [layer],
            memorySize: 512,
            timeout: cdk.Duration.seconds(30),
        }),
    });
    new cdk.CustomResource(stack, `CustomResource${runtime.name}`, {
        serviceToken: provider.serviceToken,
    });
}
new integ.IntegTest(app, 'lambda-layer-awscli-integ-test', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzY2xpLWxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXdzY2xpLWxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLGlEQUFpRDtBQUNqRCxtQ0FBbUM7QUFDbkMsbURBQW1EO0FBQ25ELG9EQUFvRDtBQUVwRCx5RUFBOEQ7QUFFOUQ7O0dBRUc7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztBQUVwRCxNQUFNLFFBQVEsR0FBRztJQUNmLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtJQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7Q0FDMUIsQ0FBQztBQUVGLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO0lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDakUsY0FBYyxFQUFFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbkUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDbkUsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2YsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGlCQUFpQixPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDN0QsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO0tBQ3BDLENBQUMsQ0FBQztDQUNKO0FBRUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRTtJQUN6RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcblxuaW1wb3J0IHsgQXdzQ2xpTGF5ZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9sYW1iZGEtbGF5ZXItYXdzY2xpJztcblxuLyoqXG4gKiBUZXN0IHZlcmlmaWVzIHRoYXQgQVdTIENMSSBpcyBpbnZva2VkIHN1Y2Nlc3NmdWxseSBpbnNpZGUgTGFtYmRhIHJ1bnRpbWUuXG4gKi9cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdsYW1iZGEtbGF5ZXItYXdzY2xpLWludGVnLXN0YWNrJyk7XG5jb25zdCBsYXllciA9IG5ldyBBd3NDbGlMYXllcihzdGFjaywgJ0F3c0NsaUxheWVyJyk7XG5cbmNvbnN0IHJ1bnRpbWVzID0gW1xuICBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuXTtcblxuZm9yIChjb25zdCBydW50aW1lIG9mIHJ1bnRpbWVzKSB7XG4gIGNvbnN0IHByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHN0YWNrLCBgUHJvdmlkZXIke3J1bnRpbWUubmFtZX1gLCB7XG4gICAgb25FdmVudEhhbmRsZXI6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssIGBMYW1iZGEkJHtydW50aW1lLm5hbWV9YCwge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdsYW1iZGEtaGFuZGxlcicpKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IHJ1bnRpbWUsXG4gICAgICBsYXllcnM6IFtsYXllcl0sXG4gICAgICBtZW1vcnlTaXplOiA1MTIsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgfSksXG4gIH0pO1xuXG4gIG5ldyBjZGsuQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssIGBDdXN0b21SZXNvdXJjZSR7cnVudGltZS5uYW1lfWAsIHtcbiAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgfSk7XG59XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnbGFtYmRhLWxheWVyLWF3c2NsaS1pbnRlZy10ZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGNka0NvbW1hbmRPcHRpb25zOiB7XG4gICAgZGVwbG95OiB7XG4gICAgICBhcmdzOiB7XG4gICAgICAgIHJvbGxiYWNrOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXX0=