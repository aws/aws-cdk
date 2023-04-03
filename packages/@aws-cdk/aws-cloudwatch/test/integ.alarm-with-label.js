"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class AlarmWithLabelIntegrationTest extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
            label: 'Metric [AVG: ${AVG}]',
        });
        new lib_1.Alarm(this, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        testMetric.createAlarm(this, 'Alarm2', {
            threshold: 100,
            evaluationPeriods: 3,
        });
    }
}
const app = new core_1.App();
new integ_tests_1.IntegTest(app, 'cdk-cloudwatch-alarms-with-label-integ-test', {
    testCases: [new AlarmWithLabelIntegrationTest(app, 'AlarmWithLabelIntegrationTest')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxhcm0td2l0aC1sYWJlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFsYXJtLXdpdGgtbGFiZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBdUQ7QUFDdkQsc0RBQWlEO0FBQ2pELGdDQUF1QztBQUV2QyxNQUFNLDZCQUE4QixTQUFRLFlBQUs7SUFFL0MsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sVUFBVSxHQUFHLElBQUksWUFBTSxDQUFDO1lBQzVCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLEtBQUssRUFBRSxzQkFBc0I7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN4QixNQUFNLEVBQUUsVUFBVTtZQUNsQixTQUFTLEVBQUUsR0FBRztZQUNkLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3JDLFNBQVMsRUFBRSxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLDZDQUE2QyxFQUFFO0lBQ2hFLFNBQVMsRUFBRSxDQUFDLElBQUksNkJBQTZCLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7Q0FDckYsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQWxhcm0sIE1ldHJpYyB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEFsYXJtV2l0aExhYmVsSW50ZWdyYXRpb25UZXN0IGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdGVzdE1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICBsYWJlbDogJ01ldHJpYyBbQVZHOiAke0FWR31dJyxcbiAgICB9KTtcblxuICAgIG5ldyBBbGFybSh0aGlzLCAnQWxhcm0xJywge1xuICAgICAgbWV0cmljOiB0ZXN0TWV0cmljLFxuICAgICAgdGhyZXNob2xkOiAxMDAsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMyxcbiAgICB9KTtcblxuICAgIHRlc3RNZXRyaWMuY3JlYXRlQWxhcm0odGhpcywgJ0FsYXJtMicsIHtcbiAgICAgIHRocmVzaG9sZDogMTAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Nkay1jbG91ZHdhdGNoLWFsYXJtcy13aXRoLWxhYmVsLWludGVnLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW25ldyBBbGFybVdpdGhMYWJlbEludGVncmF0aW9uVGVzdChhcHAsICdBbGFybVdpdGhMYWJlbEludGVncmF0aW9uVGVzdCcpXSxcbn0pO1xuIl19