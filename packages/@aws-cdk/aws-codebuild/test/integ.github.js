"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const source = codebuild.Source.gitHub({
            owner: 'aws',
            repo: 'aws-cdk',
            reportBuildStatus: false,
        });
        new codebuild.Project(this, 'MyProject', {
            source,
            grantReportGroupPermissions: false,
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-github');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ2l0aHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZ2l0aHViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDckMsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsU0FBUztZQUNmLGlCQUFpQixFQUFFLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkMsTUFBTTtZQUNOLDJCQUEyQixFQUFFLEtBQUs7U0FDbkMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBRTVDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICBvd25lcjogJ2F3cycsXG4gICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICByZXBvcnRCdWlsZFN0YXR1czogZmFsc2UsXG4gICAgfSk7XG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsICdNeVByb2plY3QnLCB7XG4gICAgICBzb3VyY2UsXG4gICAgICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBUZXN0U3RhY2soYXBwLCAndGVzdC1jb2RlYnVpbGQtZ2l0aHViJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19