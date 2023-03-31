"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3File = void 0;
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const api = require("./s3-file-handler/api");
const cr = require("aws-cdk-lib/custom-resources");
class S3File extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const resource = new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: S3FileProvider.getOrCreate(this),
            resourceType: 'Custom::S3File',
            properties: {
                [api.PROP_BUCKET_NAME]: props.bucket.bucketName,
                [api.PROP_CONTENTS]: props.contents,
                [api.PROP_OBJECT_KEY]: props.objectKey,
                [api.PROP_PUBLIC]: props.public,
            },
        });
        this.objectKey = resource.getAttString(api.ATTR_OBJECT_KEY);
        this.url = resource.getAttString(api.ATTR_URL);
        this.etag = resource.getAttString(api.ATTR_ETAG);
    }
}
exports.S3File = S3File;
class S3FileProvider extends constructs_1.Construct {
    /**
     * Returns the singleton provider.
     */
    static getOrCreate(scope) {
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const id = 'com.amazonaws.cdk.custom-resources.s3file-provider';
        const x = constructs_1.Node.of(stack).tryFindChild(id) || new S3FileProvider(stack, id);
        return x.provider.serviceToken;
    }
    constructor(scope, id) {
        super(scope, id);
        this.provider = new cr.Provider(this, 's3file-provider', {
            onEventHandler: new lambda.Function(this, 's3file-on-event', {
                code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
                runtime: lambda.Runtime.NODEJS_14_X,
                handler: 'index.onEvent',
                initialPolicy: [
                    new iam.PolicyStatement({
                        resources: ['*'],
                        actions: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                            's3:DeleteObject*',
                            's3:PutObject*',
                            's3:Abort*',
                        ],
                    }),
                ],
            }),
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInMzLWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFFakQsNkNBQW9EO0FBQ3BELDJDQUE2QztBQUM3Qyw2Q0FBNkM7QUFDN0MsbURBQW1EO0FBNEJuRCxNQUFhLE1BQU8sU0FBUSxzQkFBUztJQUtuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxRQUFRLEdBQUcsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzlDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsVUFBVSxFQUFFO2dCQUNWLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVO2dCQUMvQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDbkMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVM7Z0JBQ3RDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNGO0FBdkJELHdCQXVCQztBQUVELE1BQU0sY0FBZSxTQUFRLHNCQUFTO0lBRXBDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQjtRQUN4QyxNQUFNLEtBQUssR0FBRyxtQkFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyxvREFBb0QsQ0FBQztRQUNoRSxNQUFNLENBQUMsR0FBRyxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFtQixJQUFJLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ2pDLENBQUM7SUFJRCxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN2RCxjQUFjLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtnQkFDM0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25DLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixhQUFhLEVBQUU7b0JBQ2IsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO3dCQUN0QixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ2hCLE9BQU8sRUFBRTs0QkFDUCxlQUFlOzRCQUNmLGVBQWU7NEJBQ2YsVUFBVTs0QkFDVixrQkFBa0I7NEJBQ2xCLGVBQWU7NEJBQ2YsV0FBVzt5QkFDWjtxQkFDRixDQUFDO2lCQUNIO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi9zMy1maWxlLWhhbmRsZXIvYXBpJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuXG5pbnRlcmZhY2UgUzNGaWxlUHJvcHMge1xuICAvKipcbiAgICogVGhlIGJ1Y2tldCBpbiB3aGljaCB0aGUgZmlsZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3Qga2V5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkXG4gICAqL1xuICByZWFkb25seSBvYmplY3RLZXk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb250ZW50cyBvZiB0aGUgZmlsZS5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGlzIGZpbGUgc2hvdWxkIGhhdmUgcHVibGljLXJlYWQgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwdWJsaWM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgUzNGaWxlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IG9iamVjdEtleTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBldGFnOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFMzRmlsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogUzNGaWxlUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcyksXG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OlMzRmlsZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFthcGkuUFJPUF9CVUNLRVRfTkFNRV06IHByb3BzLmJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgICBbYXBpLlBST1BfQ09OVEVOVFNdOiBwcm9wcy5jb250ZW50cyxcbiAgICAgICAgW2FwaS5QUk9QX09CSkVDVF9LRVldOiBwcm9wcy5vYmplY3RLZXksXG4gICAgICAgIFthcGkuUFJPUF9QVUJMSUNdOiBwcm9wcy5wdWJsaWMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYmplY3RLZXkgPSByZXNvdXJjZS5nZXRBdHRTdHJpbmcoYXBpLkFUVFJfT0JKRUNUX0tFWSk7XG4gICAgdGhpcy51cmwgPSByZXNvdXJjZS5nZXRBdHRTdHJpbmcoYXBpLkFUVFJfVVJMKTtcbiAgICB0aGlzLmV0YWcgPSByZXNvdXJjZS5nZXRBdHRTdHJpbmcoYXBpLkFUVFJfRVRBRyk7XG4gIH1cbn1cblxuY2xhc3MgUzNGaWxlUHJvdmlkZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaW5nbGV0b24gcHJvdmlkZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBpZCA9ICdjb20uYW1hem9uYXdzLmNkay5jdXN0b20tcmVzb3VyY2VzLnMzZmlsZS1wcm92aWRlcic7XG4gICAgY29uc3QgeCA9IE5vZGUub2Yoc3RhY2spLnRyeUZpbmRDaGlsZChpZCkgYXMgUzNGaWxlUHJvdmlkZXIgfHwgbmV3IFMzRmlsZVByb3ZpZGVyKHN0YWNrLCBpZCk7XG4gICAgcmV0dXJuIHgucHJvdmlkZXIuc2VydmljZVRva2VuO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwcm92aWRlcjogY3IuUHJvdmlkZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdzM2ZpbGUtcHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnczNmaWxlLW9uLWV2ZW50Jywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ3MzLWZpbGUtaGFuZGxlcicpKSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50JyxcbiAgICAgICAgaW5pdGlhbFBvbGljeTogW1xuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==