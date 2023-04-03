"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const constructs_1 = require("constructs");
const s3_assert_1 = require("./integration-test-fixtures/s3-assert");
const s3_file_1 = require("./integration-test-fixtures/s3-file");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const file2Contents = 'this file has a generated physical id';
        const bucket = new s3.Bucket(this, 'MyBucket');
        const file1 = new s3_file_1.S3File(this, 'file1', {
            bucket,
            objectKey: 'second.txt',
            contents: 'Hello, world, 1980!',
        });
        const file2 = new s3_file_1.S3File(this, 'file2', {
            bucket,
            contents: file2Contents,
        });
        const file3 = new s3_file_1.S3File(this, 'file3Utf8', {
            bucket,
            objectKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
            contents: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
        });
        new s3_assert_1.S3Assert(this, 'assert-file', {
            bucket,
            objectKey: file2.objectKey,
            expectedContent: file2Contents,
        });
        // delay file2 updates so we can test async assertions
        constructs_1.Node.of(file2).addDependency(file1);
        new core_1.CfnOutput(this, 'file1-url', { value: file1.url });
        new core_1.CfnOutput(this, 'file2-url', { value: file2.url });
        new core_1.CfnOutput(this, 'file3-url', { value: file3.url });
    }
}
const app = new core_1.App();
const stack = new TestStack(app, 'integ-provider-framework');
new integ.IntegTest(app, 'IntegProviderFrameworkTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFnQjtBQUNoQixzQ0FBc0M7QUFDdEMsd0NBQXNEO0FBQ3RELDhDQUE4QztBQUM5QywyQ0FBNkM7QUFDN0MscUVBQWlFO0FBQ2pFLGlFQUE2RDtBQUU3RCxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsdUNBQXVDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUvQyxNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN0QyxNQUFNO1lBQ04sU0FBUyxFQUFFLFlBQVk7WUFDdkIsUUFBUSxFQUFFLHFCQUFxQjtTQUNoQyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN0QyxNQUFNO1lBQ04sUUFBUSxFQUFFLGFBQWE7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDMUMsTUFBTTtZQUNOLFNBQVMsRUFBRSx5REFBeUQ7WUFDcEUsUUFBUSxFQUFFLHlEQUF5RDtTQUNwRSxDQUFDLENBQUM7UUFFSCxJQUFJLG9CQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoQyxNQUFNO1lBQ04sU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLGVBQWUsRUFBRSxhQUFhO1NBQy9CLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDeEQ7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFFN0QsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsRUFBRTtJQUNyRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgKlxuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTM0Fzc2VydCB9IGZyb20gJy4vaW50ZWdyYXRpb24tdGVzdC1maXh0dXJlcy9zMy1hc3NlcnQnO1xuaW1wb3J0IHsgUzNGaWxlIH0gZnJvbSAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZmlsZTJDb250ZW50cyA9ICd0aGlzIGZpbGUgaGFzIGEgZ2VuZXJhdGVkIHBoeXNpY2FsIGlkJztcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdNeUJ1Y2tldCcpO1xuXG4gICAgY29uc3QgZmlsZTEgPSBuZXcgUzNGaWxlKHRoaXMsICdmaWxlMScsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIG9iamVjdEtleTogJ3NlY29uZC50eHQnLFxuICAgICAgY29udGVudHM6ICdIZWxsbywgd29ybGQsIDE5ODAhJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGUyID0gbmV3IFMzRmlsZSh0aGlzLCAnZmlsZTInLCB7XG4gICAgICBidWNrZXQsXG4gICAgICBjb250ZW50czogZmlsZTJDb250ZW50cyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGUzID0gbmV3IFMzRmlsZSh0aGlzLCAnZmlsZTNVdGY4Jywge1xuICAgICAgYnVja2V0LFxuICAgICAgb2JqZWN0S2V5OiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVrDhcOEw5YhXCIjwqQlJi8oKT0/YMK0Xiorfl8tLiw6Ozw+fCcsXG4gICAgICBjb250ZW50czogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaw4XDhMOWIVwiI8KkJSYvKCk9P2DCtF4qK35fLS4sOjs8PnwnLFxuICAgIH0pO1xuXG4gICAgbmV3IFMzQXNzZXJ0KHRoaXMsICdhc3NlcnQtZmlsZScsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIG9iamVjdEtleTogZmlsZTIub2JqZWN0S2V5LFxuICAgICAgZXhwZWN0ZWRDb250ZW50OiBmaWxlMkNvbnRlbnRzLFxuICAgIH0pO1xuXG4gICAgLy8gZGVsYXkgZmlsZTIgdXBkYXRlcyBzbyB3ZSBjYW4gdGVzdCBhc3luYyBhc3NlcnRpb25zXG4gICAgTm9kZS5vZihmaWxlMikuYWRkRGVwZW5kZW5jeShmaWxlMSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdmaWxlMS11cmwnLCB7IHZhbHVlOiBmaWxlMS51cmwgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnZmlsZTItdXJsJywgeyB2YWx1ZTogZmlsZTIudXJsIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ2ZpbGUzLXVybCcsIHsgdmFsdWU6IGZpbGUzLnVybCB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnaW50ZWctcHJvdmlkZXItZnJhbWV3b3JrJyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnSW50ZWdQcm92aWRlckZyYW1ld29ya1Rlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==