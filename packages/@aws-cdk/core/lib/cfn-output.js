"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnOutput = void 0;
const cfn_element_1 = require("./cfn-element");
class CfnOutput extends cfn_element_1.CfnElement {
    /**
     * Creates an CfnOutput value for this stack.
     * @param scope The parent construct.
     * @param props CfnOutput properties.
     */
    constructor(scope, id, props) {
        super(scope, id);
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
const cfn_fn_1 = require("./cfn-fn");
const lazy_1 = require("./lazy");
const stack_1 = require("./stack");
const token_1 = require("./token");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLW91dHB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1vdXRwdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0NBQTJDO0FBb0MzQyxNQUFhLFNBQVUsU0FBUSx3QkFBVTtJQU12Qzs7OztPQUlHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ3hGO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQyxnRkFBZ0Y7WUFDaEYsbUNBQW1DO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNsSDtRQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVwQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQVcsV0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQVcsV0FBVyxDQUFDLFdBQStCO1FBQ3BELElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBVyxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFXLEtBQUssQ0FBQyxLQUFVO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQVcsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELElBQVcsU0FBUyxDQUFDLFNBQW1DO1FBQ3RELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsSUFBVyxVQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBVyxVQUFVLENBQUMsVUFBOEI7UUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILElBQVcsV0FBVztRQUNwQiw0REFBNEQ7UUFDNUQsT0FBTyxXQUFFLENBQUMsV0FBVyxDQUFDLFdBQUksQ0FBQyxjQUFjLENBQUM7WUFDeEMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxhQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksNENBQTRDLENBQUMsQ0FBQztpQkFDM0c7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSx3Q0FBd0MsQ0FBQyxDQUFDO2lCQUNuSDtnQkFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDMUIsQ0FBQztTQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1AsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ2hCLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtvQkFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDekUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUNuRTthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTyxjQUFjO1FBQ3BCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUM5RixPQUFPLENBQUMsaURBQWlELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQztTQUNqRztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGO0FBN0lELDhCQTZJQztBQUlELHFDQUE4QjtBQUM5QixpQ0FBOEI7QUFDOUIsbUNBQWdDO0FBQ2hDLG1DQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENmbk91dHB1dFByb3BzIHtcbiAgLyoqXG4gICAqIEEgU3RyaW5nIHR5cGUgdGhhdCBkZXNjcmliZXMgdGhlIG91dHB1dCB2YWx1ZS5cbiAgICogVGhlIGRlc2NyaXB0aW9uIGNhbiBiZSBhIG1heGltdW0gb2YgNCBLIGluIGxlbmd0aC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IHJldHVybmVkIGJ5IHRoZSBhd3MgY2xvdWRmb3JtYXRpb24gZGVzY3JpYmUtc3RhY2tzIGNvbW1hbmQuXG4gICAqIFRoZSB2YWx1ZSBvZiBhbiBvdXRwdXQgY2FuIGluY2x1ZGUgbGl0ZXJhbHMsIHBhcmFtZXRlciByZWZlcmVuY2VzLCBwc2V1ZG8tcGFyYW1ldGVycyxcbiAgICogYSBtYXBwaW5nIHZhbHVlLCBvciBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgdXNlZCB0byBleHBvcnQgdGhlIHZhbHVlIG9mIHRoaXMgb3V0cHV0IGFjcm9zcyBzdGFja3MuXG4gICAqXG4gICAqIFRvIGltcG9ydCB0aGUgdmFsdWUgZnJvbSBhbm90aGVyIHN0YWNrLCB1c2UgYEZuLmltcG9ydFZhbHVlKGV4cG9ydE5hbWUpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgb3V0cHV0IGlzIG5vdCBleHBvcnRlZFxuICAgKi9cbiAgcmVhZG9ubHkgZXhwb3J0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb25kaXRpb24gdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBvdXRwdXQgdmFsdWUuIElmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzXG4gICAqIHRvIGBmYWxzZWAsIHRoaXMgb3V0cHV0IHZhbHVlIHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25kaXRpb24gaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBvdXRwdXQuXG4gICAqL1xuICByZWFkb25seSBjb25kaXRpb24/OiBDZm5Db25kaXRpb247XG59XG5cbmV4cG9ydCBjbGFzcyBDZm5PdXRwdXQgZXh0ZW5kcyBDZm5FbGVtZW50IHtcbiAgcHJpdmF0ZSBfZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaXZhdGUgX2NvbmRpdGlvbj86IENmbkNvbmRpdGlvbjtcbiAgcHJpdmF0ZSBfdmFsdWU/OiBhbnk7XG4gIHByaXZhdGUgX2V4cG9ydE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gQ2ZuT3V0cHV0IHZhbHVlIGZvciB0aGlzIHN0YWNrLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3QuXG4gICAqIEBwYXJhbSBwcm9wcyBDZm5PdXRwdXQgcHJvcGVydGllcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5PdXRwdXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIHZhbHVlIGZvciBDbG91ZEZvcm1hdGlvbiBvdXRwdXQgYXQgcGF0aCBcIiR7dGhpcy5ub2RlLnBhdGh9XCJgKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMudmFsdWUpKSB7XG4gICAgICAvLyBgcHJvcHMudmFsdWVgIGlzIGEgc3RyaW5nLCBidXQgYmVjYXVzZSBjcm9zcy1zdGFjayBleHBvcnRzIGFsbG93IHBhc3NpbmcgYW55LFxuICAgICAgLy8gd2UgbmVlZCB0byBjaGVjayBmb3IgbGlzdHMgaGVyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xvdWRGb3JtYXRpb24gb3V0cHV0IHdhcyBnaXZlbiBhIHN0cmluZyBsaXN0IGluc3RlYWQgb2YgYSBzdHJpbmcgYXQgcGF0aCBcIiR7dGhpcy5ub2RlLnBhdGh9XCJgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMuX3ZhbHVlID0gcHJvcHMudmFsdWU7XG4gICAgdGhpcy5fY29uZGl0aW9uID0gcHJvcHMuY29uZGl0aW9uO1xuICAgIHRoaXMuX2V4cG9ydE5hbWUgPSBwcm9wcy5leHBvcnROYW1lO1xuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZU91dHB1dCgpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgU3RyaW5nIHR5cGUgdGhhdCBkZXNjcmliZXMgdGhlIG91dHB1dCB2YWx1ZS5cbiAgICogVGhlIGRlc2NyaXB0aW9uIGNhbiBiZSBhIG1heGltdW0gb2YgNCBLIGluIGxlbmd0aC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgZGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uO1xuICB9XG5cbiAgcHVibGljIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IHJldHVybmVkIGJ5IHRoZSBhd3MgY2xvdWRmb3JtYXRpb24gZGVzY3JpYmUtc3RhY2tzIGNvbW1hbmQuXG4gICAqIFRoZSB2YWx1ZSBvZiBhbiBvdXRwdXQgY2FuIGluY2x1ZGUgbGl0ZXJhbHMsIHBhcmFtZXRlciByZWZlcmVuY2VzLCBwc2V1ZG8tcGFyYW1ldGVycyxcbiAgICogYSBtYXBwaW5nIHZhbHVlLCBvciBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICAgKi9cbiAgcHVibGljIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29uZGl0aW9uIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgb3V0cHV0IHZhbHVlLiBJZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlc1xuICAgKiB0byBgZmFsc2VgLCB0aGlzIG91dHB1dCB2YWx1ZSB3aWxsIG5vdCBiZSBpbmNsdWRlZCBpbiB0aGUgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uZGl0aW9uIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgb3V0cHV0LlxuICAgKi9cbiAgcHVibGljIGdldCBjb25kaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmRpdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgY29uZGl0aW9uKGNvbmRpdGlvbjogQ2ZuQ29uZGl0aW9uIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHVzZWQgdG8gZXhwb3J0IHRoZSB2YWx1ZSBvZiB0aGlzIG91dHB1dCBhY3Jvc3Mgc3RhY2tzLlxuICAgKlxuICAgKiBUbyB1c2UgdGhlIHZhbHVlIGluIGFub3RoZXIgc3RhY2ssIHBhc3MgdGhlIHZhbHVlIG9mXG4gICAqIGBvdXRwdXQuaW1wb3J0VmFsdWVgIHRvIGl0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBvdXRwdXQgaXMgbm90IGV4cG9ydGVkXG4gICAqL1xuICBwdWJsaWMgZ2V0IGV4cG9ydE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2V4cG9ydE5hbWU7XG4gIH1cblxuICBwdWJsaWMgc2V0IGV4cG9ydE5hbWUoZXhwb3J0TmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fZXhwb3J0TmFtZSA9IGV4cG9ydE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBgRm4uaW1wb3J0VmFsdWVgIGV4cHJlc3Npb24gdG8gaW1wb3J0IHRoaXMgdmFsdWUgaW50byBhbm90aGVyIHN0YWNrXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCB2YWx1ZSBzaG91bGQgbm90IGJlIHVzZWQgaW4gdGhlIHNhbWUgc3RhY2ssIGJ1dCBpbiBhXG4gICAqIGRpZmZlcmVudCBvbmUuIEl0IG11c3QgYmUgZGVwbG95ZWQgdG8gdGhlIHNhbWUgZW52aXJvbm1lbnQsIGFzXG4gICAqIENsb3VkRm9ybWF0aW9uIGV4cG9ydHMgY2FuIG9ubHkgYmUgaW1wb3J0ZWQgaW4gdGhlIHNhbWUgUmVnaW9uIGFuZFxuICAgKiBhY2NvdW50LlxuICAgKlxuICAgKiBUaGUgaXMgbm8gYXV0b21hdGljIHJlZ2lzdHJhdGlvbiBvZiBkZXBlbmRlbmNpZXMgYmV0d2VlbiBzdGFja3Mgd2hlbiB1c2luZ1xuICAgKiB0aGlzIG1lY2hhbmlzbSwgc28geW91IHNob3VsZCBtYWtlIHN1cmUgdG8gZGVwbG95IHRoZW0gaW4gdGhlIHJpZ2h0IG9yZGVyXG4gICAqIHlvdXJzZWxmLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIG1lY2hhbmlzbSB0byBzaGFyZSB2YWx1ZXMgYWNyb3NzIFN0YWNrcyBpbiBkaWZmZXJlbnRcbiAgICogU3RhZ2VzLiBJZiB5b3UgaW50ZW5kIHRvIHNoYXJlIHRoZSB2YWx1ZSB0byBhbm90aGVyIFN0YWNrIGluc2lkZSB0aGUgc2FtZVxuICAgKiBTdGFnZSwgdGhlIGF1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2luZyBtZWNoYW5pc20gaXMgbW9yZSBjb252ZW5pZW50LlxuICAgKi9cbiAgcHVibGljIGdldCBpbXBvcnRWYWx1ZSgpIHtcbiAgICAvLyBXZSBtYWRlIF9leHBvcnROYW1lIG11dGFibGUgc28gdGhpcyB3aWxsIGhhdmUgdG8gYmUgbGF6eS5cbiAgICByZXR1cm4gRm4uaW1wb3J0VmFsdWUoTGF6eS51bmNhY2hlZFN0cmluZyh7XG4gICAgICBwcm9kdWNlOiAoY3R4KSA9PiB7XG4gICAgICAgIGlmIChTdGFjay5vZihjdHguc2NvcGUpID09PSB0aGlzLnN0YWNrKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnaW1wb3J0VmFsdWUnIHByb3BlcnR5IG9mICcke3RoaXMubm9kZS5wYXRofScgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiBhIGRpZmZlcmVudCBTdGFja2ApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fZXhwb3J0TmFtZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQWRkIGFuIGV4cG9ydE5hbWUgdG8gdGhlIENmbk91dHB1dCBhdCAnJHt0aGlzLm5vZGUucGF0aH0nIGluIG9yZGVyIHRvIHVzZSAnb3V0cHV0LmltcG9ydFZhbHVlJ2ApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4cG9ydE5hbWU7XG4gICAgICB9LFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfdG9DbG91ZEZvcm1hdGlvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIFt0aGlzLmxvZ2ljYWxJZF06IHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogdGhpcy5fZGVzY3JpcHRpb24sXG4gICAgICAgICAgVmFsdWU6IHRoaXMuX3ZhbHVlLFxuICAgICAgICAgIEV4cG9ydDogdGhpcy5fZXhwb3J0TmFtZSAhPSBudWxsID8geyBOYW1lOiB0aGlzLl9leHBvcnROYW1lIH0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgQ29uZGl0aW9uOiB0aGlzLl9jb25kaXRpb24gPyB0aGlzLl9jb25kaXRpb24ubG9naWNhbElkIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZU91dHB1dCgpOiBzdHJpbmdbXSB7XG4gICAgaWYgKHRoaXMuX2V4cG9ydE5hbWUgJiYgIVRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLl9leHBvcnROYW1lKSAmJiB0aGlzLl9leHBvcnROYW1lLmxlbmd0aCA+IDI1NSkge1xuICAgICAgcmV0dXJuIFtgRXhwb3J0IG5hbWUgY2Fubm90IGV4Y2VlZCAyNTUgY2hhcmFjdGVycyAoZ290ICR7dGhpcy5fZXhwb3J0TmFtZS5sZW5ndGh9IGNoYXJhY3RlcnMpYF07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvb3JkZXIgKi9cbmltcG9ydCB7IENmbkNvbmRpdGlvbiB9IGZyb20gJy4vY2ZuLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4vY2ZuLWZuJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbiJdfQ==