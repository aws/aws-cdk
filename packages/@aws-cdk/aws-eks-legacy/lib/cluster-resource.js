"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResource = void 0;
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const kubectl_layer_1 = require("./kubectl-layer");
/**
 * A low-level CFN resource Amazon EKS cluster implemented through a custom
 * resource.
 *
 * Implements EKS create/update/delete through a CloudFormation custom resource
 * in order to allow us to control the IAM role which creates the cluster. This
 * is required in order to be able to allow CloudFormation to interact with the
 * cluster via `kubectl` to enable Kubernetes management capabilities like apply
 * manifest and IAM role/user RBAC mapping.
 */
class ClusterResource extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // each cluster resource will have it's own lambda handler since permissions
        // are scoped to this cluster and related resources like it's role
        const handler = new lambda.Function(this, 'ResourceHandler', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'cluster-resource')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.handler',
            timeout: core_1.Duration.minutes(15),
            memorySize: 512,
            layers: [kubectl_layer_1.KubectlLayer.getOrCreate(this)],
        });
        if (!props.roleArn) {
            throw new Error('"roleArn" is required');
        }
        // since we don't know the cluster name at this point, we must give this role star resource permissions
        handler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['eks:CreateCluster', 'eks:DescribeCluster', 'eks:DeleteCluster', 'eks:UpdateClusterVersion'],
            resources: ['*'],
        }));
        // the CreateCluster API will allow the cluster to assume this role, so we
        // need to allow the lambda execution role to pass it.
        handler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            resources: [props.roleArn],
        }));
        const resource = new core_1.CustomResource(this, 'Resource', {
            resourceType: ClusterResource.RESOURCE_TYPE,
            serviceToken: handler.functionArn,
            properties: {
                Config: props,
            },
        });
        this.ref = resource.ref;
        this.attrEndpoint = core_1.Token.asString(resource.getAtt('Endpoint'));
        this.attrArn = core_1.Token.asString(resource.getAtt('Arn'));
        this.attrCertificateAuthorityData = core_1.Token.asString(resource.getAtt('CertificateAuthorityData'));
        this.creationRole = handler.role;
    }
}
exports.ClusterResource = ClusterResource;
/**
 * The AWS CloudFormation resource type used for this resource.
 */
