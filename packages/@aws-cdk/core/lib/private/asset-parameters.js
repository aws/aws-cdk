"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetParameters = void 0;
const constructs_1 = require("constructs");
const cfn_parameter_1 = require("../cfn-parameter");
class FileAssetParameters extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        // add parameters for s3 bucket and s3 key. those will be set by
        // the toolkit or by CI/CD when the stack is deployed and will include
        // the name of the bucket and the S3 key where the code lives.
        this.bucketNameParameter = new cfn_parameter_1.CfnParameter(this, 'S3Bucket', {
            type: 'String',
            description: `S3 bucket for asset "${id}"`,
        });
        this.objectKeyParameter = new cfn_parameter_1.CfnParameter(this, 'S3VersionKey', {
            type: 'String',
            description: `S3 key for asset version "${id}"`,
        });
        this.artifactHashParameter = new cfn_parameter_1.CfnParameter(this, 'ArtifactHash', {
            description: `Artifact hash for asset "${id}"`,
            type: 'String',
        });
    }
}
exports.FileAssetParameters = FileAssetParameters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLG9EQUFnRDtBQUVoRCxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBS2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsZ0VBQWdFO1FBQ2hFLHNFQUFzRTtRQUN0RSw4REFBOEQ7UUFFOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHdCQUF3QixFQUFFLEdBQUc7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQy9ELElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLDZCQUE2QixFQUFFLEdBQUc7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xFLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxHQUFHO1lBQzlDLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0JELGtEQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUGFyYW1ldGVyIH0gZnJvbSAnLi4vY2ZuLXBhcmFtZXRlcic7XG5cbmV4cG9ydCBjbGFzcyBGaWxlQXNzZXRQYXJhbWV0ZXJzIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldE5hbWVQYXJhbWV0ZXI6IENmblBhcmFtZXRlcjtcbiAgcHVibGljIHJlYWRvbmx5IG9iamVjdEtleVBhcmFtZXRlcjogQ2ZuUGFyYW1ldGVyO1xuICBwdWJsaWMgcmVhZG9ubHkgYXJ0aWZhY3RIYXNoUGFyYW1ldGVyOiBDZm5QYXJhbWV0ZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBhZGQgcGFyYW1ldGVycyBmb3IgczMgYnVja2V0IGFuZCBzMyBrZXkuIHRob3NlIHdpbGwgYmUgc2V0IGJ5XG4gICAgLy8gdGhlIHRvb2xraXQgb3IgYnkgQ0kvQ0Qgd2hlbiB0aGUgc3RhY2sgaXMgZGVwbG95ZWQgYW5kIHdpbGwgaW5jbHVkZVxuICAgIC8vIHRoZSBuYW1lIG9mIHRoZSBidWNrZXQgYW5kIHRoZSBTMyBrZXkgd2hlcmUgdGhlIGNvZGUgbGl2ZXMuXG5cbiAgICB0aGlzLmJ1Y2tldE5hbWVQYXJhbWV0ZXIgPSBuZXcgQ2ZuUGFyYW1ldGVyKHRoaXMsICdTM0J1Y2tldCcsIHtcbiAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgZGVzY3JpcHRpb246IGBTMyBidWNrZXQgZm9yIGFzc2V0IFwiJHtpZH1cImAsXG4gICAgfSk7XG5cbiAgICB0aGlzLm9iamVjdEtleVBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ1MzVmVyc2lvbktleScsIHtcbiAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgZGVzY3JpcHRpb246IGBTMyBrZXkgZm9yIGFzc2V0IHZlcnNpb24gXCIke2lkfVwiYCxcbiAgICB9KTtcblxuICAgIHRoaXMuYXJ0aWZhY3RIYXNoUGFyYW1ldGVyID0gbmV3IENmblBhcmFtZXRlcih0aGlzLCAnQXJ0aWZhY3RIYXNoJywge1xuICAgICAgZGVzY3JpcHRpb246IGBBcnRpZmFjdCBoYXNoIGZvciBhc3NldCBcIiR7aWR9XCJgLFxuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==