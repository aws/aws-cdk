"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudwatch_1 = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const logGroup = new lib_1.LogGroup(this, 'LogGroup', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        new lib_1.MetricFilter(this, 'MetricFilter', {
            logGroup,
            metricNamespace: 'MyApp',
            metricName: 'Latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            metricValue: '$.latency',
            dimensions: {
                ErrorCode: '$.errorCode',
            },
            unit: aws_cloudwatch_1.Unit.MILLISECONDS,
        });
    }
}
const app = new core_1.App();
const testCase = new TestStack(app, 'aws-cdk-metricfilter-unit-integ');
new integ_tests_1.IntegTest(app, 'metricfilter-unit', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWV0cmljZmlsdGVyLXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tZXRyaWNmaWx0ZXItdW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDREQUErQztBQUMvQyx3Q0FBc0U7QUFDdEUsc0RBQWlEO0FBQ2pELGdDQUErRDtBQUUvRCxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBQzNCLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxrQkFBWSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDckMsUUFBUTtZQUNSLGVBQWUsRUFBRSxPQUFPO1lBQ3hCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLGFBQWEsRUFBRSxtQkFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDaEQsV0FBVyxFQUFFLFdBQVc7WUFDeEIsVUFBVSxFQUFFO2dCQUNWLFNBQVMsRUFBRSxhQUFhO2FBQ3pCO1lBQ0QsSUFBSSxFQUFFLHFCQUFJLENBQUMsWUFBWTtTQUN4QixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztBQUV2RSxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG1CQUFtQixFQUFFO0lBQ3RDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVbml0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgRmlsdGVyUGF0dGVybiwgTG9nR3JvdXAsIE1ldHJpY0ZpbHRlciB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCAnTG9nR3JvdXAnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBuZXcgTWV0cmljRmlsdGVyKHRoaXMsICdNZXRyaWNGaWx0ZXInLCB7XG4gICAgICBsb2dHcm91cCxcbiAgICAgIG1ldHJpY05hbWVzcGFjZTogJ015QXBwJyxcbiAgICAgIG1ldHJpY05hbWU6ICdMYXRlbmN5JyxcbiAgICAgIGZpbHRlclBhdHRlcm46IEZpbHRlclBhdHRlcm4uZXhpc3RzKCckLmxhdGVuY3knKSxcbiAgICAgIG1ldHJpY1ZhbHVlOiAnJC5sYXRlbmN5JyxcbiAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgRXJyb3JDb2RlOiAnJC5lcnJvckNvZGUnLFxuICAgICAgfSxcbiAgICAgIHVuaXQ6IFVuaXQuTUlMTElTRUNPTkRTLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLW1ldHJpY2ZpbHRlci11bml0LWludGVnJyk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnbWV0cmljZmlsdGVyLXVuaXQnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=