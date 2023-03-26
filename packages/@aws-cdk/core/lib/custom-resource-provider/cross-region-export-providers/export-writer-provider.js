"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportWriter = void 0;
const path = require("path");
const constructs_1 = require("constructs");
const export_reader_provider_1 = require("./export-reader-provider");
const types_1 = require("./types");
const cfn_dynamic_reference_1 = require("../../cfn-dynamic-reference");
const custom_resource_1 = require("../../custom-resource");
const lazy_1 = require("../../lazy");
const uniqueid_1 = require("../../private/uniqueid");
const stack_1 = require("../../stack");
const custom_resource_provider_1 = require("../custom-resource-provider");
/**
 * Creates a custom resource that will return a list of stack exports from a given
 * AWS region. The export can then be referenced by the export name.
 *
 *
 * @example
 * declare const app: App;
 * const stack1 = new Stack(app, 'East1Stack', { env: { region: 'us-east-1' } });
 * new CfnOutput(stack1, 'Output', { value: 'someValue', exportName: 'someName' });
 *
 * const stack2 = new Stack(app, 'East2Stack', { env: { region: 'us-east-2' } });
 * const exportReader = new ExportReader(stack2, 'ExportReader', { region: 'us-east-1' });
 * const anotherResource = new CfnResource(stack2, 'AnotherResource', {
 *   Parameters: {
 *     SomeParam: exportReader.importValue('someName'),
 *   },
 * });
 *
 * @internal - this is intentionally not exported from core
 */
