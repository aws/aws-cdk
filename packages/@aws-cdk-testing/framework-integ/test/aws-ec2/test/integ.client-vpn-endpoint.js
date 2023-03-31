"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const logs = require("aws-cdk-lib/aws-logs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const ec2 = require("aws-cdk-lib/aws-ec2");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Import server and client certificates in ACM
        const certificates = new ImportCertificates(this, 'ImportCertificates');
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });
        vpc.node.addDependency(certificates); // ensure certificates are deleted last, when not in use anymore
        const logGroup = new logs.LogGroup(this, 'LogGroup', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        vpc.addClientVpnEndpoint('Endpoint', {
            cidr: '10.100.0.0/16',
            serverCertificateArn: certificates.serverCertificateArn,
            clientCertificateArn: certificates.clientCertificateArn,
            logGroup,
        });
    }
}
const IMPORT_CERTIFICATES_RESOURCE_TYPE = 'Custom::ACMImportCertificates';
class ImportCertificates extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        const serviceToken = aws_cdk_lib_1.CustomResourceProvider.getOrCreate(this, IMPORT_CERTIFICATES_RESOURCE_TYPE, {
            codeDirectory: path.join(__dirname, 'import-certificates-handler'),
            runtime: aws_cdk_lib_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Action: ['acm:ImportCertificate', 'acm:DeleteCertificate'],
                    Resource: '*',
                }],
        });
        const createCertificates = new aws_cdk_lib_1.CustomResource(this, 'CreateCertificates', {
            resourceType: IMPORT_CERTIFICATES_RESOURCE_TYPE,
            serviceToken,
        });
        this.serverCertificateArn = createCertificates.getAttString('ClientCertificateArn');
        this.clientCertificateArn = createCertificates.getAttString('ServerCertificateArn');
        new aws_cdk_lib_1.CustomResource(this, 'DeleteCertificates', {
            resourceType: IMPORT_CERTIFICATES_RESOURCE_TYPE,
            serviceToken,
            properties: {
                ServerCertificateArn: this.serverCertificateArn,
                ClientCertificateArn: this.clientCertificateArn,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-ec2-client-vpn-endpoint');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xpZW50LXZwbi1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsaWVudC12cG4tZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsNkNBQTZDO0FBQzdDLDZDQUEySTtBQUMzSSwyQ0FBdUM7QUFDdkMsMkNBQTJDO0FBRTNDLE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsK0NBQStDO1FBQy9DLE1BQU0sWUFBWSxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFFeEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsZ0VBQWdFO1FBRXRHLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRTtZQUNuQyxJQUFJLEVBQUUsZUFBZTtZQUNyQixvQkFBb0IsRUFBRSxZQUFZLENBQUMsb0JBQW9CO1lBQ3ZELG9CQUFvQixFQUFFLFlBQVksQ0FBQyxvQkFBb0I7WUFDdkQsUUFBUTtTQUNULENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0saUNBQWlDLEdBQUcsK0JBQStCLENBQUM7QUFFMUUsTUFBTSxrQkFBbUIsU0FBUSxzQkFBUztJQUl4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sWUFBWSxHQUFHLG9DQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsaUNBQWlDLEVBQUU7WUFDL0YsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDZCQUE2QixDQUFDO1lBQ2xFLE9BQU8sRUFBRSwyQ0FBNkIsQ0FBQyxXQUFXO1lBQ2xELGdCQUFnQixFQUFFLENBQUM7b0JBQ2pCLE1BQU0sRUFBRSxPQUFPO29CQUNmLE1BQU0sRUFBRSxDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixDQUFDO29CQUMxRCxRQUFRLEVBQUUsR0FBRztpQkFDZCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLDRCQUFjLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3hFLFlBQVksRUFBRSxpQ0FBaUM7WUFDL0MsWUFBWTtTQUNiLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFcEYsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM3QyxZQUFZLEVBQUUsaUNBQWlDO1lBQy9DLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1Ysb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtnQkFDL0Msb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjthQUNoRDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2xELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzJztcbmltcG9ydCB7IEFwcCwgQ3VzdG9tUmVzb3VyY2UsIEN1c3RvbVJlc291cmNlUHJvdmlkZXIsIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gSW1wb3J0IHNlcnZlciBhbmQgY2xpZW50IGNlcnRpZmljYXRlcyBpbiBBQ01cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZXMgPSBuZXcgSW1wb3J0Q2VydGlmaWNhdGVzKHRoaXMsICdJbXBvcnRDZXJ0aWZpY2F0ZXMnKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDAgfSk7XG4gICAgdnBjLm5vZGUuYWRkRGVwZW5kZW5jeShjZXJ0aWZpY2F0ZXMpOyAvLyBlbnN1cmUgY2VydGlmaWNhdGVzIGFyZSBkZWxldGVkIGxhc3QsIHdoZW4gbm90IGluIHVzZSBhbnltb3JlXG5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIHZwYy5hZGRDbGllbnRWcG5FbmRwb2ludCgnRW5kcG9pbnQnLCB7XG4gICAgICBjaWRyOiAnMTAuMTAwLjAuMC8xNicsXG4gICAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogY2VydGlmaWNhdGVzLnNlcnZlckNlcnRpZmljYXRlQXJuLFxuICAgICAgY2xpZW50Q2VydGlmaWNhdGVBcm46IGNlcnRpZmljYXRlcy5jbGllbnRDZXJ0aWZpY2F0ZUFybixcbiAgICAgIGxvZ0dyb3VwLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IElNUE9SVF9DRVJUSUZJQ0FURVNfUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OkFDTUltcG9ydENlcnRpZmljYXRlcyc7XG5cbmNsYXNzIEltcG9ydENlcnRpZmljYXRlcyBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgY2xpZW50Q2VydGlmaWNhdGVBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHNlcnZpY2VUb2tlbiA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcywgSU1QT1JUX0NFUlRJRklDQVRFU19SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW1wb3J0LWNlcnRpZmljYXRlcy1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiBbJ2FjbTpJbXBvcnRDZXJ0aWZpY2F0ZScsICdhY206RGVsZXRlQ2VydGlmaWNhdGUnXSxcbiAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY3JlYXRlQ2VydGlmaWNhdGVzID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdDcmVhdGVDZXJ0aWZpY2F0ZXMnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IElNUE9SVF9DRVJUSUZJQ0FURVNfUkVTT1VSQ0VfVFlQRSxcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICB9KTtcbiAgICB0aGlzLnNlcnZlckNlcnRpZmljYXRlQXJuID0gY3JlYXRlQ2VydGlmaWNhdGVzLmdldEF0dFN0cmluZygnQ2xpZW50Q2VydGlmaWNhdGVBcm4nKTtcbiAgICB0aGlzLmNsaWVudENlcnRpZmljYXRlQXJuID0gY3JlYXRlQ2VydGlmaWNhdGVzLmdldEF0dFN0cmluZygnU2VydmVyQ2VydGlmaWNhdGVBcm4nKTtcblxuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnRGVsZXRlQ2VydGlmaWNhdGVzJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBJTVBPUlRfQ0VSVElGSUNBVEVTX1JFU09VUkNFX1RZUEUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZlckNlcnRpZmljYXRlQXJuOiB0aGlzLnNlcnZlckNlcnRpZmljYXRlQXJuLFxuICAgICAgICBDbGllbnRDZXJ0aWZpY2F0ZUFybjogdGhpcy5jbGllbnRDZXJ0aWZpY2F0ZUFybixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstZWMyLWNsaWVudC12cG4tZW5kcG9pbnQnKTtcbmFwcC5zeW50aCgpO1xuIl19