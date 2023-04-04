"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const s3 = require("aws-cdk-lib/aws-s3");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-cdk-s3');
new s3.Bucket(stack, 'MyBucket', {
    intelligentTieringConfigurations: [{
            name: 'foo',
            prefix: 'bar',
            archiveAccessTierTime: aws_cdk_lib_1.Duration.days(90),
            deepArchiveAccessTierTime: aws_cdk_lib_1.Duration.days(180),
            tags: [{ key: 'test', value: 'bazz' }],
        }],
});
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-intelligent-tiering', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWludGVsbGlnZW50LXRpZXJpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtaW50ZWxsaWdlbnQtdGllcmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFtRDtBQUNuRCxrRUFBdUQ7QUFDdkQseUNBQXlDO0FBRXpDLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFM0MsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDL0IsZ0NBQWdDLEVBQUUsQ0FBQztZQUNqQyxJQUFJLEVBQUUsS0FBSztZQUNYLE1BQU0sRUFBRSxLQUFLO1lBQ2IscUJBQXFCLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3hDLHlCQUF5QixFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUM3QyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3ZDLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFHSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLCtCQUErQixFQUFFO0lBQ2xELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnYXdzLWNkay1zMycpO1xuXG5uZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zOiBbe1xuICAgIG5hbWU6ICdmb28nLFxuICAgIHByZWZpeDogJ2JhcicsXG4gICAgYXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBEdXJhdGlvbi5kYXlzKDkwKSxcbiAgICBkZWVwQXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBEdXJhdGlvbi5kYXlzKDE4MCksXG4gICAgdGFnczogW3sga2V5OiAndGVzdCcsIHZhbHVlOiAnYmF6eicgfV0sXG4gIH1dLFxufSk7XG5cblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctaW50ZWxsaWdlbnQtdGllcmluZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG4iXX0=