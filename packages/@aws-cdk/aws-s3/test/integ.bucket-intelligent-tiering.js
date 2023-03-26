"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const s3 = require("../lib/index");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-s3');
new s3.Bucket(stack, 'MyBucket', {
    intelligentTieringConfigurations: [{
            name: 'foo',
            prefix: 'bar',
            archiveAccessTierTime: core_1.Duration.days(90),
            deepArchiveAccessTierTime: core_1.Duration.days(180),
            tags: [{ key: 'test', value: 'bazz' }],
        }],
});
new integ_tests_1.IntegTest(app, 'cdk-integ-intelligent-tiering', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWludGVsbGlnZW50LXRpZXJpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtaW50ZWxsaWdlbnQtdGllcmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFxRDtBQUNyRCxzREFBaUQ7QUFDakQsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRTNDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQy9CLGdDQUFnQyxFQUFFLENBQUM7WUFDakMsSUFBSSxFQUFFLEtBQUs7WUFDWCxNQUFNLEVBQUUsS0FBSztZQUNiLHFCQUFxQixFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3hDLHlCQUF5QixFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQzdDLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDdkMsQ0FBQztDQUNILENBQUMsQ0FBQztBQUdILElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDbEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICcuLi9saWIvaW5kZXgnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstczMnKTtcblxubmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uczogW3tcbiAgICBuYW1lOiAnZm9vJyxcbiAgICBwcmVmaXg6ICdiYXInLFxuICAgIGFyY2hpdmVBY2Nlc3NUaWVyVGltZTogRHVyYXRpb24uZGF5cyg5MCksXG4gICAgZGVlcEFyY2hpdmVBY2Nlc3NUaWVyVGltZTogRHVyYXRpb24uZGF5cygxODApLFxuICAgIHRhZ3M6IFt7IGtleTogJ3Rlc3QnLCB2YWx1ZTogJ2JhenonIH1dLFxuICB9XSxcbn0pO1xuXG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLWludGVsbGlnZW50LXRpZXJpbmcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19