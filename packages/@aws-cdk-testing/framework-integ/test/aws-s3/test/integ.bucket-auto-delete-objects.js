"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const s3 = require("aws-cdk-lib/aws-s3");
const PUT_OBJECTS_RESOURCE_TYPE = 'Custom::S3PutObjects';
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, 'Bucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        // Put objects in the bucket to ensure auto delete works as expected
        const serviceToken = aws_cdk_lib_1.CustomResourceProvider.getOrCreate(this, PUT_OBJECTS_RESOURCE_TYPE, {
            codeDirectory: path.join(__dirname, 'put-objects-handler'),
            runtime: aws_cdk_lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Action: 's3:PutObject',
                    Resource: bucket.arnForObjects('*'),
                }],
        });
        new aws_cdk_lib_1.CustomResource(this, 'PutObjectsCustomResource', {
            resourceType: PUT_OBJECTS_RESOURCE_TYPE,
            serviceToken,
            properties: {
                BucketName: bucket.bucketName,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-s3-bucket-auto-delete-objects', {
    testCases: [new TestStack(app, 'cdk-s3-bucket-auto-delete-objects')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWF1dG8tZGVsZXRlLW9iamVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtYXV0by1kZWxldGUtb2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qiw2Q0FBMkk7QUFDM0ksa0VBQXVEO0FBRXZELHlDQUF5QztBQUV6QyxNQUFNLHlCQUF5QixHQUFHLHNCQUFzQixDQUFDO0FBRXpELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDM0MsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILG9FQUFvRTtRQUNwRSxNQUFNLFlBQVksR0FBRyxvQ0FBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFO1lBQ3ZGLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQztZQUMxRCxPQUFPLEVBQUUsMkNBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixNQUFNLEVBQUUsY0FBYztvQkFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO2lCQUNwQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUNuRCxZQUFZLEVBQUUseUJBQXlCO1lBQ3ZDLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO2FBQzlCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsRUFBRTtJQUM1RCxTQUFTLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztDQUNyRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQXBwLCBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuXG5jb25zdCBQVVRfT0JKRUNUU19SRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6UzNQdXRPYmplY3RzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0J1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gUHV0IG9iamVjdHMgaW4gdGhlIGJ1Y2tldCB0byBlbnN1cmUgYXV0byBkZWxldGUgd29ya3MgYXMgZXhwZWN0ZWRcbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIFBVVF9PQkpFQ1RTX1JFU09VUkNFX1RZUEUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdwdXQtb2JqZWN0cy1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgUmVzb3VyY2U6IGJ1Y2tldC5hcm5Gb3JPYmplY3RzKCcqJyksXG4gICAgICB9XSxcbiAgICB9KTtcbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1B1dE9iamVjdHNDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogUFVUX09CSkVDVFNfUkVTT1VSQ0VfVFlQRSxcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQnVja2V0TmFtZTogYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctczMtYnVja2V0LWF1dG8tZGVsZXRlLW9iamVjdHMnLCB7XG4gIHRlc3RDYXNlczogW25ldyBUZXN0U3RhY2soYXBwLCAnY2RrLXMzLWJ1Y2tldC1hdXRvLWRlbGV0ZS1vYmplY3RzJyldLFxufSk7XG4iXX0=