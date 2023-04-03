"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
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
        new s3_assert_1.S3Assert(this, 'assert-file', {
            bucket,
            objectKey: file2.objectKey,
            expectedContent: file2Contents,
        });
        // delay file2 updates so we can test async assertions
        constructs_1.Node.of(file2).addDependency(file1);
        new core_1.CfnOutput(this, 'file1-url', { value: file1.url });
        new core_1.CfnOutput(this, 'file2-url', { value: file2.url });
    }
}
const app = new core_1.App();
new TestStack(app, 'integ-provider-framework');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFnQjtBQUNoQixzQ0FBc0M7QUFDdEMsd0NBQXNEO0FBQ3RELDJDQUE2QztBQUM3QyxxRUFBaUU7QUFDakUsaUVBQTZEO0FBRTdELE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLGFBQWEsR0FBRyx1Q0FBdUMsQ0FBQztRQUM5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sS0FBSyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3RDLE1BQU07WUFDTixTQUFTLEVBQUUsWUFBWTtZQUN2QixRQUFRLEVBQUUscUJBQXFCO1NBQ2hDLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3RDLE1BQU07WUFDTixRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLG9CQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoQyxNQUFNO1lBQ04sU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLGVBQWUsRUFBRSxhQUFhO1NBQy9CLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDeEQ7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFFL0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgKlxuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTM0Fzc2VydCB9IGZyb20gJy4vaW50ZWdyYXRpb24tdGVzdC1maXh0dXJlcy9zMy1hc3NlcnQnO1xuaW1wb3J0IHsgUzNGaWxlIH0gZnJvbSAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWZpbGUnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZmlsZTJDb250ZW50cyA9ICd0aGlzIGZpbGUgaGFzIGEgZ2VuZXJhdGVkIHBoeXNpY2FsIGlkJztcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdNeUJ1Y2tldCcpO1xuXG4gICAgY29uc3QgZmlsZTEgPSBuZXcgUzNGaWxlKHRoaXMsICdmaWxlMScsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIG9iamVjdEtleTogJ3NlY29uZC50eHQnLFxuICAgICAgY29udGVudHM6ICdIZWxsbywgd29ybGQsIDE5ODAhJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGUyID0gbmV3IFMzRmlsZSh0aGlzLCAnZmlsZTInLCB7XG4gICAgICBidWNrZXQsXG4gICAgICBjb250ZW50czogZmlsZTJDb250ZW50cyxcbiAgICB9KTtcblxuICAgIG5ldyBTM0Fzc2VydCh0aGlzLCAnYXNzZXJ0LWZpbGUnLCB7XG4gICAgICBidWNrZXQsXG4gICAgICBvYmplY3RLZXk6IGZpbGUyLm9iamVjdEtleSxcbiAgICAgIGV4cGVjdGVkQ29udGVudDogZmlsZTJDb250ZW50cyxcbiAgICB9KTtcblxuICAgIC8vIGRlbGF5IGZpbGUyIHVwZGF0ZXMgc28gd2UgY2FuIHRlc3QgYXN5bmMgYXNzZXJ0aW9uc1xuICAgIE5vZGUub2YoZmlsZTIpLmFkZERlcGVuZGVuY3koZmlsZTEpO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnZmlsZTEtdXJsJywgeyB2YWx1ZTogZmlsZTEudXJsIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ2ZpbGUyLXVybCcsIHsgdmFsdWU6IGZpbGUyLnVybCB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbm5ldyBUZXN0U3RhY2soYXBwLCAnaW50ZWctcHJvdmlkZXItZnJhbWV3b3JrJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19