"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib/core");
const integ = require("@aws-cdk/integ-tests-alpha");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const iam = require("aws-cdk-lib/aws-iam");
class TestBucketDeployment extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, 'Destination', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        const deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket,
            signContent: true,
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
        // The above code would be sufficient for an integration test to detect template changes,
        // and the stack would deploy successfully, but it would not test functionality because
        // PutObject payload signing is not mandatory unless enforced via custom resource policy.
        // With this as a dependency, successful deployment proves that the payloads were signed.
        const policyResult = bucket.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            principals: [new iam.AnyPrincipal()],
            actions: ['s3:PutObject'],
            resources: [`${bucket.bucketArn}/*`],
            conditions: {
                StringNotLike: {
                    's3:x-amz-content-sha256': '????????????????????????????????????????????????????????????????',
                },
            },
        }));
        deployment.node.addDependency(policyResult.policyDependable);
    }
}
const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-signobject');
new integ.IntegTest(app, 'integ-test-bucket-deployments', {
    testCases: [testCase],
    diffAssets: true,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQtc2lnbmNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtZGVwbG95bWVudC1zaWduY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix5Q0FBeUM7QUFDekMsd0NBQXdDO0FBQ3hDLG9EQUFvRDtBQUNwRCwwREFBMEQ7QUFDMUQsMkNBQTJDO0FBRzNDLE1BQU0sb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLGlCQUFpQixFQUFFLElBQUksRUFBRSxzQ0FBc0M7U0FDaEUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNuRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLGlCQUFpQixFQUFFLE1BQU07WUFDekIsV0FBVyxFQUFFLElBQUk7WUFDakIsY0FBYyxFQUFFLEtBQUssRUFBRSxpRUFBaUU7U0FDekYsQ0FBQyxDQUFDO1FBRUgseUZBQXlGO1FBQ3pGLHVGQUF1RjtRQUN2Rix5RkFBeUY7UUFDekYseUZBQXlGO1FBQ3pGLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FDN0MsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdkIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDO1lBQ3BDLFVBQVUsRUFBRTtnQkFDVixhQUFhLEVBQUU7b0JBQ2IseUJBQXlCLEVBQUUsa0VBQWtFO2lCQUM5RjthQUNGO1NBQ0YsQ0FBQyxDQUNILENBQUM7UUFDRixVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsZ0JBQWlCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBRXBGLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDeEQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3JCLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmNsYXNzIFRlc3RCdWNrZXREZXBsb3ltZW50IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnRGVzdGluYXRpb24nLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveW1lbnQnLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgICBzaWduQ29udGVudDogdHJ1ZSxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIC8vIFRoZSBhYm92ZSBjb2RlIHdvdWxkIGJlIHN1ZmZpY2llbnQgZm9yIGFuIGludGVncmF0aW9uIHRlc3QgdG8gZGV0ZWN0IHRlbXBsYXRlIGNoYW5nZXMsXG4gICAgLy8gYW5kIHRoZSBzdGFjayB3b3VsZCBkZXBsb3kgc3VjY2Vzc2Z1bGx5LCBidXQgaXQgd291bGQgbm90IHRlc3QgZnVuY3Rpb25hbGl0eSBiZWNhdXNlXG4gICAgLy8gUHV0T2JqZWN0IHBheWxvYWQgc2lnbmluZyBpcyBub3QgbWFuZGF0b3J5IHVubGVzcyBlbmZvcmNlZCB2aWEgY3VzdG9tIHJlc291cmNlIHBvbGljeS5cbiAgICAvLyBXaXRoIHRoaXMgYXMgYSBkZXBlbmRlbmN5LCBzdWNjZXNzZnVsIGRlcGxveW1lbnQgcHJvdmVzIHRoYXQgdGhlIHBheWxvYWRzIHdlcmUgc2lnbmVkLlxuICAgIGNvbnN0IHBvbGljeVJlc3VsdCA9IGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgICByZXNvdXJjZXM6IFtgJHtidWNrZXQuYnVja2V0QXJufS8qYF0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdOb3RMaWtlOiB7XG4gICAgICAgICAgICAnczM6eC1hbXotY29udGVudC1zaGEyNTYnOiAnPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/PycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgZGVwbG95bWVudC5ub2RlLmFkZERlcGVuZGVuY3kocG9saWN5UmVzdWx0LnBvbGljeURlcGVuZGFibGUhKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdEJ1Y2tldERlcGxveW1lbnQoYXBwLCAndGVzdC1idWNrZXQtZGVwbG95bWVudC1zaWdub2JqZWN0Jyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnaW50ZWctdGVzdC1idWNrZXQtZGVwbG95bWVudHMnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbiAgZGlmZkFzc2V0czogdHJ1ZSxcbn0pO1xuIl19