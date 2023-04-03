"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const certificatemanager = require("@aws-cdk/aws-certificatemanager");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cloudfront = require("../lib");
class AcmCertificateAliasStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const s3BucketSource = new s3.Bucket(this, 'Bucket');
        const certificate = new certificatemanager.Certificate(this, 'Certificate', {
            domainName: 'example.com',
            subjectAlternativeNames: ['*.example.com'],
        });
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'AnAmazingWebsiteProbably', {
            originConfigs: [{
                    s3OriginSource: { s3BucketSource },
                    behaviors: [{ isDefaultBehavior: true }],
                }],
            viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
                aliases: ['example.com', 'www.example.com'],
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
                sslMethod: cloudfront.SSLMethod.SNI,
            }),
        });
        /// !hide
        Array.isArray(s3BucketSource);
        Array.isArray(certificate);
        Array.isArray(distribution);
    }
}
const app = new core_1.App();
new AcmCertificateAliasStack(app, 'AcmCertificateAliasStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5hY20tY2VydC1hbGlhcy5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGFtcGxlLmFjbS1jZXJ0LWFsaWFzLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNFQUFzRTtBQUN0RSxzQ0FBc0M7QUFDdEMsd0NBQTJDO0FBRTNDLHFDQUFxQztBQUVyQyxNQUFNLHdCQUF5QixTQUFRLFlBQUs7SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixTQUFTO1FBQ1QsTUFBTSxjQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVyRCxNQUFNLFdBQVcsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzFFLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLHVCQUF1QixFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzNDLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUM5RixhQUFhLEVBQUUsQ0FBQztvQkFDZCxjQUFjLEVBQUUsRUFBRSxjQUFjLEVBQUU7b0JBQ2xDLFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3pDLENBQUM7WUFDRixpQkFBaUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQ2hFLFdBQVcsRUFDWDtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUM7Z0JBQzNDLGNBQWMsRUFBRSxVQUFVLENBQUMsc0JBQXNCLENBQUMsTUFBTTtnQkFDeEQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRzthQUNwQyxDQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztRQUVULEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQixLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzdCO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksd0JBQXdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDOUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2VydGlmaWNhdGVtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBBY21DZXJ0aWZpY2F0ZUFsaWFzU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIC8vLyAhc2hvd1xuICAgIGNvbnN0IHMzQnVja2V0U291cmNlID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQnVja2V0Jyk7XG5cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG5ldyBjZXJ0aWZpY2F0ZW1hbmFnZXIuQ2VydGlmaWNhdGUodGhpcywgJ0NlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgICAgIHN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBbJyouZXhhbXBsZS5jb20nXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24odGhpcywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgIHMzT3JpZ2luU291cmNlOiB7IHMzQnVja2V0U291cmNlIH0sXG4gICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICB9XSxcbiAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBjbG91ZGZyb250LlZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShcbiAgICAgICAgY2VydGlmaWNhdGUsXG4gICAgICAgIHtcbiAgICAgICAgICBhbGlhc2VzOiBbJ2V4YW1wbGUuY29tJywgJ3d3dy5leGFtcGxlLmNvbSddLFxuICAgICAgICAgIHNlY3VyaXR5UG9saWN5OiBjbG91ZGZyb250LlNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxLCAvLyBkZWZhdWx0XG4gICAgICAgICAgc3NsTWV0aG9kOiBjbG91ZGZyb250LlNTTE1ldGhvZC5TTkksIC8vIGRlZmF1bHRcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG5cbiAgICBBcnJheS5pc0FycmF5KHMzQnVja2V0U291cmNlKTtcbiAgICBBcnJheS5pc0FycmF5KGNlcnRpZmljYXRlKTtcbiAgICBBcnJheS5pc0FycmF5KGRpc3RyaWJ1dGlvbik7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IEFjbUNlcnRpZmljYXRlQWxpYXNTdGFjayhhcHAsICdBY21DZXJ0aWZpY2F0ZUFsaWFzU3RhY2snKTtcbmFwcC5zeW50aCgpO1xuIl19