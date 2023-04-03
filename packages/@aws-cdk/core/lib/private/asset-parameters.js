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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LXBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLG9EQUFnRDtBQUVoRCxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBS2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsZ0VBQWdFO1FBQ2hFLHNFQUFzRTtRQUN0RSw4REFBOEQ7UUFFOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHdCQUF3QixFQUFFLEdBQUc7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQy9ELElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLDZCQUE2QixFQUFFLEdBQUc7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xFLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxHQUFHO1lBQzlDLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQTNCRCxrREEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblBhcmFtZXRlciB9IGZyb20gJy4uL2Nmbi1wYXJhbWV0ZXInO1xuXG5leHBvcnQgY2xhc3MgRmlsZUFzc2V0UGFyYW1ldGVycyBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXROYW1lUGFyYW1ldGVyOiBDZm5QYXJhbWV0ZXI7XG4gIHB1YmxpYyByZWFkb25seSBvYmplY3RLZXlQYXJhbWV0ZXI6IENmblBhcmFtZXRlcjtcbiAgcHVibGljIHJlYWRvbmx5IGFydGlmYWN0SGFzaFBhcmFtZXRlcjogQ2ZuUGFyYW1ldGVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gYWRkIHBhcmFtZXRlcnMgZm9yIHMzIGJ1Y2tldCBhbmQgczMga2V5LiB0aG9zZSB3aWxsIGJlIHNldCBieVxuICAgIC8vIHRoZSB0b29sa2l0IG9yIGJ5IENJL0NEIHdoZW4gdGhlIHN0YWNrIGlzIGRlcGxveWVkIGFuZCB3aWxsIGluY2x1ZGVcbiAgICAvLyB0aGUgbmFtZSBvZiB0aGUgYnVja2V0IGFuZCB0aGUgUzMga2V5IHdoZXJlIHRoZSBjb2RlIGxpdmVzLlxuXG4gICAgdGhpcy5idWNrZXROYW1lUGFyYW1ldGVyID0gbmV3IENmblBhcmFtZXRlcih0aGlzLCAnUzNCdWNrZXQnLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBgUzMgYnVja2V0IGZvciBhc3NldCBcIiR7aWR9XCJgLFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYmplY3RLZXlQYXJhbWV0ZXIgPSBuZXcgQ2ZuUGFyYW1ldGVyKHRoaXMsICdTM1ZlcnNpb25LZXknLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBgUzMga2V5IGZvciBhc3NldCB2ZXJzaW9uIFwiJHtpZH1cImAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFydGlmYWN0SGFzaFBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ0FydGlmYWN0SGFzaCcsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgQXJ0aWZhY3QgaGFzaCBmb3IgYXNzZXQgXCIke2lkfVwiYCxcbiAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=