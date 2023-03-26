"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class LogRetentionIntegStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lib_1.LogRetention(this, 'MyLambda', {
            logGroupName: 'logRetentionLogGroup',
            retention: lib_1.RetentionDays.ONE_DAY,
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new lib_1.LogRetention(this, 'MyLambda2', {
            logGroupName: 'logRetentionLogGroup2',
            retention: lib_1.RetentionDays.ONE_DAY,
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
    }
}
const app = new core_1.App();
const stack = new LogRetentionIntegStack(app, 'aws-cdk-log-retention-integ');
new integ_tests_1.IntegTest(app, 'LogRetentionInteg', { testCases: [stack] });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubG9nLXJldGVudGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxvZy1yZXRlbnRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBc0U7QUFDdEUsc0RBQWlEO0FBQ2pELGdDQUFxRDtBQUVyRCxNQUFNLHNCQUF1QixTQUFRLFlBQUs7SUFDeEMsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksa0JBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pDLFlBQVksRUFBRSxzQkFBc0I7WUFDcEMsU0FBUyxFQUFFLG1CQUFhLENBQUMsT0FBTztZQUNoQyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksa0JBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xDLFlBQVksRUFBRSx1QkFBdUI7WUFDckMsU0FBUyxFQUFFLG1CQUFhLENBQUMsT0FBTztZQUNoQyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQXNCLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFDN0UsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBMb2dSZXRlbnRpb24sIFJldGVudGlvbkRheXMgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBMb2dSZXRlbnRpb25JbnRlZ1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBMb2dSZXRlbnRpb24odGhpcywgJ015TGFtYmRhJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnbG9nUmV0ZW50aW9uTG9nR3JvdXAnLFxuICAgICAgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9EQVksXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBuZXcgTG9nUmV0ZW50aW9uKHRoaXMsICdNeUxhbWJkYTInLCB7XG4gICAgICBsb2dHcm91cE5hbWU6ICdsb2dSZXRlbnRpb25Mb2dHcm91cDInLFxuICAgICAgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9EQVksXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgTG9nUmV0ZW50aW9uSW50ZWdTdGFjayhhcHAsICdhd3MtY2RrLWxvZy1yZXRlbnRpb24taW50ZWcnKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnTG9nUmV0ZW50aW9uSW50ZWcnLCB7IHRlc3RDYXNlczogW3N0YWNrXSB9KTtcbmFwcC5zeW50aCgpOyJdfQ==