ClusterResource.RESOURCE_TYPE = 'Custom::AWSCDK-EKS-Cluster';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXItcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQWdFO0FBQ2hFLDJDQUF1QztBQUV2QyxtREFBK0M7QUFFL0M7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLHNCQUFTO0lBa0I1QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsNEVBQTRFO1FBQzVFLGtFQUFrRTtRQUNsRSxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzdCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsTUFBTSxFQUFFLENBQUMsNEJBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsdUdBQXVHO1FBQ3ZHLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQzlDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLDBCQUEwQixDQUFDO1lBQ3RHLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLDBFQUEwRTtRQUMxRSxzREFBc0Q7UUFDdEQsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDOUMsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDM0IsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxZQUFZLEVBQUUsZUFBZSxDQUFDLGFBQWE7WUFDM0MsWUFBWSxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ2pDLFVBQVUsRUFBRTtnQkFDVixNQUFNLEVBQUUsS0FBSzthQUNkO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFLLENBQUM7S0FDbkM7O0FBOURILDBDQStEQztBQTlEQzs7R0FFRztBQUNvQiw2QkFBYSxHQUFHLDRCQUE0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBEdXJhdGlvbiwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQ2x1c3RlclByb3BzIH0gZnJvbSAnLi9la3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEt1YmVjdGxMYXllciB9IGZyb20gJy4va3ViZWN0bC1sYXllcic7XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgQ0ZOIHJlc291cmNlIEFtYXpvbiBFS1MgY2x1c3RlciBpbXBsZW1lbnRlZCB0aHJvdWdoIGEgY3VzdG9tXG4gKiByZXNvdXJjZS5cbiAqXG4gKiBJbXBsZW1lbnRzIEVLUyBjcmVhdGUvdXBkYXRlL2RlbGV0ZSB0aHJvdWdoIGEgQ2xvdWRGb3JtYXRpb24gY3VzdG9tIHJlc291cmNlXG4gKiBpbiBvcmRlciB0byBhbGxvdyB1cyB0byBjb250cm9sIHRoZSBJQU0gcm9sZSB3aGljaCBjcmVhdGVzIHRoZSBjbHVzdGVyLiBUaGlzXG4gKiBpcyByZXF1aXJlZCBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGFsbG93IENsb3VkRm9ybWF0aW9uIHRvIGludGVyYWN0IHdpdGggdGhlXG4gKiBjbHVzdGVyIHZpYSBga3ViZWN0bGAgdG8gZW5hYmxlIEt1YmVybmV0ZXMgbWFuYWdlbWVudCBjYXBhYmlsaXRpZXMgbGlrZSBhcHBseVxuICogbWFuaWZlc3QgYW5kIElBTSByb2xlL3VzZXIgUkJBQyBtYXBwaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSB1c2VkIGZvciB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6QVdTQ0RLLUVLUy1DbHVzdGVyJztcblxuICBwdWJsaWMgcmVhZG9ubHkgYXR0ckVuZHBvaW50OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhdHRyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSByZWY6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIHdoaWNoIGNyZWF0ZWQgdGhlIGNsdXN0ZXIuIEluaXRpYWxseSB0aGlzIGlzIHRoZSBvbmx5IElBTSByb2xlXG4gICAqIHRoYXQgZ2V0cyBhZG1pbmlzdHJhdG9yIHByaXZpbGFnZXMgb24gdGhlIGNsdXN0ZXIgKGBzeXN0ZW06bWFzdGVyc2ApLCBhbmRcbiAgICogd2lsbCBiZSBhYmxlIHRvIGlzc3VlIGBrdWJlY3RsYCBjb21tYW5kcyBhZ2FpbnN0IGl0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uUm9sZTogaWFtLklSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5DbHVzdGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gZWFjaCBjbHVzdGVyIHJlc291cmNlIHdpbGwgaGF2ZSBpdCdzIG93biBsYW1iZGEgaGFuZGxlciBzaW5jZSBwZXJtaXNzaW9uc1xuICAgIC8vIGFyZSBzY29wZWQgdG8gdGhpcyBjbHVzdGVyIGFuZCByZWxhdGVkIHJlc291cmNlcyBsaWtlIGl0J3Mgcm9sZVxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdSZXNvdXJjZUhhbmRsZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2NsdXN0ZXItcmVzb3VyY2UnKSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxNSksXG4gICAgICBtZW1vcnlTaXplOiA1MTIsXG4gICAgICBsYXllcnM6IFtLdWJlY3RsTGF5ZXIuZ2V0T3JDcmVhdGUodGhpcyldLFxuICAgIH0pO1xuXG4gICAgaWYgKCFwcm9wcy5yb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wicm9sZUFyblwiIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgLy8gc2luY2Ugd2UgZG9uJ3Qga25vdyB0aGUgY2x1c3RlciBuYW1lIGF0IHRoaXMgcG9pbnQsIHdlIG11c3QgZ2l2ZSB0aGlzIHJvbGUgc3RhciByZXNvdXJjZSBwZXJtaXNzaW9uc1xuICAgIGhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnZWtzOkNyZWF0ZUNsdXN0ZXInLCAnZWtzOkRlc2NyaWJlQ2x1c3RlcicsICdla3M6RGVsZXRlQ2x1c3RlcicsICdla3M6VXBkYXRlQ2x1c3RlclZlcnNpb24nXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gdGhlIENyZWF0ZUNsdXN0ZXIgQVBJIHdpbGwgYWxsb3cgdGhlIGNsdXN0ZXIgdG8gYXNzdW1lIHRoaXMgcm9sZSwgc28gd2VcbiAgICAvLyBuZWVkIHRvIGFsbG93IHRoZSBsYW1iZGEgZXhlY3V0aW9uIHJvbGUgdG8gcGFzcyBpdC5cbiAgICBoYW5kbGVyLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgcmVzb3VyY2VzOiBbcHJvcHMucm9sZUFybl0sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBDbHVzdGVyUmVzb3VyY2UuUkVTT1VSQ0VfVFlQRSxcbiAgICAgIHNlcnZpY2VUb2tlbjogaGFuZGxlci5mdW5jdGlvbkFybixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ29uZmlnOiBwcm9wcyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZiA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmF0dHJFbmRwb2ludCA9IFRva2VuLmFzU3RyaW5nKHJlc291cmNlLmdldEF0dCgnRW5kcG9pbnQnKSk7XG4gICAgdGhpcy5hdHRyQXJuID0gVG9rZW4uYXNTdHJpbmcocmVzb3VyY2UuZ2V0QXR0KCdBcm4nKSk7XG4gICAgdGhpcy5hdHRyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhID0gVG9rZW4uYXNTdHJpbmcocmVzb3VyY2UuZ2V0QXR0KCdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnKSk7XG4gICAgdGhpcy5jcmVhdGlvblJvbGUgPSBoYW5kbGVyLnJvbGUhO1xuICB9XG59XG4iXX0=