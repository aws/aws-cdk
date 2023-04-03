"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-s3');
new lib_1.Bucket(stack, 'MyBucket', {
    lifecycleRules: [{
            noncurrentVersionExpiration: core_1.Duration.days(30),
            noncurrentVersionsToRetain: 123,
        }],
});
new integ_tests_1.IntegTest(app, 'cdk-integ-lifecycle-expiration', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGlmZWN5Y2xlLWV4cGlyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5saWZlY3ljbGUtZXhwaXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFxRDtBQUNyRCxzREFBaUQ7QUFDakQsZ0NBQWdDO0FBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRTNDLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDNUIsY0FBYyxFQUFFLENBQUM7WUFDZiwyQkFBMkIsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM5QywwQkFBMEIsRUFBRSxHQUFHO1NBQ2hDLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxFQUFFO0lBQ25ELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtY2RrLXMzJyk7XG5cbm5ldyBCdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgbGlmZWN5Y2xlUnVsZXM6IFt7XG4gICAgbm9uY3VycmVudFZlcnNpb25FeHBpcmF0aW9uOiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgICBub25jdXJyZW50VmVyc2lvbnNUb1JldGFpbjogMTIzLFxuICB9XSxcbn0pO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Nkay1pbnRlZy1saWZlY3ljbGUtZXhwaXJhdGlvbicsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7Il19