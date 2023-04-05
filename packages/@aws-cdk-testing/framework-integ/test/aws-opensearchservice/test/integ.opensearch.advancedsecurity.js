"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const user = new aws_iam_1.User(this, 'User');
        new opensearch.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
            fineGrainedAccessControl: {
                masterUserArn: user.userArn,
            },
            encryptionAtRest: {
                enabled: true,
            },
            nodeToNodeEncryption: true,
            enforceHttps: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-opensearch-advancedsecurity');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC5hZHZhbmNlZHNlY3VyaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcub3BlbnNlYXJjaC5hZHZhbmNlZHNlY3VyaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTJDO0FBQzNDLDZDQUFvRTtBQUVwRSxnRUFBZ0U7QUFFaEUsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEMsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDcEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxPQUFPLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUI7WUFDbkQsd0JBQXdCLEVBQUU7Z0JBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTzthQUM1QjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTthQUNkO1lBQ0Qsb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztBQUM1RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBvcGVuc2VhcmNoIGZyb20gJ2F3cy1jZGstbGliL2F3cy1vcGVuc2VhcmNoc2VydmljZSc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIodGhpcywgJ1VzZXInKTtcblxuICAgIG5ldyBvcGVuc2VhcmNoLkRvbWFpbih0aGlzLCAnRG9tYWluJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdmVyc2lvbjogb3BlbnNlYXJjaC5FbmdpbmVWZXJzaW9uLkVMQVNUSUNTRUFSQ0hfN18xLFxuICAgICAgZmluZUdyYWluZWRBY2Nlc3NDb250cm9sOiB7XG4gICAgICAgIG1hc3RlclVzZXJBcm46IHVzZXIudXNlckFybixcbiAgICAgIH0sXG4gICAgICBlbmNyeXB0aW9uQXRSZXN0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgbm9kZVRvTm9kZUVuY3J5cHRpb246IHRydWUsXG4gICAgICBlbmZvcmNlSHR0cHM6IHRydWUsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctb3BlbnNlYXJjaC1hZHZhbmNlZHNlY3VyaXR5Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==