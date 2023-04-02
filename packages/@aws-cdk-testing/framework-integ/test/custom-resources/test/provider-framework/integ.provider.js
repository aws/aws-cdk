"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const constructs_1 = require("constructs");
const s3_assert_1 = require("./integration-test-fixtures/s3-assert");
const s3_file_1 = require("./integration-test-fixtures/s3-file");
class TestStack extends aws_cdk_lib_1.Stack {
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
        new aws_cdk_lib_1.CfnOutput(this, 'file1-url', { value: file1.url });
        new aws_cdk_lib_1.CfnOutput(this, 'file2-url', { value: file2.url });
        new aws_cdk_lib_1.CfnOutput(this, 'file3-url', { value: file3.url });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'integ-provider-framework');
new integ.IntegTest(app, 'IntegProviderFrameworkTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFnQjtBQUNoQix5Q0FBeUM7QUFDekMsNkNBQW9EO0FBQ3BELG9EQUFvRDtBQUNwRCwyQ0FBNkM7QUFDN0MscUVBQWlFO0FBQ2pFLGlFQUE2RDtBQUU3RCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sYUFBYSxHQUFHLHVDQUF1QyxDQUFDO1FBQzlELE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDdEMsTUFBTTtZQUNOLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFFBQVEsRUFBRSxxQkFBcUI7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDdEMsTUFBTTtZQUNOLFFBQVEsRUFBRSxhQUFhO1NBQ3hCLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQzFDLE1BQU07WUFDTixTQUFTLEVBQUUseURBQXlEO1lBQ3BFLFFBQVEsRUFBRSx5REFBeUQ7U0FDcEUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxvQkFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDaEMsTUFBTTtZQUNOLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixlQUFlLEVBQUUsYUFBYTtTQUMvQixDQUFDLENBQUM7UUFFSCxzREFBc0Q7UUFDdEQsaUJBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBRTdELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLEVBQUU7SUFDckQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnICpcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFMzQXNzZXJ0IH0gZnJvbSAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWFzc2VydCc7XG5pbXBvcnQgeyBTM0ZpbGUgfSBmcm9tICcuL2ludGVncmF0aW9uLXRlc3QtZml4dHVyZXMvczMtZmlsZSc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmaWxlMkNvbnRlbnRzID0gJ3RoaXMgZmlsZSBoYXMgYSBnZW5lcmF0ZWQgcGh5c2ljYWwgaWQnO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ015QnVja2V0Jyk7XG5cbiAgICBjb25zdCBmaWxlMSA9IG5ldyBTM0ZpbGUodGhpcywgJ2ZpbGUxJywge1xuICAgICAgYnVja2V0LFxuICAgICAgb2JqZWN0S2V5OiAnc2Vjb25kLnR4dCcsXG4gICAgICBjb250ZW50czogJ0hlbGxvLCB3b3JsZCwgMTk4MCEnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZTIgPSBuZXcgUzNGaWxlKHRoaXMsICdmaWxlMicsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIGNvbnRlbnRzOiBmaWxlMkNvbnRlbnRzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZTMgPSBuZXcgUzNGaWxlKHRoaXMsICdmaWxlM1V0ZjgnLCB7XG4gICAgICBidWNrZXQsXG4gICAgICBvYmplY3RLZXk6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWsOFw4TDliFcIiPCpCUmLygpPT9gwrReKit+Xy0uLDo7PD58JyxcbiAgICAgIGNvbnRlbnRzOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVrDhcOEw5YhXCIjwqQlJi8oKT0/YMK0Xiorfl8tLiw6Ozw+fCcsXG4gICAgfSk7XG5cbiAgICBuZXcgUzNBc3NlcnQodGhpcywgJ2Fzc2VydC1maWxlJywge1xuICAgICAgYnVja2V0LFxuICAgICAgb2JqZWN0S2V5OiBmaWxlMi5vYmplY3RLZXksXG4gICAgICBleHBlY3RlZENvbnRlbnQ6IGZpbGUyQ29udGVudHMsXG4gICAgfSk7XG5cbiAgICAvLyBkZWxheSBmaWxlMiB1cGRhdGVzIHNvIHdlIGNhbiB0ZXN0IGFzeW5jIGFzc2VydGlvbnNcbiAgICBOb2RlLm9mKGZpbGUyKS5hZGREZXBlbmRlbmN5KGZpbGUxKTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ2ZpbGUxLXVybCcsIHsgdmFsdWU6IGZpbGUxLnVybCB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdmaWxlMi11cmwnLCB7IHZhbHVlOiBmaWxlMi51cmwgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnZmlsZTMtdXJsJywgeyB2YWx1ZTogZmlsZTMudXJsIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdpbnRlZy1wcm92aWRlci1mcmFtZXdvcmsnKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdJbnRlZ1Byb3ZpZGVyRnJhbWV3b3JrVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19