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
    static getOrCreate(scope, uniqueId, _props = {}) {
        const stack = stack_1.Stack.of(scope);
        const existing = stack.node.tryFindChild(uniqueId);
        return existing
            ? existing
            : new ExportReader(stack, uniqueId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXJlYWRlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydC1yZWFkZXItcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxtQ0FBMEY7QUFDMUYscURBQWlEO0FBQ2pELDJEQUF1RDtBQUN2RCxxQ0FBa0M7QUFFbEMsdUNBQW9DO0FBQ3BDLDBFQUFvRztBQVFwRzs7Ozs7R0FLRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBV3pDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsU0FBNEIsRUFBRTtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEYscUJBQWdCLEdBQXVCLEVBQUUsQ0FBQztRQUl6RCxNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLE1BQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO1FBQ3ZELE1BQU0sWUFBWSxHQUFHLGlEQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzFFLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQ0FBaUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsd0RBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDeEIsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFlBQVksRUFBRSxHQUFHLDhCQUFzQixHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUk7cUJBQzlELENBQUM7b0JBQ0YsTUFBTSxFQUFFO3dCQUNOLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1QixtQkFBbUI7cUJBQ3BCO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBd0I7WUFDdEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUztZQUN2QixPQUFPLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUM1RCxDQUFDO1FBQ0YsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGdDQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN6RCxZQUFZLEVBQUUsWUFBWTtZQUMxQixZQUFZO1lBQ1osVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxVQUFVO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUE3Q00sTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLFFBQWdCLEVBQUUsU0FBNEIsRUFBRTtRQUMxRixNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sUUFBUTtZQUNiLENBQUMsQ0FBQyxRQUF3QjtZQUMxQixDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDO0lBeUNEOztPQUVHO0lBQ0ksYUFBYSxDQUFDLFFBQXFCO1FBQ3hDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxJQUFJLGNBQWMsSUFBSSwwQkFBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMvRCxjQUFjLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBZ0I7UUFDL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pDO0NBQ0Y7QUF2RUQsb0NBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU1NNX0VYUE9SVF9QQVRIX1BSRUZJWCwgRXhwb3J0UmVhZGVyQ1JQcm9wcywgQ3Jvc3NSZWdpb25FeHBvcnRzIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSB9IGZyb20gJy4uLy4uL2N1c3RvbS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vLi4vbGF6eSc7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuLi8uLi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlUHJvdmlkZXIsIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lIH0gZnJvbSAnLi4vY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyJztcblxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEV4cG9ydFJlYWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlYWRlclByb3BzIHt9XG5cbi8qKlxuICogQ3JlYXRlcyBhIGN1c3RvbSByZXNvdXJjZSB0aGF0IHdpbGwgcmV0dXJuIGEgbGlzdCBvZiBzdGFjayBpbXBvcnRzIGZyb20gYSBnaXZlblxuICogVGhlIGV4cG9ydCBjYW4gdGhlbiBiZSByZWZlcmVuY2VkIGJ5IHRoZSBleHBvcnQgbmFtZS5cbiAqXG4gKiBAaW50ZXJuYWwgLSB0aGlzIGlzIGludGVudGlvbmFsbHkgbm90IGV4cG9ydGVkIGZyb20gY29yZVxuICovXG5leHBvcnQgY2xhc3MgRXhwb3J0UmVhZGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0LCB1bmlxdWVJZDogc3RyaW5nLCBfcHJvcHM6IEV4cG9ydFJlYWRlclByb3BzID0ge30pOiBFeHBvcnRSZWFkZXIge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQodW5pcXVlSWQpO1xuICAgIHJldHVybiBleGlzdGluZ1xuICAgICAgPyBleGlzdGluZyBhcyBFeHBvcnRSZWFkZXJcbiAgICAgIDogbmV3IEV4cG9ydFJlYWRlcihzdGFjaywgdW5pcXVlSWQpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBpbXBvcnRQYXJhbWV0ZXJzOiBDcm9zc1JlZ2lvbkV4cG9ydHMgPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBjdXN0b21SZXNvdXJjZTogQ3VzdG9tUmVzb3VyY2U7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIF9wcm9wczogRXhwb3J0UmVhZGVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGNvbnN0IHJlc291cmNlVHlwZSA9ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyJztcbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Nyb3NzLXJlZ2lvbi1zc20tcmVhZGVyLWhhbmRsZXInKSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICBzZXJ2aWNlOiAnc3NtJyxcbiAgICAgICAgICByZXNvdXJjZTogJ3BhcmFtZXRlcicsXG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiBgJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfSR7c3RhY2suc3RhY2tOYW1lfS8qYCxcbiAgICAgICAgfSksXG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzc206QWRkVGFnc1RvUmVzb3VyY2UnLFxuICAgICAgICAgICdzc206UmVtb3ZlVGFnc0Zyb21SZXNvdXJjZScsXG4gICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcGVydGllczogRXhwb3J0UmVhZGVyQ1JQcm9wcyA9IHtcbiAgICAgIHJlZ2lvbjogc3RhY2sucmVnaW9uLFxuICAgICAgcHJlZml4OiBzdGFjay5zdGFja05hbWUsXG4gICAgICBpbXBvcnRzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuaW1wb3J0UGFyYW1ldGVycyB9KSxcbiAgICB9O1xuICAgIHRoaXMuY3VzdG9tUmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlYWRlclByb3BzOiBwcm9wZXJ0aWVzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBvbmx5IHdheSB0byBhZGQgYSBkZXBlbmRlbmN5IG9uIGEgY3VzdG9tIHJlc291cmNlIGN1cnJlbnRseVxuICAgKi9cbiAgcHVibGljIGFkZERlcGVuZGVuY3kocmVzb3VyY2U6IENmblJlc291cmNlKTogdm9pZCB7XG4gICAgY29uc3QgY3VzdG9tUmVzb3VyY2UgPSB0aGlzLmN1c3RvbVJlc291cmNlLm5vZGUudHJ5RmluZENoaWxkKCdEZWZhdWx0Jyk7XG4gICAgaWYgKGN1c3RvbVJlc291cmNlICYmIENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoY3VzdG9tUmVzb3VyY2UpKSB7XG4gICAgICBjdXN0b21SZXNvdXJjZS5hZGREZXBlbmRzT24ocmVzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJlZmVyZW5jZSB3aXRoIHRoZSB3cml0ZXIgYW5kIHJldHVybnMgYSBDbG91ZEZvcm1hdGlvbiBTdGFjayBleHBvcnQgYnkgbmFtZVxuICAgKlxuICAgKiBUaGUgdmFsdWUgd2lsbCBiZSBcImV4cG9ydGVkXCIgdmlhIHRoZSBFeHBvcnRXcml0ZXIuIEl0IHdpbGwgcGVyZm9ybVxuICAgKiB0aGUgZXhwb3J0IGJ5IGNyZWF0aW5nIGFuIFNTTSBwYXJhbWV0ZXIgaW4gdGhlIHJlZ2lvbiB0aGF0IHRoZSBjb25zdW1pbmdcbiAgICogc3RhY2sgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIGV4cG9ydHMgbWFwIG9mIHVuaXF1ZSBuYW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXhwb3J0IHRvIFNTTSBEeW5hbWljIHJlZmVyZW5jZVxuICAgKi9cbiAgcHVibGljIGltcG9ydFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IEludHJpbnNpYyk6IEludHJpbnNpYyB7XG4gICAgdGhpcy5pbXBvcnRQYXJhbWV0ZXJzW25hbWVdID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gdGhpcy5jdXN0b21SZXNvdXJjZS5nZXRBdHQobmFtZSk7XG4gIH1cbn1cbiJdfQ==