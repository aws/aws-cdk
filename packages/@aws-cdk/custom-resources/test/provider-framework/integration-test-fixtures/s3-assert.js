"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Assert = void 0;
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const cr = require("../../../lib");
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
        new core_1.CustomResource(this, 'Resource', {
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
            totalTimeout: core_1.Duration.minutes(5),
        });
    }
    /**
     * Returns the singleton provider.
     */
    static getOrCreate(scope) {
        const providerId = 'com.amazonaws.cdk.custom-resources.s3assert-provider';
        const stack = core_1.Stack.of(scope);
        const group = constructs_1.Node.of(stack).tryFindChild(providerId) || new S3AssertProvider(stack, providerId);
        return group.provider.serviceToken;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtYXNzZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMsOENBQThDO0FBRTlDLHdDQUFnRTtBQUNoRSwyQ0FBNkM7QUFDN0MsbUNBQW1DO0FBbUJuQzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxzQkFBUztJQUVyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDaEQsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDbkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMxQixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7YUFDdkM7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBZkQsNEJBZUM7QUFFRCxNQUFNLGdCQUFpQixTQUFRLHNCQUFTO0lBY3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUM3RCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsYUFBYSxFQUFFO2dCQUNiLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztvQkFDdEIsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNoQixPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixlQUFlO3dCQUNmLFVBQVU7cUJBQ1g7aUJBQ0YsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQ3pELGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWSxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztLQUNKO0lBMUNEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQjtRQUN4QyxNQUFNLFVBQVUsR0FBRyxzREFBc0QsQ0FBQztRQUMxRSxNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQXFCLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckgsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztLQUNwQztDQW1DRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICcuLi8uLi8uLi9saWInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFMzQXNzZXJ0UHJvcHMge1xuICAvKipcbiAgICogVGhlIHMzIGJ1Y2tldCB0byBxdWVyeS5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIG9iamVjdCBrZXkuXG4gICAqL1xuICByZWFkb25seSBvYmplY3RLZXk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGV4cGVjdGVkIGNvbnRlbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgZXhwZWN0ZWRDb250ZW50OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjdXN0b20gcmVzb3VyY2UgdGhhdCBhc3NlcnRzIHRoYXQgYSBmaWxlIG9uIHMzIGhhcyB0aGUgc3BlY2lmaWVkIGNvbnRlbnRzLlxuICogVGhpcyByZXNvdXJjZSB3aWxsIHdhaXQgMTAgbWludXRlcyBiZWZvcmUsIGFsbG93aW5nIGZvciBldmVudHVhbCBjb25zaXN0ZW5jeVxuICogdG8gc3RhYmlsaXplIChhbmQgYWxzbyBleGVyY2lzZXMgdGhlIGlkZWEgb2YgYXN5bmNocm9ub3VzIGN1c3RvbSByZXNvdXJjZXMpLlxuICpcbiAqIENvZGUgaXMgd3JpdHRlbiBpbiBQeXRob24gYmVjYXVzZSB3aHkgbm90LlxuICovXG5leHBvcnQgY2xhc3MgUzNBc3NlcnQgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTM0Fzc2VydFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IFMzQXNzZXJ0UHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcyksXG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OlMzQXNzZXJ0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQnVja2V0TmFtZTogcHJvcHMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIE9iamVjdEtleTogcHJvcHMub2JqZWN0S2V5LFxuICAgICAgICBFeHBlY3RlZENvbnRlbnQ6IHByb3BzLmV4cGVjdGVkQ29udGVudCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgUzNBc3NlcnRQcm92aWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNpbmdsZXRvbiBwcm92aWRlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIGNvbnN0IHByb3ZpZGVySWQgPSAnY29tLmFtYXpvbmF3cy5jZGsuY3VzdG9tLXJlc291cmNlcy5zM2Fzc2VydC1wcm92aWRlcic7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgZ3JvdXAgPSBOb2RlLm9mKHN0YWNrKS50cnlGaW5kQ2hpbGQocHJvdmlkZXJJZCkgYXMgUzNBc3NlcnRQcm92aWRlciB8fCBuZXcgUzNBc3NlcnRQcm92aWRlcihzdGFjaywgcHJvdmlkZXJJZCk7XG4gICAgcmV0dXJuIGdyb3VwLnByb3ZpZGVyLnNlcnZpY2VUb2tlbjtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdmlkZXI6IGNyLlByb3ZpZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgb25FdmVudCA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ3MzYXNzZXJ0LW9uLWV2ZW50Jywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdzMy1hc3NlcnQtaGFuZGxlcicpKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBoYW5kbGVyOiAnaW5kZXgub25fZXZlbnQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaXNDb21wbGV0ZSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ3MzYXNzZXJ0LWlzLWNvbXBsZXRlJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdzMy1hc3NlcnQtaGFuZGxlcicpKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaXNfY29tcGxldGUnLFxuICAgICAgaW5pdGlhbFBvbGljeTogW1xuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ3MzYXNzZXJ0LXByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IG9uRXZlbnQsXG4gICAgICBpc0NvbXBsZXRlSGFuZGxlcjogaXNDb21wbGV0ZSxcbiAgICAgIHRvdGFsVGltZW91dDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICB9KTtcbiAgfVxufVxuIl19