"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:enable-lookups
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const eks = require("../lib");
const util_1 = require("./util");
class MyStack extends util_1.TestStack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });
        // two on-demand instances
        const cluster = new eks.Cluster(this, 'myCluster', {
            defaultCapacity: 2,
            vpc,
        });
        // up to ten spot instances
        cluster.addCapacity('spot', {
            spotPrice: '0.1094',
            instanceType: new ec2.InstanceType('t3.large'),
            maxCapacity: 10,
            bootstrapOptions: {
                kubeletExtraArgs: '--node-labels foo=bar,goo=far',
                awsApiRetryAttempts: 5,
            },
        });
    }
}
const app = new core_1.App();
new MyStack(app, 'integ-eks-spot');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLXNwb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3Mtc3BvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUFvQztBQUNwQyx3Q0FBd0M7QUFDeEMsd0NBQW9DO0FBRXBDLDhCQUE4QjtBQUM5QixpQ0FBbUM7QUFFbkMsTUFBTSxPQUFRLFNBQVEsZ0JBQVM7SUFDN0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNqRCxlQUFlLEVBQUUsQ0FBQztZQUNsQixHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgsMkJBQTJCO1FBQzNCLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzFCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQzlDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGdCQUFnQixFQUFFLCtCQUErQjtnQkFDakQsbUJBQW1CLEVBQUUsQ0FBQzthQUN2QjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ25DLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTplbmFibGUtbG9va3Vwc1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgVGVzdFN0YWNrIH0gZnJvbSAnLi91dGlsJztcblxuY2xhc3MgTXlTdGFjayBleHRlbmRzIFRlc3RTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ3ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG4gICAgLy8gdHdvIG9uLWRlbWFuZCBpbnN0YW5jZXNcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdteUNsdXN0ZXInLCB7XG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyB1cCB0byB0ZW4gc3BvdCBpbnN0YW5jZXNcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdzcG90Jywge1xuICAgICAgc3BvdFByaWNlOiAnMC4xMDk0JyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLmxhcmdlJyksXG4gICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgICBib290c3RyYXBPcHRpb25zOiB7XG4gICAgICAgIGt1YmVsZXRFeHRyYUFyZ3M6ICctLW5vZGUtbGFiZWxzIGZvbz1iYXIsZ29vPWZhcicsXG4gICAgICAgIGF3c0FwaVJldHJ5QXR0ZW1wdHM6IDUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBNeVN0YWNrKGFwcCwgJ2ludGVnLWVrcy1zcG90Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==