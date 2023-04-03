"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogGroupResourcePolicy = void 0;
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
/**
 * Creates LogGroup resource policies.
 */
class LogGroupResourcePolicy extends cr.AwsCustomResource {
    constructor(scope, id, props) {
        const policyDocument = new iam.PolicyDocument({
            statements: props.policyStatements,
        });
        let policyName = props.policyName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) });
        super(scope, id, {
            resourceType: 'Custom::CloudwatchLogResourcePolicy',
            onUpdate: {
                service: 'CloudWatchLogs',
                action: 'putResourcePolicy',
                parameters: {
                    policyName: policyName,
                    policyDocument: JSON.stringify(policyDocument),
                },
                physicalResourceId: cr.PhysicalResourceId.of(id),
            },
            onDelete: {
                service: 'CloudWatchLogs',
                action: 'deleteResourcePolicy',
                parameters: {
                    policyName: policyName,
                },
                ignoreErrorCodesMatching: '400',
            },
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                // putResourcePolicy and deleteResourcePolicy don't support resource-level permissions. We must specify all resources ("*").
                // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazoncloudwatchlogs.html
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
    }
}
exports.LogGroupResourcePolicy = LogGroupResourcePolicy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLXJlc291cmNlLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZy1ncm91cC1yZXNvdXJjZS1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxnREFBZ0Q7QUFpQmhEOztHQUVHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxFQUFFLENBQUMsaUJBQWlCO0lBQzlELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0M7UUFDMUUsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDO1lBQzVDLFVBQVUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWxHLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLHFDQUFxQztZQUNuRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLGdCQUFnQjtnQkFDekIsTUFBTSxFQUFFLG1CQUFtQjtnQkFDM0IsVUFBVSxFQUFFO29CQUNWLFVBQVUsRUFBRSxVQUFVO29CQUN0QixjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7aUJBQy9DO2dCQUNELGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2pEO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLE1BQU0sRUFBRSxzQkFBc0I7Z0JBQzlCLFVBQVUsRUFBRTtvQkFDVixVQUFVLEVBQUUsVUFBVTtpQkFDdkI7Z0JBQ0Qsd0JBQXdCLEVBQUUsS0FBSzthQUNoQztZQUNELE1BQU0sRUFBRSxFQUFFLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDO2dCQUM5Qyw0SEFBNEg7Z0JBQzVILGtGQUFrRjtnQkFDbEYsU0FBUyxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZO2FBQ25ELENBQUM7U0FDSCxDQUFDLENBQUM7S0FDSjtDQUNGO0FBbENELHdEQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBjb25maWd1cmUgYSBsb2cgZ3JvdXAgcmVzb3VyY2UgcG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nR3JvdXBSZXNvdXJjZVBvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBsb2cgZ3JvdXAgcmVzb3VyY2UgcG9saWN5IG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeU5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IHN0YXRlbWVudHMgZm9yIHRoZSBsb2cgZ3JvdXAgcmVzb3VyY2UgbG9nc1xuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50czogW2lhbS5Qb2xpY3lTdGF0ZW1lbnRdO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgTG9nR3JvdXAgcmVzb3VyY2UgcG9saWNpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dHcm91cFJlc291cmNlUG9saWN5IGV4dGVuZHMgY3IuQXdzQ3VzdG9tUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9nR3JvdXBSZXNvdXJjZVBvbGljeVByb3BzKSB7XG4gICAgY29uc3QgcG9saWN5RG9jdW1lbnQgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IHByb3BzLnBvbGljeVN0YXRlbWVudHMsXG4gICAgfSk7XG5cbiAgICBsZXQgcG9saWN5TmFtZSA9IHByb3BzLnBvbGljeU5hbWUgfHwgY2RrLkxhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gY2RrLk5hbWVzLnVuaXF1ZUlkKHRoaXMpIH0pO1xuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkNsb3Vkd2F0Y2hMb2dSZXNvdXJjZVBvbGljeScsXG4gICAgICBvblVwZGF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgICBhY3Rpb246ICdwdXRSZXNvdXJjZVBvbGljeScsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBwb2xpY3lOYW1lOiBwb2xpY3lOYW1lLFxuICAgICAgICAgIHBvbGljeURvY3VtZW50OiBKU09OLnN0cmluZ2lmeShwb2xpY3lEb2N1bWVudCksXG4gICAgICAgIH0sXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLm9mKGlkKSxcbiAgICAgIH0sXG4gICAgICBvbkRlbGV0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgICBhY3Rpb246ICdkZWxldGVSZXNvdXJjZVBvbGljeScsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBwb2xpY3lOYW1lOiBwb2xpY3lOYW1lLFxuICAgICAgICB9LFxuICAgICAgICBpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmc6ICc0MDAnLFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgLy8gcHV0UmVzb3VyY2VQb2xpY3kgYW5kIGRlbGV0ZVJlc291cmNlUG9saWN5IGRvbid0IHN1cHBvcnQgcmVzb3VyY2UtbGV2ZWwgcGVybWlzc2lvbnMuIFdlIG11c3Qgc3BlY2lmeSBhbGwgcmVzb3VyY2VzIChcIipcIikuXG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9saXN0X2FtYXpvbmNsb3Vkd2F0Y2hsb2dzLmh0bWxcbiAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufVxuIl19