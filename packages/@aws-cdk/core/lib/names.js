"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Names = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const encoding_1 = require("./private/encoding");
const unique_resource_name_1 = require("./private/unique-resource-name");
const uniqueid_1 = require("./private/uniqueid");
const stack_1 = require("./stack");
/**
 * Functions for devising unique names for constructs. For example, those can be
 * used to allocate unique physical names for resources.
 */
class Names {
    constructor() { }
    /**
     * Returns a CloudFormation-compatible unique identifier for a construct based
     * on its path. The identifier includes a human readable portion rendered
     * from the path components and a hash suffix. uniqueId is not unique if multiple
     * copies of the stack are deployed. Prefer using uniqueResourceName().
     *
     * @param construct The construct
     * @returns a unique id based on the construct path
     */
    static uniqueId(construct) {
        const node = constructs_1.Node.of(construct);
        const components = node.scopes.slice(1).map(c => constructs_1.Node.of(c).id);
        return components.length > 0 ? uniqueid_1.makeUniqueId(components) : '';
    }
    /**
     * Returns a CloudFormation-compatible unique identifier for a construct based
     * on its path. The identifier includes a human readable portion rendered
     * from the path components and a hash suffix.
     *
     * TODO (v2): replace with API to use `constructs.Node`.
     *
     * @param node The construct node
     * @returns a unique id based on the construct path
     */
    static nodeUniqueId(node) {
        const components = node.scopes.slice(1).map(c => constructs_1.Node.of(c).id);
        return components.length > 0 ? uniqueid_1.makeUniqueId(components) : '';
    }
    /**
     * Returns a CloudFormation-compatible unique identifier for a construct based
     * on its path. This function finds the stackName of the parent stack (non-nested)
     * to the construct, and the ids of the components in the construct path.
     *
     * The user can define allowed special characters, a separator between the elements,
     * and the maximum length of the resource name. The name includes a human readable portion rendered
     * from the path components, with or without user defined separators, and a hash suffix.
     * If the resource name is longer than the maximum length, it is trimmed in the middle.
     *
     * @param construct The construct
     * @param options Options for defining the unique resource name
     * @returns a unique resource name based on the construct path
     */
    static uniqueResourceName(construct, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_UniqueResourceNameOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.uniqueResourceName);
            }
            throw error;
        }
        const node = constructs_1.Node.of(construct);
        const componentsPath = node.scopes.slice(node.scopes.indexOf(node.scopes.reverse()
            .find(component => (stack_1.Stack.isStack(component) && !encoding_1.unresolved(component.stackName))))).map(component => stack_1.Stack.isStack(component) && !encoding_1.unresolved(component.stackName) ? component.stackName : constructs_1.Node.of(component).id);
        return unique_resource_name_1.makeUniqueResourceName(componentsPath, options);
    }
}
exports.Names = Names;
_a = JSII_RTTI_SYMBOL_1;
Names[_a] = { fqn: "@aws-cdk/core.Names", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQWdEO0FBQ2hELHlFQUF3RTtBQUN4RSxpREFBa0Q7QUFDbEQsbUNBQWdDO0FBOEJoQzs7O0dBR0c7QUFDSCxNQUFhLEtBQUs7SUF1RGhCLGlCQUF3QjtJQXREeEI7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQXFCO1FBQzFDLE1BQU0sSUFBSSxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUM5RDtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBVTtRQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDOUQ7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQXFCLEVBQUUsT0FBa0M7Ozs7Ozs7Ozs7UUFDeEYsTUFBTSxJQUFJLEdBQUcsaUJBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFaEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7YUFDL0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMscUJBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxDQUNwRixDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHFCQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVoSSxPQUFPLDZDQUFzQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN4RDs7QUFyREgsc0JBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdW5yZXNvbHZlZCB9IGZyb20gJy4vcHJpdmF0ZS9lbmNvZGluZyc7XG5pbXBvcnQgeyBtYWtlVW5pcXVlUmVzb3VyY2VOYW1lIH0gZnJvbSAnLi9wcml2YXRlL3VuaXF1ZS1yZXNvdXJjZS1uYW1lJztcbmltcG9ydCB7IG1ha2VVbmlxdWVJZCB9IGZyb20gJy4vcHJpdmF0ZS91bmlxdWVpZCc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuXG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgYSB1bmlxdWUgcmVzb3VyY2UgbmFtZS5cbiovXG5leHBvcnQgaW50ZXJmYWNlIFVuaXF1ZVJlc291cmNlTmFtZU9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBsZW5ndGggb2YgdGhlIHVuaXF1ZSByZXNvdXJjZSBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDI1NlxuICAgKi9cbiAgcmVhZG9ubHkgbWF4TGVuZ3RoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VwYXJhdG9yIHVzZWQgYmV0d2VlbiB0aGUgcGF0aCBjb21wb25lbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHNlcGFyYXRvcj86IHN0cmluZztcblxuICAvKipcbiAgICogTm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGFsbG93ZWQgaW4gdGhlIHVuaXF1ZSByZXNvdXJjZSBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRTcGVjaWFsQ2hhcmFjdGVycz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBGdW5jdGlvbnMgZm9yIGRldmlzaW5nIHVuaXF1ZSBuYW1lcyBmb3IgY29uc3RydWN0cy4gRm9yIGV4YW1wbGUsIHRob3NlIGNhbiBiZVxuICogdXNlZCB0byBhbGxvY2F0ZSB1bmlxdWUgcGh5c2ljYWwgbmFtZXMgZm9yIHJlc291cmNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5hbWVzIHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBDbG91ZEZvcm1hdGlvbi1jb21wYXRpYmxlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciBhIGNvbnN0cnVjdCBiYXNlZFxuICAgKiBvbiBpdHMgcGF0aC4gVGhlIGlkZW50aWZpZXIgaW5jbHVkZXMgYSBodW1hbiByZWFkYWJsZSBwb3J0aW9uIHJlbmRlcmVkXG4gICAqIGZyb20gdGhlIHBhdGggY29tcG9uZW50cyBhbmQgYSBoYXNoIHN1ZmZpeC4gdW5pcXVlSWQgaXMgbm90IHVuaXF1ZSBpZiBtdWx0aXBsZVxuICAgKiBjb3BpZXMgb2YgdGhlIHN0YWNrIGFyZSBkZXBsb3llZC4gUHJlZmVyIHVzaW5nIHVuaXF1ZVJlc291cmNlTmFtZSgpLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0IFRoZSBjb25zdHJ1Y3RcbiAgICogQHJldHVybnMgYSB1bmlxdWUgaWQgYmFzZWQgb24gdGhlIGNvbnN0cnVjdCBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVuaXF1ZUlkKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IHN0cmluZyB7XG4gICAgY29uc3Qgbm9kZSA9IE5vZGUub2YoY29uc3RydWN0KTtcbiAgICBjb25zdCBjb21wb25lbnRzID0gbm9kZS5zY29wZXMuc2xpY2UoMSkubWFwKGMgPT4gTm9kZS5vZihjKS5pZCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudHMubGVuZ3RoID4gMCA/IG1ha2VVbmlxdWVJZChjb21wb25lbnRzKSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBDbG91ZEZvcm1hdGlvbi1jb21wYXRpYmxlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciBhIGNvbnN0cnVjdCBiYXNlZFxuICAgKiBvbiBpdHMgcGF0aC4gVGhlIGlkZW50aWZpZXIgaW5jbHVkZXMgYSBodW1hbiByZWFkYWJsZSBwb3J0aW9uIHJlbmRlcmVkXG4gICAqIGZyb20gdGhlIHBhdGggY29tcG9uZW50cyBhbmQgYSBoYXNoIHN1ZmZpeC5cbiAgICpcbiAgICogVE9ETyAodjIpOiByZXBsYWNlIHdpdGggQVBJIHRvIHVzZSBgY29uc3RydWN0cy5Ob2RlYC5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgVGhlIGNvbnN0cnVjdCBub2RlXG4gICAqIEByZXR1cm5zIGEgdW5pcXVlIGlkIGJhc2VkIG9uIHRoZSBjb25zdHJ1Y3QgcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub2RlVW5pcXVlSWQobm9kZTogTm9kZSk6IHN0cmluZyB7XG4gICAgY29uc3QgY29tcG9uZW50cyA9IG5vZGUuc2NvcGVzLnNsaWNlKDEpLm1hcChjID0+IE5vZGUub2YoYykuaWQpO1xuICAgIHJldHVybiBjb21wb25lbnRzLmxlbmd0aCA+IDAgPyBtYWtlVW5pcXVlSWQoY29tcG9uZW50cykgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgQ2xvdWRGb3JtYXRpb24tY29tcGF0aWJsZSB1bmlxdWUgaWRlbnRpZmllciBmb3IgYSBjb25zdHJ1Y3QgYmFzZWRcbiAgICogb24gaXRzIHBhdGguIFRoaXMgZnVuY3Rpb24gZmluZHMgdGhlIHN0YWNrTmFtZSBvZiB0aGUgcGFyZW50IHN0YWNrIChub24tbmVzdGVkKVxuICAgKiB0byB0aGUgY29uc3RydWN0LCBhbmQgdGhlIGlkcyBvZiB0aGUgY29tcG9uZW50cyBpbiB0aGUgY29uc3RydWN0IHBhdGguXG4gICAqXG4gICAqIFRoZSB1c2VyIGNhbiBkZWZpbmUgYWxsb3dlZCBzcGVjaWFsIGNoYXJhY3RlcnMsIGEgc2VwYXJhdG9yIGJldHdlZW4gdGhlIGVsZW1lbnRzLFxuICAgKiBhbmQgdGhlIG1heGltdW0gbGVuZ3RoIG9mIHRoZSByZXNvdXJjZSBuYW1lLiBUaGUgbmFtZSBpbmNsdWRlcyBhIGh1bWFuIHJlYWRhYmxlIHBvcnRpb24gcmVuZGVyZWRcbiAgICogZnJvbSB0aGUgcGF0aCBjb21wb25lbnRzLCB3aXRoIG9yIHdpdGhvdXQgdXNlciBkZWZpbmVkIHNlcGFyYXRvcnMsIGFuZCBhIGhhc2ggc3VmZml4LlxuICAgKiBJZiB0aGUgcmVzb3VyY2UgbmFtZSBpcyBsb25nZXIgdGhhbiB0aGUgbWF4aW11bSBsZW5ndGgsIGl0IGlzIHRyaW1tZWQgaW4gdGhlIG1pZGRsZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnN0cnVjdCBUaGUgY29uc3RydWN0XG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGRlZmluaW5nIHRoZSB1bmlxdWUgcmVzb3VyY2UgbmFtZVxuICAgKiBAcmV0dXJucyBhIHVuaXF1ZSByZXNvdXJjZSBuYW1lIGJhc2VkIG9uIHRoZSBjb25zdHJ1Y3QgcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB1bmlxdWVSZXNvdXJjZU5hbWUoY29uc3RydWN0OiBJQ29uc3RydWN0LCBvcHRpb25zOiBVbmlxdWVSZXNvdXJjZU5hbWVPcHRpb25zKSB7XG4gICAgY29uc3Qgbm9kZSA9IE5vZGUub2YoY29uc3RydWN0KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudHNQYXRoID0gbm9kZS5zY29wZXMuc2xpY2Uobm9kZS5zY29wZXMuaW5kZXhPZihub2RlLnNjb3Blcy5yZXZlcnNlKClcbiAgICAgIC5maW5kKGNvbXBvbmVudCA9PiAoU3RhY2suaXNTdGFjayhjb21wb25lbnQpICYmICF1bnJlc29sdmVkKGNvbXBvbmVudC5zdGFja05hbWUpKSkhLFxuICAgICkpLm1hcChjb21wb25lbnQgPT4gU3RhY2suaXNTdGFjayhjb21wb25lbnQpICYmICF1bnJlc29sdmVkKGNvbXBvbmVudC5zdGFja05hbWUpID8gY29tcG9uZW50LnN0YWNrTmFtZSA6IE5vZGUub2YoY29tcG9uZW50KS5pZCk7XG5cbiAgICByZXR1cm4gbWFrZVVuaXF1ZVJlc291cmNlTmFtZShjb21wb25lbnRzUGF0aCwgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbn1cbiJdfQ==