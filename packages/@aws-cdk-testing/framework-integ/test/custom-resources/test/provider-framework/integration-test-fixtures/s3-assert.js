"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Assert = void 0;
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const cr = require("aws-cdk-lib/custom-resources");
/**
 * A custom resource that asserts that a file on s3 has the specified contents.
 * This resource will wait 10 minutes before, allowing for eventual consistency
 * to stabilize (and also exercises the idea of asynchronous custom resources).
 *
 * Code is written in Python because why not.
 */
class S3Assert extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: S3AssertProvider.getOrCreate(this),
            resourceType: 'Custom::S3Assert',
            properties: {
                BucketName: props.bucket.bucketName,
                ObjectKey: props.objectKey,
                ExpectedContent: props.expectedContent,
            },
        });
    }
}
exports.S3Assert = S3Assert;
class S3AssertProvider extends constructs_1.Construct {
    /**
     * Returns the singleton provider.
     */
    static getOrCreate(scope) {
        const providerId = 'com.amazonaws.cdk.custom-resources.s3assert-provider';
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const group = constructs_1.Node.of(stack).tryFindChild(providerId) || new S3AssertProvider(stack, providerId);
        return group.provider.serviceToken;
    }
    constructor(scope, id) {
        super(scope, id);
        const onEvent = new lambda.Function(this, 's3assert-on-event', {
            code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.on_event',
        });
        const isComplete = new lambda.Function(this, 's3assert-is-complete', {
            code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.is_complete',
            initialPolicy: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: [
                        's3:GetObject*',
                        's3:GetBucket*',
                        's3:List*',
                    ],
                }),
            ],
        });
        this.provider = new cr.Provider(this, 's3assert-provider', {
            onEventHandler: onEvent,
            isCompleteHandler: isComplete,
            totalTimeout: aws_cdk_lib_1.Duration.minutes(5),
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtYXNzZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsaURBQWlEO0FBRWpELDZDQUE4RDtBQUM5RCwyQ0FBNkM7QUFDN0MsbURBQW1EO0FBbUJuRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxzQkFBUztJQUVyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDaEQsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDbkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMxQixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7YUFDdkM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFmRCw0QkFlQztBQUVELE1BQU0sZ0JBQWlCLFNBQVEsc0JBQVM7SUFFdEM7O09BRUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCO1FBQ3hDLE1BQU0sVUFBVSxHQUFHLHNEQUFzRCxDQUFDO1FBQzFFLE1BQU0sS0FBSyxHQUFHLG1CQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQXFCLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckgsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNyQyxDQUFDO0lBSUQsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzdELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLGdCQUFnQjtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQ25FLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO29CQUN0QixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2hCLE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsVUFBVTtxQkFDWDtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDekQsY0FBYyxFQUFFLE9BQU87WUFDdkIsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUzNBc3NlcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgczMgYnVja2V0IHRvIHF1ZXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgb2JqZWN0IGtleS5cbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdEtleTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZXhwZWN0ZWQgY29udGVudHMuXG4gICAqL1xuICByZWFkb25seSBleHBlY3RlZENvbnRlbnQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGN1c3RvbSByZXNvdXJjZSB0aGF0IGFzc2VydHMgdGhhdCBhIGZpbGUgb24gczMgaGFzIHRoZSBzcGVjaWZpZWQgY29udGVudHMuXG4gKiBUaGlzIHJlc291cmNlIHdpbGwgd2FpdCAxMCBtaW51dGVzIGJlZm9yZSwgYWxsb3dpbmcgZm9yIGV2ZW50dWFsIGNvbnNpc3RlbmN5XG4gKiB0byBzdGFiaWxpemUgKGFuZCBhbHNvIGV4ZXJjaXNlcyB0aGUgaWRlYSBvZiBhc3luY2hyb25vdXMgY3VzdG9tIHJlc291cmNlcykuXG4gKlxuICogQ29kZSBpcyB3cml0dGVuIGluIFB5dGhvbiBiZWNhdXNlIHdoeSBub3QuXG4gKi9cbmV4cG9ydCBjbGFzcyBTM0Fzc2VydCBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFMzQXNzZXJ0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogUzNBc3NlcnRQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzKSxcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6UzNBc3NlcnQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBCdWNrZXROYW1lOiBwcm9wcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgICAgT2JqZWN0S2V5OiBwcm9wcy5vYmplY3RLZXksXG4gICAgICAgIEV4cGVjdGVkQ29udGVudDogcHJvcHMuZXhwZWN0ZWRDb250ZW50LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBTM0Fzc2VydFByb3ZpZGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2luZ2xldG9uIHByb3ZpZGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0KSB7XG4gICAgY29uc3QgcHJvdmlkZXJJZCA9ICdjb20uYW1hem9uYXdzLmNkay5jdXN0b20tcmVzb3VyY2VzLnMzYXNzZXJ0LXByb3ZpZGVyJztcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBncm91cCA9IE5vZGUub2Yoc3RhY2spLnRyeUZpbmRDaGlsZChwcm92aWRlcklkKSBhcyBTM0Fzc2VydFByb3ZpZGVyIHx8IG5ldyBTM0Fzc2VydFByb3ZpZGVyKHN0YWNrLCBwcm92aWRlcklkKTtcbiAgICByZXR1cm4gZ3JvdXAucHJvdmlkZXIuc2VydmljZVRva2VuO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwcm92aWRlcjogY3IuUHJvdmlkZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBvbkV2ZW50ID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnczNhc3NlcnQtb24tZXZlbnQnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ3MzLWFzc2VydC1oYW5kbGVyJykpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5vbl9ldmVudCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpc0NvbXBsZXRlID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnczNhc3NlcnQtaXMtY29tcGxldGUnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ3MzLWFzc2VydC1oYW5kbGVyJykpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5pc19jb21wbGV0ZScsXG4gICAgICBpbml0aWFsUG9saWN5OiBbXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnczNhc3NlcnQtcHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogb25FdmVudCxcbiAgICAgIGlzQ29tcGxldGVIYW5kbGVyOiBpc0NvbXBsZXRlLFxuICAgICAgdG90YWxUaW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgIH0pO1xuICB9XG59XG4iXX0=