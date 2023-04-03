"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnOutput = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
class CfnOutput extends cfn_element_1.CfnElement {
    /**
     * Creates an CfnOutput value for this stack.
     * @param scope The parent construct.
     * @param props CfnOutput properties.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnOutputProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnOutput);
            }
            throw error;
        }
        if (props.value === undefined) {
            throw new Error(`Missing value for CloudFormation output at path "${this.node.path}"`);
        }
        else if (Array.isArray(props.value)) {
            // `props.value` is a string, but because cross-stack exports allow passing any,
            // we need to check for lists here.
            throw new Error(`CloudFormation output was given a string list instead of a string at path "${this.node.path}"`);
        }
        this._description = props.description;
        this._value = props.value;
        this._condition = props.condition;
        this._exportName = props.exportName;
        this.node.addValidation({ validate: () => this.validateOutput() });
    }
    /**
     * A String type that describes the output value.
     * The description can be a maximum of 4 K in length.
     *
     * @default - No description.
     */
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }
    /**
     * The value of the property returned by the aws cloudformation describe-stacks command.
     * The value of an output can include literals, parameter references, pseudo-parameters,
     * a mapping value, or intrinsic functions.
     */
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    /**
     * A condition to associate with this output value. If the condition evaluates
     * to `false`, this output value will not be included in the stack.
     *
     * @default - No condition is associated with the output.
     */
    get condition() {
        return this._condition;
    }
    set condition(condition) {
        this._condition = condition;
    }
    /**
     * The name used to export the value of this output across stacks.
     *
     * To use the value in another stack, pass the value of
     * `output.importValue` to it.
     *
     * @default - the output is not exported
     */
    get exportName() {
        return this._exportName;
    }
    set exportName(exportName) {
        this._exportName = exportName;
    }
    /**
     * Return the `Fn.importValue` expression to import this value into another stack
     *
     * The returned value should not be used in the same stack, but in a
     * different one. It must be deployed to the same environment, as
     * CloudFormation exports can only be imported in the same Region and
     * account.
     *
     * The is no automatic registration of dependencies between stacks when using
     * this mechanism, so you should make sure to deploy them in the right order
     * yourself.
     *
     * You can use this mechanism to share values across Stacks in different
     * Stages. If you intend to share the value to another Stack inside the same
     * Stage, the automatic cross-stack referencing mechanism is more convenient.
     */
    get importValue() {
        // We made _exportName mutable so this will have to be lazy.
        return cfn_fn_1.Fn.importValue(lazy_1.Lazy.uncachedString({
            produce: (ctx) => {
                if (stack_1.Stack.of(ctx.scope) === this.stack) {
                    throw new Error(`'importValue' property of '${this.node.path}' should only be used in a different Stack`);
                }
                if (!this._exportName) {
                    throw new Error(`Add an exportName to the CfnOutput at '${this.node.path}' in order to use 'output.importValue'`);
                }
                return this._exportName;
            },
        }));
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        return {
            Outputs: {
                [this.logicalId]: {
                    Description: this._description,
                    Value: this._value,
                    Export: this._exportName != null ? { Name: this._exportName } : undefined,
                    Condition: this._condition ? this._condition.logicalId : undefined,
                },
            },
        };
    }
    validateOutput() {
        if (this._exportName && !token_1.Token.isUnresolved(this._exportName) && this._exportName.length > 255) {
            return [`Export name cannot exceed 255 characters (got ${this._exportName.length} characters)`];
        }
        return [];
    }
}
exports.CfnOutput = CfnOutput;
_a = JSII_RTTI_SYMBOL_1;
CfnOutput[_a] = { fqn: "@aws-cdk/core.CfnOutput", version: "0.0.0" };
const cfn_fn_1 = require("./cfn-fn");
const lazy_1 = require("./lazy");
const stack_1 = require("./stack");
const token_1 = require("./token");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLW91dHB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1vdXRwdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTJDO0FBb0MzQyxNQUFhLFNBQVUsU0FBUSx3QkFBVTtJQU12Qzs7OztPQUlHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBWlIsU0FBUzs7OztRQWNsQixJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUN4RjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckMsZ0ZBQWdGO1lBQ2hGLG1DQUFtQztZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDbEg7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUVEOzs7OztPQUtHO0lBQ0gsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjtJQUVELElBQVcsV0FBVyxDQUFDLFdBQStCO1FBQ3BELElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0tBQ2pDO0lBRUQ7Ozs7T0FJRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjtJQUVELElBQVcsS0FBSyxDQUFDLEtBQVU7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7SUFFRDs7Ozs7T0FLRztJQUNILElBQVcsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDeEI7SUFFRCxJQUFXLFNBQVMsQ0FBQyxTQUFtQztRQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztLQUM3QjtJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0tBQ3pCO0lBRUQsSUFBVyxVQUFVLENBQUMsVUFBOEI7UUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7S0FDL0I7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxJQUFXLFdBQVc7UUFDcEIsNERBQTREO1FBQzVELE9BQU8sV0FBRSxDQUFDLFdBQVcsQ0FBQyxXQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNmLElBQUksYUFBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLDRDQUE0QyxDQUFDLENBQUM7aUJBQzNHO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksd0NBQXdDLENBQUMsQ0FBQztpQkFDbkg7Z0JBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFCLENBQUM7U0FDRixDQUFDLENBQUMsQ0FBQztLQUNMO0lBRUQ7O09BRUc7SUFDSSxpQkFBaUI7UUFDdEIsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDaEIsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZO29CQUM5QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUN6RSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQ25FO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7SUFFTyxjQUFjO1FBQ3BCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUM5RixPQUFPLENBQUMsaURBQWlELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQztTQUNqRztRQUNELE9BQU8sRUFBRSxDQUFDO0tBQ1g7O0FBNUlILDhCQTZJQzs7O0FBSUQscUNBQThCO0FBQzlCLGlDQUE4QjtBQUM5QixtQ0FBZ0M7QUFDaEMsbUNBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5FbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuT3V0cHV0UHJvcHMge1xuICAvKipcbiAgICogQSBTdHJpbmcgdHlwZSB0aGF0IGRlc2NyaWJlcyB0aGUgb3V0cHV0IHZhbHVlLlxuICAgKiBUaGUgZGVzY3JpcHRpb24gY2FuIGJlIGEgbWF4aW11bSBvZiA0IEsgaW4gbGVuZ3RoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgcmV0dXJuZWQgYnkgdGhlIGF3cyBjbG91ZGZvcm1hdGlvbiBkZXNjcmliZS1zdGFja3MgY29tbWFuZC5cbiAgICogVGhlIHZhbHVlIG9mIGFuIG91dHB1dCBjYW4gaW5jbHVkZSBsaXRlcmFscywgcGFyYW1ldGVyIHJlZmVyZW5jZXMsIHBzZXVkby1wYXJhbWV0ZXJzLFxuICAgKiBhIG1hcHBpbmcgdmFsdWUsIG9yIGludHJpbnNpYyBmdW5jdGlvbnMuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSB1c2VkIHRvIGV4cG9ydCB0aGUgdmFsdWUgb2YgdGhpcyBvdXRwdXQgYWNyb3NzIHN0YWNrcy5cbiAgICpcbiAgICogVG8gaW1wb3J0IHRoZSB2YWx1ZSBmcm9tIGFub3RoZXIgc3RhY2ssIHVzZSBgRm4uaW1wb3J0VmFsdWUoZXhwb3J0TmFtZSlgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBvdXRwdXQgaXMgbm90IGV4cG9ydGVkXG4gICAqL1xuICByZWFkb25seSBleHBvcnROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNvbmRpdGlvbiB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIG91dHB1dCB2YWx1ZS4gSWYgdGhlIGNvbmRpdGlvbiBldmFsdWF0ZXNcbiAgICogdG8gYGZhbHNlYCwgdGhpcyBvdXRwdXQgdmFsdWUgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbmRpdGlvbiBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIG91dHB1dC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbmRpdGlvbj86IENmbkNvbmRpdGlvbjtcbn1cblxuZXhwb3J0IGNsYXNzIENmbk91dHB1dCBleHRlbmRzIENmbkVsZW1lbnQge1xuICBwcml2YXRlIF9kZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBfY29uZGl0aW9uPzogQ2ZuQ29uZGl0aW9uO1xuICBwcml2YXRlIF92YWx1ZT86IGFueTtcbiAgcHJpdmF0ZSBfZXhwb3J0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBDZm5PdXRwdXQgdmFsdWUgZm9yIHRoaXMgc3RhY2suXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIHByb3BzIENmbk91dHB1dCBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbk91dHB1dFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgdmFsdWUgZm9yIENsb3VkRm9ybWF0aW9uIG91dHB1dCBhdCBwYXRoIFwiJHt0aGlzLm5vZGUucGF0aH1cImApO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwcm9wcy52YWx1ZSkpIHtcbiAgICAgIC8vIGBwcm9wcy52YWx1ZWAgaXMgYSBzdHJpbmcsIGJ1dCBiZWNhdXNlIGNyb3NzLXN0YWNrIGV4cG9ydHMgYWxsb3cgcGFzc2luZyBhbnksXG4gICAgICAvLyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBsaXN0cyBoZXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbG91ZEZvcm1hdGlvbiBvdXRwdXQgd2FzIGdpdmVuIGEgc3RyaW5nIGxpc3QgaW5zdGVhZCBvZiBhIHN0cmluZyBhdCBwYXRoIFwiJHt0aGlzLm5vZGUucGF0aH1cImApO1xuICAgIH1cblxuICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5fdmFsdWUgPSBwcm9wcy52YWx1ZTtcbiAgICB0aGlzLl9jb25kaXRpb24gPSBwcm9wcy5jb25kaXRpb247XG4gICAgdGhpcy5fZXhwb3J0TmFtZSA9IHByb3BzLmV4cG9ydE5hbWU7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlT3V0cHV0KCkgfSk7XG4gIH1cblxuICAvKipcbiAgICogQSBTdHJpbmcgdHlwZSB0aGF0IGRlc2NyaWJlcyB0aGUgb3V0cHV0IHZhbHVlLlxuICAgKiBUaGUgZGVzY3JpcHRpb24gY2FuIGJlIGEgbWF4aW11bSBvZiA0IEsgaW4gbGVuZ3RoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcHVibGljIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247XG4gIH1cblxuICBwdWJsaWMgc2V0IGRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgcmV0dXJuZWQgYnkgdGhlIGF3cyBjbG91ZGZvcm1hdGlvbiBkZXNjcmliZS1zdGFja3MgY29tbWFuZC5cbiAgICogVGhlIHZhbHVlIG9mIGFuIG91dHB1dCBjYW4gaW5jbHVkZSBsaXRlcmFscywgcGFyYW1ldGVyIHJlZmVyZW5jZXMsIHBzZXVkby1wYXJhbWV0ZXJzLFxuICAgKiBhIG1hcHBpbmcgdmFsdWUsIG9yIGludHJpbnNpYyBmdW5jdGlvbnMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQSBjb25kaXRpb24gdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBvdXRwdXQgdmFsdWUuIElmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzXG4gICAqIHRvIGBmYWxzZWAsIHRoaXMgb3V0cHV0IHZhbHVlIHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25kaXRpb24gaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBvdXRwdXQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbmRpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZGl0aW9uO1xuICB9XG5cbiAgcHVibGljIHNldCBjb25kaXRpb24oY29uZGl0aW9uOiBDZm5Db25kaXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9jb25kaXRpb24gPSBjb25kaXRpb247XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgdXNlZCB0byBleHBvcnQgdGhlIHZhbHVlIG9mIHRoaXMgb3V0cHV0IGFjcm9zcyBzdGFja3MuXG4gICAqXG4gICAqIFRvIHVzZSB0aGUgdmFsdWUgaW4gYW5vdGhlciBzdGFjaywgcGFzcyB0aGUgdmFsdWUgb2ZcbiAgICogYG91dHB1dC5pbXBvcnRWYWx1ZWAgdG8gaXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIG91dHB1dCBpcyBub3QgZXhwb3J0ZWRcbiAgICovXG4gIHB1YmxpYyBnZXQgZXhwb3J0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwb3J0TmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZXhwb3J0TmFtZShleHBvcnROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9leHBvcnROYW1lID0gZXhwb3J0TmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGBGbi5pbXBvcnRWYWx1ZWAgZXhwcmVzc2lvbiB0byBpbXBvcnQgdGhpcyB2YWx1ZSBpbnRvIGFub3RoZXIgc3RhY2tcbiAgICpcbiAgICogVGhlIHJldHVybmVkIHZhbHVlIHNob3VsZCBub3QgYmUgdXNlZCBpbiB0aGUgc2FtZSBzdGFjaywgYnV0IGluIGFcbiAgICogZGlmZmVyZW50IG9uZS4gSXQgbXVzdCBiZSBkZXBsb3llZCB0byB0aGUgc2FtZSBlbnZpcm9ubWVudCwgYXNcbiAgICogQ2xvdWRGb3JtYXRpb24gZXhwb3J0cyBjYW4gb25seSBiZSBpbXBvcnRlZCBpbiB0aGUgc2FtZSBSZWdpb24gYW5kXG4gICAqIGFjY291bnQuXG4gICAqXG4gICAqIFRoZSBpcyBubyBhdXRvbWF0aWMgcmVnaXN0cmF0aW9uIG9mIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHN0YWNrcyB3aGVuIHVzaW5nXG4gICAqIHRoaXMgbWVjaGFuaXNtLCBzbyB5b3Ugc2hvdWxkIG1ha2Ugc3VyZSB0byBkZXBsb3kgdGhlbSBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgICogeW91cnNlbGYuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgbWVjaGFuaXNtIHRvIHNoYXJlIHZhbHVlcyBhY3Jvc3MgU3RhY2tzIGluIGRpZmZlcmVudFxuICAgKiBTdGFnZXMuIElmIHlvdSBpbnRlbmQgdG8gc2hhcmUgdGhlIHZhbHVlIHRvIGFub3RoZXIgU3RhY2sgaW5zaWRlIHRoZSBzYW1lXG4gICAqIFN0YWdlLCB0aGUgYXV0b21hdGljIGNyb3NzLXN0YWNrIHJlZmVyZW5jaW5nIG1lY2hhbmlzbSBpcyBtb3JlIGNvbnZlbmllbnQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGltcG9ydFZhbHVlKCkge1xuICAgIC8vIFdlIG1hZGUgX2V4cG9ydE5hbWUgbXV0YWJsZSBzbyB0aGlzIHdpbGwgaGF2ZSB0byBiZSBsYXp5LlxuICAgIHJldHVybiBGbi5pbXBvcnRWYWx1ZShMYXp5LnVuY2FjaGVkU3RyaW5nKHtcbiAgICAgIHByb2R1Y2U6IChjdHgpID0+IHtcbiAgICAgICAgaWYgKFN0YWNrLm9mKGN0eC5zY29wZSkgPT09IHRoaXMuc3RhY2spIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCdpbXBvcnRWYWx1ZScgcHJvcGVydHkgb2YgJyR7dGhpcy5ub2RlLnBhdGh9JyBzaG91bGQgb25seSBiZSB1c2VkIGluIGEgZGlmZmVyZW50IFN0YWNrYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9leHBvcnROYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBZGQgYW4gZXhwb3J0TmFtZSB0byB0aGUgQ2ZuT3V0cHV0IGF0ICcke3RoaXMubm9kZS5wYXRofScgaW4gb3JkZXIgdG8gdXNlICdvdXRwdXQuaW1wb3J0VmFsdWUnYCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZXhwb3J0TmFtZTtcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgW3RoaXMubG9naWNhbElkXToge1xuICAgICAgICAgIERlc2NyaXB0aW9uOiB0aGlzLl9kZXNjcmlwdGlvbixcbiAgICAgICAgICBWYWx1ZTogdGhpcy5fdmFsdWUsXG4gICAgICAgICAgRXhwb3J0OiB0aGlzLl9leHBvcnROYW1lICE9IG51bGwgPyB7IE5hbWU6IHRoaXMuX2V4cG9ydE5hbWUgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBDb25kaXRpb246IHRoaXMuX2NvbmRpdGlvbiA/IHRoaXMuX2NvbmRpdGlvbi5sb2dpY2FsSWQgOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlT3V0cHV0KCk6IHN0cmluZ1tdIHtcbiAgICBpZiAodGhpcy5fZXhwb3J0TmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMuX2V4cG9ydE5hbWUpICYmIHRoaXMuX2V4cG9ydE5hbWUubGVuZ3RoID4gMjU1KSB7XG4gICAgICByZXR1cm4gW2BFeHBvcnQgbmFtZSBjYW5ub3QgZXhjZWVkIDI1NSBjaGFyYWN0ZXJzIChnb3QgJHt0aGlzLl9leHBvcnROYW1lLmxlbmd0aH0gY2hhcmFjdGVycylgXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9vcmRlciAqL1xuaW1wb3J0IHsgQ2ZuQ29uZGl0aW9uIH0gZnJvbSAnLi9jZm4tY29uZGl0aW9uJztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi9jZm4tZm4nO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4vbGF6eSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxuIl19