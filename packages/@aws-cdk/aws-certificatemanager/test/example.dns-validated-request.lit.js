"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const certmgr = require("../lib");
class CertStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: 'example.com',
            privateZone: false,
        });
        const certificate = new certmgr.DnsValidatedCertificate(this, 'TestCertificate', {
            domainName: 'test.example.com',
            hostedZone,
        });
        /// !hide
        Array.isArray(certificate);
    }
}
const app = new core_1.App();
new CertStack(app, 'MyStack4');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5kbnMtdmFsaWRhdGVkLXJlcXVlc3QubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbXBsZS5kbnMtdmFsaWRhdGVkLXJlcXVlc3QubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQWdEO0FBQ2hELHdDQUEyQztBQUUzQyxrQ0FBa0M7QUFFbEMsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLFNBQVM7UUFDVCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ25FLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLFdBQVcsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMvRSxVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLFVBQVU7U0FDWCxDQUFDLENBQUM7UUFDSCxTQUFTO1FBRVQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM1QjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDL0IsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNlcnRtZ3IgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgQ2VydFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBob3N0ZWRab25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Mb29rdXAodGhpcywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgcHJpdmF0ZVpvbmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgY2VydG1nci5EbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSh0aGlzLCAnVGVzdENlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgaG9zdGVkWm9uZSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcblxuICAgIEFycmF5LmlzQXJyYXkoY2VydGlmaWNhdGUpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBDZXJ0U3RhY2soYXBwLCAnTXlTdGFjazQnKTtcbmFwcC5zeW50aCgpO1xuIl19