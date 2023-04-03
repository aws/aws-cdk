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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXdyaXRlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cG9ydC13cml0ZXItcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxxRUFBd0Q7QUFDeEQsbUNBQTBGO0FBQzFGLHVFQUE4RjtBQUM5RiwyREFBdUQ7QUFDdkQscUNBQWtDO0FBRWxDLHFEQUFzRDtBQUV0RCx1Q0FBb0M7QUFDcEMsMEVBQW9HO0FBY3BHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsc0JBQVM7SUFDbEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLFFBQWdCLEVBQUUsS0FBd0I7UUFDcEYsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxPQUFPLFFBQVE7WUFDYixDQUFDLENBQUMsUUFBd0I7WUFDMUIsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTthQUNyQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRkYsZ0JBQVcsR0FBdUIsRUFBRSxDQUFDO1FBR3BELE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRTVDLE1BQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO1FBQ3ZELE1BQU0sWUFBWSxHQUFHLGlEQUFzQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzFFLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQ0FBaUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsd0RBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDeEIsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLE1BQU07d0JBQ04sWUFBWSxFQUFFLEdBQUcsOEJBQXNCLEdBQUc7cUJBQzNDLENBQUM7b0JBQ0YsTUFBTSxFQUFFO3dCQUNOLHNCQUFzQjt3QkFDdEIseUJBQXlCO3dCQUN6QixtQkFBbUI7d0JBQ25CLGtCQUFrQjtxQkFDbkI7aUJBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUF3QjtZQUN0QyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN2RCxDQUFDO1FBQ0YsSUFBSSxnQ0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFlBQVk7WUFDMUIsWUFBWTtZQUNaLFVBQVUsRUFBRTtnQkFDVixXQUFXLEVBQUUsVUFBVTthQUN4QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksV0FBVyxDQUFDLFVBQWtCLEVBQUUsU0FBb0IsRUFBRSxXQUFrQjtRQUM3RSxNQUFNLEtBQUssR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksOEJBQXNCLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFFaEUsTUFBTSxHQUFHLEdBQUcsSUFBSSwyQ0FBbUIsQ0FBQyxrREFBMEIsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFbkYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVEOztPQUVHO0lBQ0ssaUJBQWlCLENBQUMsVUFBa0IsRUFBRSxjQUF5QixFQUFFLFdBQWtCO1FBQ3pGLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSx1QkFBWSxFQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLFlBQVksR0FBRyxxQ0FBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLElBQUksV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFakgsT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM5RCxDQUFDO0NBQ0Y7QUFoRkQsb0NBZ0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRXhwb3J0UmVhZGVyIH0gZnJvbSAnLi9leHBvcnQtcmVhZGVyLXByb3ZpZGVyJztcbmltcG9ydCB7IENyb3NzUmVnaW9uRXhwb3J0cywgU1NNX0VYUE9SVF9QQVRIX1BSRUZJWCwgRXhwb3J0V3JpdGVyQ1JQcm9wcyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2ZuRHluYW1pY1JlZmVyZW5jZSwgQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZm4tZHluYW1pYy1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9jdXN0b20tcmVzb3VyY2UnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4uLy4uL2xhenknO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi4vLi4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgbWFrZVVuaXF1ZUlkIH0gZnJvbSAnLi4vLi4vcHJpdmF0ZS91bmlxdWVpZCc7XG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuLi8uLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi8uLi9zdGFjayc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB9IGZyb20gJy4uL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlcic7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYW4gRXhwb3J0UmVhZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0V3JpdGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIEFXUyByZWdpb24gdG8gcmVhZCBTdGFjayBleHBvcnRzIGZyb21cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgc3RhY2sgcmVnaW9uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGN1c3RvbSByZXNvdXJjZSB0aGF0IHdpbGwgcmV0dXJuIGEgbGlzdCBvZiBzdGFjayBleHBvcnRzIGZyb20gYSBnaXZlblxuICogQVdTIHJlZ2lvbi4gVGhlIGV4cG9ydCBjYW4gdGhlbiBiZSByZWZlcmVuY2VkIGJ5IHRoZSBleHBvcnQgbmFtZS5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIGRlY2xhcmUgY29uc3QgYXBwOiBBcHA7XG4gKiBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnRWFzdDFTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAqIG5ldyBDZm5PdXRwdXQoc3RhY2sxLCAnT3V0cHV0JywgeyB2YWx1ZTogJ3NvbWVWYWx1ZScsIGV4cG9ydE5hbWU6ICdzb21lTmFtZScgfSk7XG4gKlxuICogY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ0Vhc3QyU3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTInIH0gfSk7XG4gKiBjb25zdCBleHBvcnRSZWFkZXIgPSBuZXcgRXhwb3J0UmVhZGVyKHN0YWNrMiwgJ0V4cG9ydFJlYWRlcicsIHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9KTtcbiAqIGNvbnN0IGFub3RoZXJSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdBbm90aGVyUmVzb3VyY2UnLCB7XG4gKiAgIFBhcmFtZXRlcnM6IHtcbiAqICAgICBTb21lUGFyYW06IGV4cG9ydFJlYWRlci5pbXBvcnRWYWx1ZSgnc29tZU5hbWUnKSxcbiAqICAgfSxcbiAqIH0pO1xuICpcbiAqIEBpbnRlcm5hbCAtIHRoaXMgaXMgaW50ZW50aW9uYWxseSBub3QgZXhwb3J0ZWQgZnJvbSBjb3JlXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHBvcnRXcml0ZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QsIHVuaXF1ZUlkOiBzdHJpbmcsIHByb3BzOiBFeHBvcnRXcml0ZXJQcm9wcyk6IEV4cG9ydFdyaXRlciB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCh1bmlxdWVJZCk7XG4gICAgcmV0dXJuIGV4aXN0aW5nXG4gICAgICA/IGV4aXN0aW5nIGFzIEV4cG9ydFdyaXRlclxuICAgICAgOiBuZXcgRXhwb3J0V3JpdGVyKHN0YWNrLCB1bmlxdWVJZCwge1xuICAgICAgICByZWdpb246IHByb3BzLnJlZ2lvbixcbiAgICAgIH0pO1xuICB9XG4gIHByaXZhdGUgcmVhZG9ubHkgX3JlZmVyZW5jZXM6IENyb3NzUmVnaW9uRXhwb3J0cyA9IHt9O1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRXhwb3J0V3JpdGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgcmVnaW9uID0gcHJvcHMucmVnaW9uID8/IHN0YWNrLnJlZ2lvbjtcblxuICAgIGNvbnN0IHJlc291cmNlVHlwZSA9ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyJztcbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Nyb3NzLXJlZ2lvbi1zc20td3JpdGVyLWhhbmRsZXInKSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICBzZXJ2aWNlOiAnc3NtJyxcbiAgICAgICAgICByZXNvdXJjZTogJ3BhcmFtZXRlcicsXG4gICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogYCR7U1NNX0VYUE9SVF9QQVRIX1BSRUZJWH0qYCxcbiAgICAgICAgfSksXG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICdzc206RGVsZXRlUGFyYW1ldGVycycsXG4gICAgICAgICAgJ3NzbTpMaXN0VGFnc0ZvclJlc291cmNlJyxcbiAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICdzc206UHV0UGFyYW1ldGVyJyxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcGVydGllczogRXhwb3J0V3JpdGVyQ1JQcm9wcyA9IHtcbiAgICAgIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgZXhwb3J0czogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLl9yZWZlcmVuY2VzIH0pLFxuICAgIH07XG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogcmVzb3VyY2VUeXBlLFxuICAgICAgc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBXcml0ZXJQcm9wczogcHJvcGVydGllcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSByZWZlcmVuY2Ugd2l0aCB0aGUgd3JpdGVyIGFuZCByZXR1cm5zIGEgQ2xvdWRGb3JtYXRpb24gU3RhY2sgZXhwb3J0IGJ5IG5hbWVcbiAgICpcbiAgICogVGhlIHZhbHVlIHdpbGwgYmUgXCJleHBvcnRlZFwiIHZpYSB0aGUgRXhwb3J0V3JpdGVyLiBJdCB3aWxsIHBlcmZvcm1cbiAgICogdGhlIGV4cG9ydCBieSBjcmVhdGluZyBhbiBTU00gcGFyYW1ldGVyIGluIHRoZSByZWdpb24gdGhhdCB0aGUgY29uc3VtaW5nXG4gICAqIHN0YWNrIGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBleHBvcnROYW1lIHRoZSB1bmlxdWUgbmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGV4cG9ydFxuICAgKiBAcGFyYW0gcmVmZXJlbmNlIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgZXhwb3J0ZWRcbiAgICogQHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIHJlYWRlciBjdXN0b20gcmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyBleHBvcnRWYWx1ZShleHBvcnROYW1lOiBzdHJpbmcsIHJlZmVyZW5jZTogUmVmZXJlbmNlLCBpbXBvcnRTdGFjazogU3RhY2spOiBJbnRyaW5zaWMge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgcGFyYW1ldGVyTmFtZSA9IGAvJHtTU01fRVhQT1JUX1BBVEhfUFJFRklYfSR7ZXhwb3J0TmFtZX1gO1xuXG4gICAgY29uc3QgcmVmID0gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU1NNLCBwYXJhbWV0ZXJOYW1lKTtcblxuICAgIHRoaXMuX3JlZmVyZW5jZXNbcGFyYW1ldGVyTmFtZV0gPSBzdGFjay5yZXNvbHZlKHJlZmVyZW5jZS50b1N0cmluZygpKTtcbiAgICByZXR1cm4gdGhpcy5hZGRUb0V4cG9ydFJlYWRlcihwYXJhbWV0ZXJOYW1lLCByZWYsIGltcG9ydFN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGV4cG9ydCB0byB0aGUgZXhwb3J0IHJlYWRlciB3aGljaCBpcyBjcmVhdGVkIGluIHRoZSBpbXBvcnRpbmcgc3RhY2tcbiAgICovXG4gIHByaXZhdGUgYWRkVG9FeHBvcnRSZWFkZXIoZXhwb3J0TmFtZTogc3RyaW5nLCBleHBvcnRWYWx1ZVJlZjogSW50cmluc2ljLCBpbXBvcnRTdGFjazogU3RhY2spOiBJbnRyaW5zaWMge1xuICAgIGNvbnN0IHJlYWRlckNvbnN0cnVjdE5hbWUgPSBtYWtlVW5pcXVlSWQoWydFeHBvcnRzUmVhZGVyJ10pO1xuICAgIGNvbnN0IGV4cG9ydFJlYWRlciA9IEV4cG9ydFJlYWRlci5nZXRPckNyZWF0ZShpbXBvcnRTdGFjay5uZXN0ZWRTdGFja1BhcmVudCA/PyBpbXBvcnRTdGFjaywgcmVhZGVyQ29uc3RydWN0TmFtZSk7XG5cbiAgICByZXR1cm4gZXhwb3J0UmVhZGVyLmltcG9ydFZhbHVlKGV4cG9ydE5hbWUsIGV4cG9ydFZhbHVlUmVmKTtcbiAgfVxufVxuIl19