"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketPinger = void 0;
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const constructs_1 = require("constructs");
class BucketPinger extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const func = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromAsset(`${__dirname}/function`),
            handler: 'index.handler',
            runtime: lambda.Runtime.PYTHON_3_9,
            timeout: props.timeout ?? core_1.Duration.minutes(1),
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
        this._resource = new core_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
        });
    }
    get response() {
        return core_1.Token.asString(this._resource.getAtt('Value'));
    }
}
exports.BucketPinger = BucketPinger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXBpbmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1Y2tldC1waW5nZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx3Q0FBZ0U7QUFDaEUsZ0RBQWdEO0FBQ2hELDJDQUF1QztBQU12QyxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUl6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxXQUFXLENBQUM7WUFDcEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QyxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzlCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDekQ7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNyRCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUM7WUFDN0MsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1NBQ3BDLENBQUMsQ0FBQztLQUNKO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO0NBQ0Y7QUF0Q0Qsb0NBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIFRva2VuLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRQaW5nZXJQcm9wcyB7XG4gIHJlYWRvbmx5IGJ1Y2tldE5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xufVxuZXhwb3J0IGNsYXNzIEJ1Y2tldFBpbmdlciBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgcHJpdmF0ZSBfcmVzb3VyY2U6IEN1c3RvbVJlc291cmNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBCdWNrZXRQaW5nZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYCR7X19kaXJuYW1lfS9mdW5jdGlvbmApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIHRpbWVvdXQ6IHByb3BzLnRpbWVvdXQgPz8gRHVyYXRpb24ubWludXRlcygxKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEJVQ0tFVF9OQU1FOiBwcm9wcy5idWNrZXROYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghZnVuYy5yb2xlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BpbmdlciBsYW1iZGEgaGFzIG5vIGV4ZWN1dGlvbiByb2xlIScpO1xuICAgIH1cblxuICAgIGZ1bmMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3MzOkRlbGV0ZUJ1Y2tldCcsICdzMzpMaXN0QnVja2V0J10sXG4gICAgICByZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7cHJvcHMuYnVja2V0TmFtZX1gXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnUHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogZnVuYyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3Jlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCByZXNwb25zZSgpIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcy5fcmVzb3VyY2UuZ2V0QXR0KCdWYWx1ZScpKTtcbiAgfVxufVxuIl19