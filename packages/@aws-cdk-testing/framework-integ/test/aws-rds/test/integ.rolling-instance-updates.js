"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const integTests = require("@aws-cdk/integ-tests-alpha");
const rds = require("aws-cdk-lib/aws-rds");
class RollingInstanceUpdateTestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', {
            maxAzs: 2,
        });
        new rds.DatabaseCluster(this, 'DatabaseCluster', {
            engine: rds.DatabaseClusterEngine.AURORA,
            instances: 3,
            instanceProps: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
                vpc,
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            instanceUpdateBehaviour: props.instanceUpdateBehaviour,
        });
    }
}
// Beginning of the test suite
const app = new cdk.App();
new integTests.IntegTest(app, 'InstanceUpdateBehaviorTests', {
    testCases: [
        new RollingInstanceUpdateTestStack(app, 'BulkUpdate', {
            instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.BULK,
        }),
        new RollingInstanceUpdateTestStack(app, 'RollingUpdate', {
            instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.ROLLING,
        }),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucm9sbGluZy1pbnN0YW5jZS11cGRhdGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucm9sbGluZy1pbnN0YW5jZS11cGRhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyx5REFBeUQ7QUFFekQsMkNBQTJDO0FBTTNDLE1BQU0sOEJBQStCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDcEQsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUEwQztRQUM3RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUNuQyxNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDL0MsTUFBTSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNO1lBQ3hDLFNBQVMsRUFBRSxDQUFDO1lBQ1osYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFDdkYsR0FBRzthQUNKO1lBQ0QsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4Qyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCO1NBQ3ZELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUdELDhCQUE4QjtBQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDZCQUE2QixFQUFFO0lBQzNELFNBQVMsRUFBRTtRQUNULElBQUksOEJBQThCLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRTtZQUNwRCx1QkFBdUIsRUFBRSxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSTtTQUMxRCxDQUFDO1FBQ0YsSUFBSSw4QkFBOEIsQ0FBQyxHQUFHLEVBQUUsZUFBZSxFQUFFO1lBQ3ZELHVCQUF1QixFQUFFLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPO1NBQzdELENBQUM7S0FDSDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZ1Rlc3RzIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XG5cbmludGVyZmFjZSBSb2xsaW5nSW5zdGFuY2VVcGRhdGVUZXN0U3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgaW5zdGFuY2VVcGRhdGVCZWhhdmlvdXI6IHJkcy5JbnN0YW5jZVVwZGF0ZUJlaGF2aW91cjtcbn1cblxuY2xhc3MgUm9sbGluZ0luc3RhbmNlVXBkYXRlVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUm9sbGluZ0luc3RhbmNlVXBkYXRlVGVzdFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywge1xuICAgICAgbWF4QXpzOiAyLFxuICAgIH0pO1xuXG4gICAgbmV3IHJkcy5EYXRhYmFzZUNsdXN0ZXIodGhpcywgJ0RhdGFiYXNlQ2x1c3RlcicsIHtcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlQ2x1c3RlckVuZ2luZS5BVVJPUkEsXG4gICAgICBpbnN0YW5jZXM6IDMsXG4gICAgICBpbnN0YW5jZVByb3BzOiB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUzLCBlYzIuSW5zdGFuY2VTaXplLlNNQUxMKSxcbiAgICAgICAgdnBjLFxuICAgICAgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBpbnN0YW5jZVVwZGF0ZUJlaGF2aW91cjogcHJvcHMuaW5zdGFuY2VVcGRhdGVCZWhhdmlvdXIsXG4gICAgfSk7XG4gIH1cbn1cblxuXG4vLyBCZWdpbm5pbmcgb2YgdGhlIHRlc3Qgc3VpdGVcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgaW50ZWdUZXN0cy5JbnRlZ1Rlc3QoYXBwLCAnSW5zdGFuY2VVcGRhdGVCZWhhdmlvclRlc3RzJywge1xuICB0ZXN0Q2FzZXM6IFtcbiAgICBuZXcgUm9sbGluZ0luc3RhbmNlVXBkYXRlVGVzdFN0YWNrKGFwcCwgJ0J1bGtVcGRhdGUnLCB7XG4gICAgICBpbnN0YW5jZVVwZGF0ZUJlaGF2aW91cjogcmRzLkluc3RhbmNlVXBkYXRlQmVoYXZpb3VyLkJVTEssXG4gICAgfSksXG4gICAgbmV3IFJvbGxpbmdJbnN0YW5jZVVwZGF0ZVRlc3RTdGFjayhhcHAsICdSb2xsaW5nVXBkYXRlJywge1xuICAgICAgaW5zdGFuY2VVcGRhdGVCZWhhdmlvdXI6IHJkcy5JbnN0YW5jZVVwZGF0ZUJlaGF2aW91ci5ST0xMSU5HLFxuICAgIH0pLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19