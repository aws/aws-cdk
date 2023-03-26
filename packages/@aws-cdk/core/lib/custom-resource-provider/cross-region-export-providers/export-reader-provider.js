"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportReader = void 0;
const path = require("path");
const constructs_1 = require("constructs");
const types_1 = require("./types");
const cfn_resource_1 = require("../../cfn-resource");
const custom_resource_1 = require("../../custom-resource");
const lazy_1 = require("../../lazy");
const stack_1 = require("../../stack");
const custom_resource_provider_1 = require("../custom-resource-provider");
/**
 * Creates a custom resource that will return a list of stack imports from a given
 * The export can then be referenced by the export name.
 *
 * @internal - this is intentionally not exported from core
 */
class ExportReader extends constructs_1.Construct {
    static getOrCreate(scope, uniqueId, _props = {}) {
        const stack = stack_1.Stack.of(scope);
        const existing = stack.node.tryFindChild(uniqueId);
        return existing
            ? existing
            : new ExportReader(stack, uniqueId);
    }
    constructor(scope, id, _props = {}) {
        super(scope, id);
        this.importParameters = {};
        const stack = stack_1.Stack.of(this);
        const resourceType = 'Custom::CrossRegionExportReader';
        const serviceToken = custom_resource_provider_1.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: path.join(__dirname, 'cross-region-ssm-reader-handler'),
            runtime: custom_resource_provider_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Resource: stack.formatArn({
                        service: 'ssm',
                        resource: 'parameter',
                        resourceName: `${types_1.SSM_EXPORT_PATH_PREFIX}${stack.stackName}/*`,
                    }),
                    Action: [
                        'ssm:AddTagsToResource',
                        'ssm:RemoveTagsFromResource',
                        'ssm:GetParameters',
                    ],
                }],
        });
        const properties = {
            region: stack.region,
            prefix: stack.stackName,
            imports: lazy_1.Lazy.any({ produce: () => this.importParameters }),
        };
        this.customResource = new custom_resource_1.CustomResource(this, 'Resource', {
            resourceType: resourceType,
            serviceToken,
            properties: {
                ReaderProps: properties,
            },
        });
    }
    /**
     * This is the only way to add a dependency on a custom resource currently
     */
    addDependency(resource) {
        const customResource = this.customResource.node.tryFindChild('Default');
        if (customResource && cfn_resource_1.CfnResource.isCfnResource(customResource)) {
            customResource.addDependsOn(resource);
        }
    }
    /**
     * Register a reference with the writer and returns a CloudFormation Stack export by name
     *
     * The value will be "exported" via the ExportWriter. It will perform
     * the export by creating an SSM parameter in the region that the consuming
     * stack is created.
     *
     * @param exports map of unique name associated with the export to SSM Dynamic reference
     */
    importValue(name, value) {
        this.importParameters[name] = value.toString();
        return this.customResource.getAtt(name);
    }
}
exports.ExportReader = ExportReader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXJlYWRlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydC1yZWFkZXItcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxtQ0FBMEY7QUFDMUYscURBQWlEO0FBQ2pELDJEQUF1RDtBQUN2RCxxQ0FBa0M7QUFFbEMsdUNBQW9DO0FBQ3BDLDBFQUFvRztBQVFwRzs7Ozs7R0FLRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBQ2xDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBZ0IsRUFBRSxRQUFnQixFQUFFLFNBQTRCLEVBQUU7UUFDMUYsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxPQUFPLFFBQVE7WUFDYixDQUFDLENBQUMsUUFBd0I7WUFDMUIsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2QztJQUlELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsU0FBNEIsRUFBRTtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEYscUJBQWdCLEdBQXVCLEVBQUUsQ0FBQztRQUl6RCxNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLE1BQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO1FBQ3ZELE1BQU0sWUFBWSxHQUFHLGlEQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzFFLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQ0FBaUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsd0RBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDeEIsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFlBQVksRUFBRSxHQUFHLDhCQUFzQixHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUk7cUJBQzlELENBQUM7b0JBQ0YsTUFBTSxFQUFFO3dCQUNOLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1QixtQkFBbUI7cUJBQ3BCO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBd0I7WUFDdEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUztZQUN2QixPQUFPLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUM1RCxDQUFDO1FBQ0YsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGdDQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN6RCxZQUFZLEVBQUUsWUFBWTtZQUMxQixZQUFZO1lBQ1osVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxVQUFVO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxRQUFxQjtRQUN4QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEUsSUFBSSxjQUFjLElBQUksMEJBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0QsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2QztLQUNGO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLEtBQWdCO1FBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QztDQUNGO0FBdkVELG9DQXVFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFNTTV9FWFBPUlRfUEFUSF9QUkVGSVgsIEV4cG9ydFJlYWRlckNSUHJvcHMsIENyb3NzUmVnaW9uRXhwb3J0cyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9jdXN0b20tcmVzb3VyY2UnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4uLy4uL2xhenknO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi4vLi4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi8uLi9zdGFjayc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB9IGZyb20gJy4uL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlcic7XG5cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhbiBFeHBvcnRSZWFkZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZWFkZXJQcm9wcyB7fVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjdXN0b20gcmVzb3VyY2UgdGhhdCB3aWxsIHJldHVybiBhIGxpc3Qgb2Ygc3RhY2sgaW1wb3J0cyBmcm9tIGEgZ2l2ZW5cbiAqIFRoZSBleHBvcnQgY2FuIHRoZW4gYmUgcmVmZXJlbmNlZCBieSB0aGUgZXhwb3J0IG5hbWUuXG4gKlxuICogQGludGVybmFsIC0gdGhpcyBpcyBpbnRlbnRpb25hbGx5IG5vdCBleHBvcnRlZCBmcm9tIGNvcmVcbiAqL1xuZXhwb3J0IGNsYXNzIEV4cG9ydFJlYWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoc2NvcGU6IENvbnN0cnVjdCwgdW5pcXVlSWQ6IHN0cmluZywgX3Byb3BzOiBFeHBvcnRSZWFkZXJQcm9wcyA9IHt9KTogRXhwb3J0UmVhZGVyIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBleGlzdGluZyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKHVuaXF1ZUlkKTtcbiAgICByZXR1cm4gZXhpc3RpbmdcbiAgICAgID8gZXhpc3RpbmcgYXMgRXhwb3J0UmVhZGVyXG4gICAgICA6IG5ldyBFeHBvcnRSZWFkZXIoc3RhY2ssIHVuaXF1ZUlkKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgaW1wb3J0UGFyYW1ldGVyczogQ3Jvc3NSZWdpb25FeHBvcnRzID0ge307XG4gIHByaXZhdGUgcmVhZG9ubHkgY3VzdG9tUmVzb3VyY2U6IEN1c3RvbVJlc291cmNlO1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBfcHJvcHM6IEV4cG9ydFJlYWRlclByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICBjb25zdCByZXNvdXJjZVR5cGUgPSAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFJlYWRlcic7XG4gICAgY29uc3Qgc2VydmljZVRva2VuID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCByZXNvdXJjZVR5cGUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdjcm9zcy1yZWdpb24tc3NtLXJlYWRlci1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgc2VydmljZTogJ3NzbScsXG4gICAgICAgICAgcmVzb3VyY2U6ICdwYXJhbWV0ZXInLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogYCR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH0ke3N0YWNrLnN0YWNrTmFtZX0vKmAsXG4gICAgICAgIH0pLFxuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc3NtOkFkZFRhZ3NUb1Jlc291cmNlJyxcbiAgICAgICAgICAnc3NtOlJlbW92ZVRhZ3NGcm9tUmVzb3VyY2UnLFxuICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgIF0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cG9ydFJlYWRlckNSUHJvcHMgPSB7XG4gICAgICByZWdpb246IHN0YWNrLnJlZ2lvbixcbiAgICAgIHByZWZpeDogc3RhY2suc3RhY2tOYW1lLFxuICAgICAgaW1wb3J0czogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmltcG9ydFBhcmFtZXRlcnMgfSksXG4gICAgfTtcbiAgICB0aGlzLmN1c3RvbVJlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogcmVzb3VyY2VUeXBlLFxuICAgICAgc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWFkZXJQcm9wczogcHJvcGVydGllcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgb25seSB3YXkgdG8gYWRkIGEgZGVwZW5kZW5jeSBvbiBhIGN1c3RvbSByZXNvdXJjZSBjdXJyZW50bHlcbiAgICovXG4gIHB1YmxpYyBhZGREZXBlbmRlbmN5KHJlc291cmNlOiBDZm5SZXNvdXJjZSk6IHZvaWQge1xuICAgIGNvbnN0IGN1c3RvbVJlc291cmNlID0gdGhpcy5jdXN0b21SZXNvdXJjZS5ub2RlLnRyeUZpbmRDaGlsZCgnRGVmYXVsdCcpO1xuICAgIGlmIChjdXN0b21SZXNvdXJjZSAmJiBDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGN1c3RvbVJlc291cmNlKSkge1xuICAgICAgY3VzdG9tUmVzb3VyY2UuYWRkRGVwZW5kc09uKHJlc291cmNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSByZWZlcmVuY2Ugd2l0aCB0aGUgd3JpdGVyIGFuZCByZXR1cm5zIGEgQ2xvdWRGb3JtYXRpb24gU3RhY2sgZXhwb3J0IGJ5IG5hbWVcbiAgICpcbiAgICogVGhlIHZhbHVlIHdpbGwgYmUgXCJleHBvcnRlZFwiIHZpYSB0aGUgRXhwb3J0V3JpdGVyLiBJdCB3aWxsIHBlcmZvcm1cbiAgICogdGhlIGV4cG9ydCBieSBjcmVhdGluZyBhbiBTU00gcGFyYW1ldGVyIGluIHRoZSByZWdpb24gdGhhdCB0aGUgY29uc3VtaW5nXG4gICAqIHN0YWNrIGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBleHBvcnRzIG1hcCBvZiB1bmlxdWUgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGV4cG9ydCB0byBTU00gRHluYW1pYyByZWZlcmVuY2VcbiAgICovXG4gIHB1YmxpYyBpbXBvcnRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBJbnRyaW5zaWMpOiBJbnRyaW5zaWMge1xuICAgIHRoaXMuaW1wb3J0UGFyYW1ldGVyc1tuYW1lXSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHRoaXMuY3VzdG9tUmVzb3VyY2UuZ2V0QXR0KG5hbWUpO1xuICB9XG59XG4iXX0=