class ExportWriter extends constructs_1.Construct {
    static getOrCreate(scope, uniqueId, props) {
        const stack = stack_1.Stack.of(scope);
        const existing = stack.node.tryFindChild(uniqueId);
        return existing
            ? existing
            : new ExportWriter(stack, uniqueId, {
                region: props.region,
            });
    }
    constructor(scope, id, props) {
        super(scope, id);
        this._references = {};
        const stack = stack_1.Stack.of(this);
        const region = props.region ?? stack.region;
        const resourceType = 'Custom::CrossRegionExportWriter';
        const serviceToken = custom_resource_provider_1.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: path.join(__dirname, 'cross-region-ssm-writer-handler'),
            runtime: custom_resource_provider_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Resource: stack.formatArn({
                        service: 'ssm',
                        resource: 'parameter',
                        region,
                        resourceName: `${types_1.SSM_EXPORT_PATH_PREFIX}*`,
                    }),
                    Action: [
                        'ssm:DeleteParameters',
                        'ssm:ListTagsForResource',
                        'ssm:GetParameters',
                        'ssm:PutParameter',
                    ],
                }],
        });
        const properties = {
            region: region,
            exports: lazy_1.Lazy.any({ produce: () => this._references }),
        };
        new custom_resource_1.CustomResource(this, 'Resource', {
            resourceType: resourceType,
            serviceToken,
            properties: {
                WriterProps: properties,
            },
        });
    }
    /**
     * Register a reference with the writer and returns a CloudFormation Stack export by name
     *
     * The value will be "exported" via the ExportWriter. It will perform
     * the export by creating an SSM parameter in the region that the consuming
     * stack is created.
     *
     * @param exportName the unique name associated with the export
     * @param reference the value that will be exported
     * @returns a reference to the reader custom resource
     */
    exportValue(exportName, reference, importStack) {
        const stack = stack_1.Stack.of(this);
        const parameterName = `/${types_1.SSM_EXPORT_PATH_PREFIX}${exportName}`;
        const ref = new cfn_dynamic_reference_1.CfnDynamicReference(cfn_dynamic_reference_1.CfnDynamicReferenceService.SSM, parameterName);
        this._references[parameterName] = stack.resolve(reference.toString());
        return this.addToExportReader(parameterName, ref, importStack);
    }
    /**
     * Add the export to the export reader which is created in the importing stack
     */
    addToExportReader(exportName, exportValueRef, importStack) {
        const readerConstructName = (0, uniqueid_1.makeUniqueId)(['ExportsReader']);
        const exportReader = export_reader_provider_1.ExportReader.getOrCreate(importStack.nestedStackParent ?? importStack, readerConstructName);
        return exportReader.importValue(exportName, exportValueRef);
    }
}
exports.ExportWriter = ExportWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXdyaXRlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydC13cml0ZXItcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxxRUFBd0Q7QUFDeEQsbUNBQTBGO0FBQzFGLHVFQUE4RjtBQUM5RiwyREFBdUQ7QUFDdkQscUNBQWtDO0FBRWxDLHFEQUFzRDtBQUV0RCx1Q0FBb0M7QUFDcEMsMEVBQW9HO0FBY3BHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsc0JBQVM7SUFDbEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLFFBQWdCLEVBQUUsS0FBd0I7UUFDcEYsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxPQUFPLFFBQVE7WUFDYixDQUFDLENBQUMsUUFBd0I7WUFDMUIsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTthQUNyQixDQUFDLENBQUM7S0FDTjtJQUVELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUZGLGdCQUFXLEdBQXVCLEVBQUUsQ0FBQztRQUdwRCxNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxpQ0FBaUMsQ0FBQztRQUN2RCxNQUFNLFlBQVksR0FBRyxpREFBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMxRSxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUNBQWlDLENBQUM7WUFDdEUsT0FBTyxFQUFFLHdEQUE2QixDQUFDLFdBQVc7WUFDbEQsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDakIsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7d0JBQ3hCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLFFBQVEsRUFBRSxXQUFXO3dCQUNyQixNQUFNO3dCQUNOLFlBQVksRUFBRSxHQUFHLDhCQUFzQixHQUFHO3FCQUMzQyxDQUFDO29CQUNGLE1BQU0sRUFBRTt3QkFDTixzQkFBc0I7d0JBQ3RCLHlCQUF5Qjt3QkFDekIsbUJBQW1CO3dCQUNuQixrQkFBa0I7cUJBQ25CO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBd0I7WUFDdEMsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdkQsQ0FBQztRQUNGLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25DLFlBQVksRUFBRSxZQUFZO1lBQzFCLFlBQVk7WUFDWixVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLFVBQVU7YUFDeEI7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxXQUFXLENBQUMsVUFBa0IsRUFBRSxTQUFvQixFQUFFLFdBQWtCO1FBQzdFLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsTUFBTSxhQUFhLEdBQUcsSUFBSSw4QkFBc0IsR0FBRyxVQUFVLEVBQUUsQ0FBQztRQUVoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLDJDQUFtQixDQUFDLGtEQUEwQixDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVuRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNoRTtJQUVEOztPQUVHO0lBQ0ssaUJBQWlCLENBQUMsVUFBa0IsRUFBRSxjQUF5QixFQUFFLFdBQWtCO1FBQ3pGLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSx1QkFBWSxFQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLFlBQVksR0FBRyxxQ0FBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLElBQUksV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFakgsT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUM3RDtDQUNGO0FBaEZELG9DQWdGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEV4cG9ydFJlYWRlciB9IGZyb20gJy4vZXhwb3J0LXJlYWRlci1wcm92aWRlcic7XG5pbXBvcnQgeyBDcm9zc1JlZ2lvbkV4cG9ydHMsIFNTTV9FWFBPUlRfUEFUSF9QUkVGSVgsIEV4cG9ydFdyaXRlckNSUHJvcHMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENmbkR5bmFtaWNSZWZlcmVuY2UsIENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2ZuLWR5bmFtaWMtcmVmZXJlbmNlJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlIH0gZnJvbSAnLi4vLi4vY3VzdG9tLXJlc291cmNlJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuLi8uLi9sYXp5JztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4uLy4uL3ByaXZhdGUvaW50cmluc2ljJztcbmltcG9ydCB7IG1ha2VVbmlxdWVJZCB9IGZyb20gJy4uLy4uL3ByaXZhdGUvdW5pcXVlaWQnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi4vLi4vcmVmZXJlbmNlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vLi4vc3RhY2snO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICcuLi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXInO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEV4cG9ydFJlYWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4cG9ydFdyaXRlclByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBBV1MgcmVnaW9uIHRvIHJlYWQgU3RhY2sgZXhwb3J0cyBmcm9tXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHN0YWNrIHJlZ2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjdXN0b20gcmVzb3VyY2UgdGhhdCB3aWxsIHJldHVybiBhIGxpc3Qgb2Ygc3RhY2sgZXhwb3J0cyBmcm9tIGEgZ2l2ZW5cbiAqIEFXUyByZWdpb24uIFRoZSBleHBvcnQgY2FuIHRoZW4gYmUgcmVmZXJlbmNlZCBieSB0aGUgZXhwb3J0IG5hbWUuXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBkZWNsYXJlIGNvbnN0IGFwcDogQXBwO1xuICogY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ0Vhc3QxU3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gKiBuZXcgQ2ZuT3V0cHV0KHN0YWNrMSwgJ091dHB1dCcsIHsgdmFsdWU6ICdzb21lVmFsdWUnLCBleHBvcnROYW1lOiAnc29tZU5hbWUnIH0pO1xuICpcbiAqIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdFYXN0MlN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0yJyB9IH0pO1xuICogY29uc3QgZXhwb3J0UmVhZGVyID0gbmV3IEV4cG9ydFJlYWRlcihzdGFjazIsICdFeHBvcnRSZWFkZXInLCB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSk7XG4gKiBjb25zdCBhbm90aGVyUmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnQW5vdGhlclJlc291cmNlJywge1xuICogICBQYXJhbWV0ZXJzOiB7XG4gKiAgICAgU29tZVBhcmFtOiBleHBvcnRSZWFkZXIuaW1wb3J0VmFsdWUoJ3NvbWVOYW1lJyksXG4gKiAgIH0sXG4gKiB9KTtcbiAqXG4gKiBAaW50ZXJuYWwgLSB0aGlzIGlzIGludGVudGlvbmFsbHkgbm90IGV4cG9ydGVkIGZyb20gY29yZVxuICovXG5leHBvcnQgY2xhc3MgRXhwb3J0V3JpdGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0LCB1bmlxdWVJZDogc3RyaW5nLCBwcm9wczogRXhwb3J0V3JpdGVyUHJvcHMpOiBFeHBvcnRXcml0ZXIge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQodW5pcXVlSWQpO1xuICAgIHJldHVybiBleGlzdGluZ1xuICAgICAgPyBleGlzdGluZyBhcyBFeHBvcnRXcml0ZXJcbiAgICAgIDogbmV3IEV4cG9ydFdyaXRlcihzdGFjaywgdW5pcXVlSWQsIHtcbiAgICAgICAgcmVnaW9uOiBwcm9wcy5yZWdpb24sXG4gICAgICB9KTtcbiAgfVxuICBwcml2YXRlIHJlYWRvbmx5IF9yZWZlcmVuY2VzOiBDcm9zc1JlZ2lvbkV4cG9ydHMgPSB7fTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEV4cG9ydFdyaXRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHJlZ2lvbiA9IHByb3BzLnJlZ2lvbiA/PyBzdGFjay5yZWdpb247XG5cbiAgICBjb25zdCByZXNvdXJjZVR5cGUgPSAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcic7XG4gICAgY29uc3Qgc2VydmljZVRva2VuID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCByZXNvdXJjZVR5cGUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdjcm9zcy1yZWdpb24tc3NtLXdyaXRlci1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgc2VydmljZTogJ3NzbScsXG4gICAgICAgICAgcmVzb3VyY2U6ICdwYXJhbWV0ZXInLFxuICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICByZXNvdXJjZU5hbWU6IGAke1NTTV9FWFBPUlRfUEFUSF9QUkVGSVh9KmAsXG4gICAgICAgIH0pLFxuICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAnc3NtOkRlbGV0ZVBhcmFtZXRlcnMnLFxuICAgICAgICAgICdzc206TGlzdFRhZ3NGb3JSZXNvdXJjZScsXG4gICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAnc3NtOlB1dFBhcmFtZXRlcicsXG4gICAgICAgIF0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cG9ydFdyaXRlckNSUHJvcHMgPSB7XG4gICAgICByZWdpb246IHJlZ2lvbixcbiAgICAgIGV4cG9ydHM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5fcmVmZXJlbmNlcyB9KSxcbiAgICB9O1xuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IHJlc291cmNlVHlwZSxcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgV3JpdGVyUHJvcHM6IHByb3BlcnRpZXMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgcmVmZXJlbmNlIHdpdGggdGhlIHdyaXRlciBhbmQgcmV0dXJucyBhIENsb3VkRm9ybWF0aW9uIFN0YWNrIGV4cG9ydCBieSBuYW1lXG4gICAqXG4gICAqIFRoZSB2YWx1ZSB3aWxsIGJlIFwiZXhwb3J0ZWRcIiB2aWEgdGhlIEV4cG9ydFdyaXRlci4gSXQgd2lsbCBwZXJmb3JtXG4gICAqIHRoZSBleHBvcnQgYnkgY3JlYXRpbmcgYW4gU1NNIHBhcmFtZXRlciBpbiB0aGUgcmVnaW9uIHRoYXQgdGhlIGNvbnN1bWluZ1xuICAgKiBzdGFjayBpcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXhwb3J0TmFtZSB0aGUgdW5pcXVlIG5hbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBleHBvcnRcbiAgICogQHBhcmFtIHJlZmVyZW5jZSB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIGV4cG9ydGVkXG4gICAqIEByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSByZWFkZXIgY3VzdG9tIHJlc291cmNlXG4gICAqL1xuICBwdWJsaWMgZXhwb3J0VmFsdWUoZXhwb3J0TmFtZTogc3RyaW5nLCByZWZlcmVuY2U6IFJlZmVyZW5jZSwgaW1wb3J0U3RhY2s6IFN0YWNrKTogSW50cmluc2ljIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHBhcmFtZXRlck5hbWUgPSBgLyR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH0ke2V4cG9ydE5hbWV9YDtcblxuICAgIGNvbnN0IHJlZiA9IG5ldyBDZm5EeW5hbWljUmVmZXJlbmNlKENmbkR5bmFtaWNSZWZlcmVuY2VTZXJ2aWNlLlNTTSwgcGFyYW1ldGVyTmFtZSk7XG5cbiAgICB0aGlzLl9yZWZlcmVuY2VzW3BhcmFtZXRlck5hbWVdID0gc3RhY2sucmVzb2x2ZShyZWZlcmVuY2UudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9FeHBvcnRSZWFkZXIocGFyYW1ldGVyTmFtZSwgcmVmLCBpbXBvcnRTdGFjayk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBleHBvcnQgdG8gdGhlIGV4cG9ydCByZWFkZXIgd2hpY2ggaXMgY3JlYXRlZCBpbiB0aGUgaW1wb3J0aW5nIHN0YWNrXG4gICAqL1xuICBwcml2YXRlIGFkZFRvRXhwb3J0UmVhZGVyKGV4cG9ydE5hbWU6IHN0cmluZywgZXhwb3J0VmFsdWVSZWY6IEludHJpbnNpYywgaW1wb3J0U3RhY2s6IFN0YWNrKTogSW50cmluc2ljIHtcbiAgICBjb25zdCByZWFkZXJDb25zdHJ1Y3ROYW1lID0gbWFrZVVuaXF1ZUlkKFsnRXhwb3J0c1JlYWRlciddKTtcbiAgICBjb25zdCBleHBvcnRSZWFkZXIgPSBFeHBvcnRSZWFkZXIuZ2V0T3JDcmVhdGUoaW1wb3J0U3RhY2submVzdGVkU3RhY2tQYXJlbnQgPz8gaW1wb3J0U3RhY2ssIHJlYWRlckNvbnN0cnVjdE5hbWUpO1xuXG4gICAgcmV0dXJuIGV4cG9ydFJlYWRlci5pbXBvcnRWYWx1ZShleHBvcnROYW1lLCBleHBvcnRWYWx1ZVJlZik7XG4gIH1cbn1cbiJdfQ==