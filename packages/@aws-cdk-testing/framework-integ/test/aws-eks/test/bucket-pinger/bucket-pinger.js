"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketPinger = void 0;
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cr = require("aws-cdk-lib/custom-resources");
const constructs_1 = require("constructs");
class BucketPinger extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const func = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromAsset(`${__dirname}/function`),
            handler: 'index.handler',
            runtime: lambda.Runtime.PYTHON_3_9,
            timeout: props.timeout ?? aws_cdk_lib_1.Duration.minutes(1),
            environment: {
                BUCKET_NAME: props.bucketName,
            },
        });
        if (!func.role) {
            throw new Error('pinger lambda has no execution role!');
        }
        func.role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['s3:DeleteBucket', 's3:ListBucket'],
            resources: [`arn:aws:s3:::${props.bucketName}`],
        }));
        const provider = new cr.Provider(this, 'Provider', {
            onEventHandler: func,
        });
        this._resource = new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
        });
    }
    get response() {
        return aws_cdk_lib_1.Token.asString(this._resource.getAtt('Value'));
    }
}
exports.BucketPinger = BucketPinger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXBpbmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1Y2tldC1waW5nZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCw2Q0FBOEQ7QUFDOUQsbURBQW1EO0FBQ25ELDJDQUF1QztBQU12QyxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUl6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxXQUFXLENBQUM7WUFDcEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDN0MsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVTthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksNEJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sbUJBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Y7QUF0Q0Qsb0NBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIFRva2VuLCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVja2V0UGluZ2VyUHJvcHMge1xuICByZWFkb25seSBidWNrZXROYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcbn1cbmV4cG9ydCBjbGFzcyBCdWNrZXRQaW5nZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHByaXZhdGUgX3Jlc291cmNlOiBDdXN0b21SZXNvdXJjZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQnVja2V0UGluZ2VyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0Z1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGAke19fZGlybmFtZX0vZnVuY3Rpb25gKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICB0aW1lb3V0OiBwcm9wcy50aW1lb3V0ID8/IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVRfTkFNRTogcHJvcHMuYnVja2V0TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIWZ1bmMucm9sZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwaW5nZXIgbGFtYmRhIGhhcyBubyBleGVjdXRpb24gcm9sZSEnKTtcbiAgICB9XG5cbiAgICBmdW5jLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzpEZWxldGVCdWNrZXQnLCAnczM6TGlzdEJ1Y2tldCddLFxuICAgICAgcmVzb3VyY2VzOiBbYGFybjphd3M6czM6Ojoke3Byb3BzLmJ1Y2tldE5hbWV9YF0sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ1Byb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGZ1bmMsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMuX3Jlc291cmNlLmdldEF0dCgnVmFsdWUnKSk7XG4gIH1cbn1cbiJdfQ==