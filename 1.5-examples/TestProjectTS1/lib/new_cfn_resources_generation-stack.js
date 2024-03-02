"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewCfnResourcesGenerationStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib-v3/aws-lambda");
const lambdaV1 = require("aws-cdk-lib/aws-lambda");
const sqs = require("aws-cdk-lib-v3/aws-sqs");
const iam = require("aws-cdk-lib-v3/aws-iam");
const assets = require("aws-cdk-lib/aws-s3-assets");
const path = require("path");
class NewCfnResourcesGenerationStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        let functionCode = new assets.Asset(this, 'Func1Code', {
            path: path.join(__dirname, '../src/'),
        });
        let role = new iam.CfnRole(this, 'funcRole', {
            assumeRolePolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Sid: '',
                        Effect: 'Allow',
                        Principal: { Service: 'firehose.amazonaws.com' },
                        Action: 'sts:AssumeRole',
                    },
                ],
            },
        });
        // let kmsKey = new kms.CfnKey(this, 'myKey');
        let queueArn = cdk.Stack.of(this).formatArn({
            service: 'sqs',
            resource: 'queue',
            resourceName: 'MyQueue',
            arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME
        });
        let queue = new sqs.CfnQueue(this, 'MyQueue', {
            queueName: 'MyQueue'
        });
        // let queueArn = queue.returnTargetArn();
        // console.log(queueArn);
        // Current L1s
        // const deadLetterConfigProperty: lambda.CfnFunction.DeadLetterConfigProperty = {
        //   targetArn: queueArn
        // }
        const architecture = [lambda.CfnFunction.ArchitecturesEnum.ARM64];
        // console.log(architecture);
        // console.log(lambda.CfnFunction.PackageTypeEnum.IMAGE);
        let lambdaFn = new lambda.CfnFunction(this, 'MyLambda', {
            runtime: lambda.CfnFunction.RuntimeEnum.PYTHON3_11,
            code: new lambda.CfnFunction.S3Code(functionCode.s3BucketName, functionCode.s3ObjectKey, functionCode.assetHash),
            role: role,
            packageType: lambda.CfnFunction.PackageTypeEnum.IMAGE,
            tracingConfig: {
                mode: lambda.CfnFunction.TracingConfigMode.ACTIVE,
            }
        });
        let lambdaFnV1 = new lambdaV1.CfnFunction(this, 'MyLambdaV1', {
            code: {
                s3Bucket: functionCode.s3BucketName,
                s3Key: functionCode.s3ObjectKey,
                s3ObjectVersion: functionCode.assetHash,
            },
            role: role.attrArn,
            packageType: "Zip",
            architectures: [lambda.CfnFunction.ArchitecturesEnum.ARM64.name],
            tracingConfig: {
                mode: lambda.CfnFunction.TracingConfigMode.ACTIVE.name,
            }
        });
    }
}
exports.NewCfnResourcesGenerationStack = NewCfnResourcesGenerationStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3X2Nmbl9yZXNvdXJjZXNfZ2VuZXJhdGlvbi1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ld19jZm5fcmVzb3VyY2VzX2dlbmVyYXRpb24tc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLG9EQUFvRDtBQUNwRCxtREFBbUQ7QUFDbkQsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QyxvREFBb0Q7QUFFcEQsNkJBQThCO0FBRTlCLE1BQWEsOEJBQStCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDM0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO1NBQ3RDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzNDLHdCQUF3QixFQUFFO2dCQUN4QixPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLEdBQUcsRUFBRSxFQUFFO3dCQUNQLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRTt3QkFDaEQsTUFBTSxFQUFFLGdCQUFnQjtxQkFDekI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUU5QyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDMUMsT0FBTyxFQUFFLEtBQUs7WUFDZCxRQUFRLEVBQUUsT0FBTztZQUNqQixZQUFZLEVBQUUsU0FBUztZQUN2QixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUI7U0FDN0MsQ0FBQyxDQUFBO1FBRUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUMsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsMENBQTBDO1FBQzFDLHlCQUF5QjtRQUV6QixjQUFjO1FBQ2Qsa0ZBQWtGO1FBQ2xGLHdCQUF3QjtRQUN4QixJQUFJO1FBRUosTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLDZCQUE2QjtRQUM3Qix5REFBeUQ7UUFFekQsSUFBSSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVU7WUFDbEQsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7WUFDaEgsSUFBSSxFQUFFLElBQUk7WUFDVixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsS0FBSztZQUNyRCxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsTUFBTTthQUNsRDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzVELElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsWUFBWSxDQUFDLFlBQVk7Z0JBQ25DLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVztnQkFDL0IsZUFBZSxFQUFFLFlBQVksQ0FBQyxTQUFTO2FBQ3hDO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGFBQWEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNoRSxhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUk7YUFDdkQ7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2RUQsd0VBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliLXYzL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgbGFtYmRhVjEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWItdjMvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWItdjMvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuZXhwb3J0IGNsYXNzIE5ld0NmblJlc291cmNlc0dlbmVyYXRpb25TdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGxldCBmdW5jdGlvbkNvZGUgPSBuZXcgYXNzZXRzLkFzc2V0KHRoaXMsICdGdW5jMUNvZGUnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vc3JjLycpLFxuICAgIH0pO1xuXG4gICAgbGV0IHJvbGUgPSBuZXcgaWFtLkNmblJvbGUodGhpcywgJ2Z1bmNSb2xlJywge1xuICAgICAgYXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgU2lkOiAnJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZmlyZWhvc2UuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIGxldCBrbXNLZXkgPSBuZXcga21zLkNmbktleSh0aGlzLCAnbXlLZXknKTtcblxuICAgIGxldCBxdWV1ZUFybiA9IGNkay5TdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NxcycsXG4gICAgICByZXNvdXJjZTogJ3F1ZXVlJyxcbiAgICAgIHJlc291cmNlTmFtZTogJ015UXVldWUnLFxuICAgICAgYXJuRm9ybWF0OiBjZGsuQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUVcbiAgICB9KVxuXG4gICAgbGV0IHF1ZXVlID0gbmV3IHNxcy5DZm5RdWV1ZSh0aGlzLCAnTXlRdWV1ZScsIHtcbiAgICAgIHF1ZXVlTmFtZTogJ015UXVldWUnXG4gICAgfSk7XG5cbiAgICAvLyBsZXQgcXVldWVBcm4gPSBxdWV1ZS5yZXR1cm5UYXJnZXRBcm4oKTtcbiAgICAvLyBjb25zb2xlLmxvZyhxdWV1ZUFybik7XG5cbiAgICAvLyBDdXJyZW50IEwxc1xuICAgIC8vIGNvbnN0IGRlYWRMZXR0ZXJDb25maWdQcm9wZXJ0eTogbGFtYmRhLkNmbkZ1bmN0aW9uLkRlYWRMZXR0ZXJDb25maWdQcm9wZXJ0eSA9IHtcbiAgICAvLyAgIHRhcmdldEFybjogcXVldWVBcm5cbiAgICAvLyB9XG4gICAgXG4gICAgY29uc3QgYXJjaGl0ZWN0dXJlID0gW2xhbWJkYS5DZm5GdW5jdGlvbi5BcmNoaXRlY3R1cmVzRW51bS5BUk02NF07XG4gICAgLy8gY29uc29sZS5sb2coYXJjaGl0ZWN0dXJlKTtcbiAgICAvLyBjb25zb2xlLmxvZyhsYW1iZGEuQ2ZuRnVuY3Rpb24uUGFja2FnZVR5cGVFbnVtLklNQUdFKTtcblxuICAgIGxldCBsYW1iZGFGbiA9IG5ldyBsYW1iZGEuQ2ZuRnVuY3Rpb24odGhpcywgJ015TGFtYmRhJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLkNmbkZ1bmN0aW9uLlJ1bnRpbWVFbnVtLlBZVEhPTjNfMTEsXG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLkNmbkZ1bmN0aW9uLlMzQ29kZShmdW5jdGlvbkNvZGUuczNCdWNrZXROYW1lLCBmdW5jdGlvbkNvZGUuczNPYmplY3RLZXksIGZ1bmN0aW9uQ29kZS5hc3NldEhhc2gpLFxuICAgICAgcm9sZTogcm9sZSxcbiAgICAgIHBhY2thZ2VUeXBlOiBsYW1iZGEuQ2ZuRnVuY3Rpb24uUGFja2FnZVR5cGVFbnVtLklNQUdFLFxuICAgICAgdHJhY2luZ0NvbmZpZzoge1xuICAgICAgICBtb2RlOiBsYW1iZGEuQ2ZuRnVuY3Rpb24uVHJhY2luZ0NvbmZpZ01vZGUuQUNUSVZFLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGxhbWJkYUZuVjEgPSBuZXcgbGFtYmRhVjEuQ2ZuRnVuY3Rpb24odGhpcywgJ015TGFtYmRhVjEnLCB7XG4gICAgICBjb2RlOiB7XG4gICAgICAgIHMzQnVja2V0OiBmdW5jdGlvbkNvZGUuczNCdWNrZXROYW1lLFxuICAgICAgICBzM0tleTogZnVuY3Rpb25Db2RlLnMzT2JqZWN0S2V5LFxuICAgICAgICBzM09iamVjdFZlcnNpb246IGZ1bmN0aW9uQ29kZS5hc3NldEhhc2gsXG4gICAgICB9LFxuICAgICAgcm9sZTogcm9sZS5hdHRyQXJuLFxuICAgICAgcGFja2FnZVR5cGU6IFwiWmlwXCIsXG4gICAgICBhcmNoaXRlY3R1cmVzOiBbbGFtYmRhLkNmbkZ1bmN0aW9uLkFyY2hpdGVjdHVyZXNFbnVtLkFSTTY0Lm5hbWVdLFxuICAgICAgdHJhY2luZ0NvbmZpZzoge1xuICAgICAgICBtb2RlOiBsYW1iZGEuQ2ZuRnVuY3Rpb24uVHJhY2luZ0NvbmZpZ01vZGUuQUNUSVZFLm5hbWUsXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==