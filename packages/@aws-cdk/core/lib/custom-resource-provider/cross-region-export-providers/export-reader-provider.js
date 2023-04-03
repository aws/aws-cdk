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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXJlYWRlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydC1yZWFkZXItcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxtQ0FBMEY7QUFDMUYscURBQWlEO0FBQ2pELDJEQUF1RDtBQUN2RCxxQ0FBa0M7QUFFbEMsdUNBQW9DO0FBQ3BDLDBFQUFvRztBQVFwRzs7Ozs7R0FLRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBQ2xDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBZ0IsRUFBRSxRQUFnQixFQUFFLFNBQTRCLEVBQUU7UUFDMUYsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxPQUFPLFFBQVE7WUFDYixDQUFDLENBQUMsUUFBd0I7WUFDMUIsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBSUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxTQUE0QixFQUFFO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIRixxQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO1FBSXpELE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0IsTUFBTSxZQUFZLEdBQUcsaUNBQWlDLENBQUM7UUFDdkQsTUFBTSxZQUFZLEdBQUcsaURBQXNCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDMUUsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGlDQUFpQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSx3REFBNkIsQ0FBQyxXQUFXO1lBQ2xELGdCQUFnQixFQUFFLENBQUM7b0JBQ2pCLE1BQU0sRUFBRSxPQUFPO29CQUNmLFFBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDO3dCQUN4QixPQUFPLEVBQUUsS0FBSzt3QkFDZCxRQUFRLEVBQUUsV0FBVzt3QkFDckIsWUFBWSxFQUFFLEdBQUcsOEJBQXNCLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSTtxQkFDOUQsQ0FBQztvQkFDRixNQUFNLEVBQUU7d0JBQ04sdUJBQXVCO3dCQUN2Qiw0QkFBNEI7d0JBQzVCLG1CQUFtQjtxQkFDcEI7aUJBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUF3QjtZQUN0QyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3ZCLE9BQU8sRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzVELENBQUM7UUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3pELFlBQVksRUFBRSxZQUFZO1lBQzFCLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLFVBQVU7YUFDeEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsUUFBcUI7UUFDeEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksY0FBYyxJQUFJLDBCQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQy9ELGNBQWMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLEtBQWdCO1FBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUF2RUQsb0NBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU1NNX0VYUE9SVF9QQVRIX1BSRUZJWCwgRXhwb3J0UmVhZGVyQ1JQcm9wcywgQ3Jvc3NSZWdpb25FeHBvcnRzIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4uLy4uL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSB9IGZyb20gJy4uLy4uL2N1c3RvbS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vLi4vbGF6eSc7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuLi8uLi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlUHJvdmlkZXIsIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lIH0gZnJvbSAnLi4vY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyJztcblxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEV4cG9ydFJlYWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlYWRlclByb3BzIHt9XG5cbi8qKlxuICogQ3JlYXRlcyBhIGN1c3RvbSByZXNvdXJjZSB0aGF0IHdpbGwgcmV0dXJuIGEgbGlzdCBvZiBzdGFjayBpbXBvcnRzIGZyb20gYSBnaXZlblxuICogVGhlIGV4cG9ydCBjYW4gdGhlbiBiZSByZWZlcmVuY2VkIGJ5IHRoZSBleHBvcnQgbmFtZS5cbiAqXG4gKiBAaW50ZXJuYWwgLSB0aGlzIGlzIGludGVudGlvbmFsbHkgbm90IGV4cG9ydGVkIGZyb20gY29yZVxuICovXG5leHBvcnQgY2xhc3MgRXhwb3J0UmVhZGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0LCB1bmlxdWVJZDogc3RyaW5nLCBfcHJvcHM6IEV4cG9ydFJlYWRlclByb3BzID0ge30pOiBFeHBvcnRSZWFkZXIge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQodW5pcXVlSWQpO1xuICAgIHJldHVybiBleGlzdGluZ1xuICAgICAgPyBleGlzdGluZyBhcyBFeHBvcnRSZWFkZXJcbiAgICAgIDogbmV3IEV4cG9ydFJlYWRlcihzdGFjaywgdW5pcXVlSWQpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBpbXBvcnRQYXJhbWV0ZXJzOiBDcm9zc1JlZ2lvbkV4cG9ydHMgPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBjdXN0b21SZXNvdXJjZTogQ3VzdG9tUmVzb3VyY2U7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIF9wcm9wczogRXhwb3J0UmVhZGVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGNvbnN0IHJlc291cmNlVHlwZSA9ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyJztcbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Nyb3NzLXJlZ2lvbi1zc20tcmVhZGVyLWhhbmRsZXInKSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICBzZXJ2aWNlOiAnc3NtJyxcbiAgICAgICAgICByZXNvdXJjZTogJ3BhcmFtZXRlcicsXG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiBgJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfSR7c3RhY2suc3RhY2tOYW1lfS8qYCxcbiAgICAgICAgfSksXG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzc206QWRkVGFnc1RvUmVzb3VyY2UnLFxuICAgICAgICAgICdzc206UmVtb3ZlVGFnc0Zyb21SZXNvdXJjZScsXG4gICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcGVydGllczogRXhwb3J0UmVhZGVyQ1JQcm9wcyA9IHtcbiAgICAgIHJlZ2lvbjogc3RhY2sucmVnaW9uLFxuICAgICAgcHJlZml4OiBzdGFjay5zdGFja05hbWUsXG4gICAgICBpbXBvcnRzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuaW1wb3J0UGFyYW1ldGVycyB9KSxcbiAgICB9O1xuICAgIHRoaXMuY3VzdG9tUmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlYWRlclByb3BzOiBwcm9wZXJ0aWVzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBvbmx5IHdheSB0byBhZGQgYSBkZXBlbmRlbmN5IG9uIGEgY3VzdG9tIHJlc291cmNlIGN1cnJlbnRseVxuICAgKi9cbiAgcHVibGljIGFkZERlcGVuZGVuY3kocmVzb3VyY2U6IENmblJlc291cmNlKTogdm9pZCB7XG4gICAgY29uc3QgY3VzdG9tUmVzb3VyY2UgPSB0aGlzLmN1c3RvbVJlc291cmNlLm5vZGUudHJ5RmluZENoaWxkKCdEZWZhdWx0Jyk7XG4gICAgaWYgKGN1c3RvbVJlc291cmNlICYmIENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoY3VzdG9tUmVzb3VyY2UpKSB7XG4gICAgICBjdXN0b21SZXNvdXJjZS5hZGREZXBlbmRzT24ocmVzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHJlZmVyZW5jZSB3aXRoIHRoZSB3cml0ZXIgYW5kIHJldHVybnMgYSBDbG91ZEZvcm1hdGlvbiBTdGFjayBleHBvcnQgYnkgbmFtZVxuICAgKlxuICAgKiBUaGUgdmFsdWUgd2lsbCBiZSBcImV4cG9ydGVkXCIgdmlhIHRoZSBFeHBvcnRXcml0ZXIuIEl0IHdpbGwgcGVyZm9ybVxuICAgKiB0aGUgZXhwb3J0IGJ5IGNyZWF0aW5nIGFuIFNTTSBwYXJhbWV0ZXIgaW4gdGhlIHJlZ2lvbiB0aGF0IHRoZSBjb25zdW1pbmdcbiAgICogc3RhY2sgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIGV4cG9ydHMgbWFwIG9mIHVuaXF1ZSBuYW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXhwb3J0IHRvIFNTTSBEeW5hbWljIHJlZmVyZW5jZVxuICAgKi9cbiAgcHVibGljIGltcG9ydFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IEludHJpbnNpYyk6IEludHJpbnNpYyB7XG4gICAgdGhpcy5pbXBvcnRQYXJhbWV0ZXJzW25hbWVdID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gdGhpcy5jdXN0b21SZXNvdXJjZS5nZXRBdHQobmFtZSk7XG4gIH1cbn1cbiJdfQ==