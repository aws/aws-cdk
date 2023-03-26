"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputType = exports.TaskInput = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fields_1 = require("./fields");
/**
 * Type union for task classes that accept multiple types of payload
 */
class TaskInput {
    /**
     *
     * @param type type of task input
     * @param value payload for the corresponding input type.
     * It can be a JSON-encoded object, context, data, etc.
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    /**
     * Use a literal string as task input
     *
     * This might be a JSON-encoded object, or just a text.
     */
    static fromText(text) {
        return new TaskInput(InputType.TEXT, text);
    }
    /**
     * Use an object as task input
     *
     * This object may contain JSON path fields as object values, if desired.
     */
    static fromObject(obj) {
        return new TaskInput(InputType.OBJECT, obj);
    }
    /**
     * Use a part of the execution data or task context as task input
     *
     * Use this when you want to use a subobject or string from
     * the current state machine execution or the current task context
     * as complete payload to a task.
     */
    static fromJsonPathAt(path) {
        return new TaskInput(InputType.TEXT, fields_1.JsonPath.stringAt(path));
    }
    /**
     * Use a part of the execution data as task input
     *
     * Use this when you want to use a subobject or string from
     * the current state machine execution as complete payload
     * to a task.
     *
     * @deprecated Use `fromJsonPathAt`.
     */
    static fromDataAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.TaskInput#fromDataAt", "Use `fromJsonPathAt`.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDataAt);
            }
            throw error;
        }
        return new TaskInput(InputType.TEXT, fields_1.JsonPath.stringAt(path));
    }
    /**
     * Use a part of the task context as task input
     *
     * Use this when you want to use a subobject or string from
     * the current task context as complete payload
     * to a task.
     *
     * @deprecated Use `fromJsonPathAt`.
     */
    static fromContextAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.TaskInput#fromContextAt", "Use `fromJsonPathAt`.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromContextAt);
            }
            throw error;
        }
        return new TaskInput(InputType.TEXT, fields_1.JsonPath.stringAt(path));
    }
}
exports.TaskInput = TaskInput;
_a = JSII_RTTI_SYMBOL_1;
TaskInput[_a] = { fqn: "@aws-cdk/aws-stepfunctions.TaskInput", version: "0.0.0" };
/**
 * The type of task input
 */
var InputType;
(function (InputType) {
    /**
     * Use a literal string
     * This might be a JSON-encoded object, or just text.
     * valid JSON text: standalone, quote-delimited strings; objects; arrays; numbers; Boolean values; and null.
     *
     * example: `literal string`
     * example: {"json": "encoded"}
     */
    InputType[InputType["TEXT"] = 0] = "TEXT";
    /**
     * Use an object which may contain Data and Context fields
     * as object values, if desired.
     *
     * example:
     * {
     *  literal: 'literal',
     *  SomeInput: sfn.JsonPath.stringAt('$.someField')
     * }
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-data.html
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/input-output-contextobject.html
     */
    InputType[InputType["OBJECT"] = 1] = "OBJECT";
})(InputType = exports.InputType || (exports.InputType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBb0M7QUFFcEM7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUF3RHBCOzs7OztPQUtHO0lBQ0gsWUFBb0MsSUFBZSxFQUFrQixLQUFVO1FBQTNDLFNBQUksR0FBSixJQUFJLENBQVc7UUFBa0IsVUFBSyxHQUFMLEtBQUssQ0FBSztLQUFJO0lBN0RuRjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQTJCO1FBQ2xELE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM3QztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBWTtRQUN2QyxPQUFPLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMvRDtJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZOzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7Ozs7Ozs7Ozs7UUFDdEMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDL0Q7O0FBdERILDhCQStEQzs7O0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFNBd0JYO0FBeEJELFdBQVksU0FBUztJQUNuQjs7Ozs7OztPQU9HO0lBQ0gseUNBQUksQ0FBQTtJQUNKOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILDZDQUFNLENBQUE7QUFDUixDQUFDLEVBeEJXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBd0JwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEpzb25QYXRoIH0gZnJvbSAnLi9maWVsZHMnO1xuXG4vKipcbiAqIFR5cGUgdW5pb24gZm9yIHRhc2sgY2xhc3NlcyB0aGF0IGFjY2VwdCBtdWx0aXBsZSB0eXBlcyBvZiBwYXlsb2FkXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXNrSW5wdXQge1xuICAvKipcbiAgICogVXNlIGEgbGl0ZXJhbCBzdHJpbmcgYXMgdGFzayBpbnB1dFxuICAgKlxuICAgKiBUaGlzIG1pZ2h0IGJlIGEgSlNPTi1lbmNvZGVkIG9iamVjdCwgb3IganVzdCBhIHRleHQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21UZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgVGFza0lucHV0KElucHV0VHlwZS5URVhULCB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgYW4gb2JqZWN0IGFzIHRhc2sgaW5wdXRcbiAgICpcbiAgICogVGhpcyBvYmplY3QgbWF5IGNvbnRhaW4gSlNPTiBwYXRoIGZpZWxkcyBhcyBvYmplY3QgdmFsdWVzLCBpZiBkZXNpcmVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT2JqZWN0KG9iajogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICAgIHJldHVybiBuZXcgVGFza0lucHV0KElucHV0VHlwZS5PQkpFQ1QsIG9iaik7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgcGFydCBvZiB0aGUgZXhlY3V0aW9uIGRhdGEgb3IgdGFzayBjb250ZXh0IGFzIHRhc2sgaW5wdXRcbiAgICpcbiAgICogVXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byB1c2UgYSBzdWJvYmplY3Qgb3Igc3RyaW5nIGZyb21cbiAgICogdGhlIGN1cnJlbnQgc3RhdGUgbWFjaGluZSBleGVjdXRpb24gb3IgdGhlIGN1cnJlbnQgdGFzayBjb250ZXh0XG4gICAqIGFzIGNvbXBsZXRlIHBheWxvYWQgdG8gYSB0YXNrLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSnNvblBhdGhBdChwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IFRhc2tJbnB1dChJbnB1dFR5cGUuVEVYVCwgSnNvblBhdGguc3RyaW5nQXQocGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBhIHBhcnQgb2YgdGhlIGV4ZWN1dGlvbiBkYXRhIGFzIHRhc2sgaW5wdXRcbiAgICpcbiAgICogVXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byB1c2UgYSBzdWJvYmplY3Qgb3Igc3RyaW5nIGZyb21cbiAgICogdGhlIGN1cnJlbnQgc3RhdGUgbWFjaGluZSBleGVjdXRpb24gYXMgY29tcGxldGUgcGF5bG9hZFxuICAgKiB0byBhIHRhc2suXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZnJvbUpzb25QYXRoQXRgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRGF0YUF0KHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgVGFza0lucHV0KElucHV0VHlwZS5URVhULCBKc29uUGF0aC5zdHJpbmdBdChwYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgcGFydCBvZiB0aGUgdGFzayBjb250ZXh0IGFzIHRhc2sgaW5wdXRcbiAgICpcbiAgICogVXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byB1c2UgYSBzdWJvYmplY3Qgb3Igc3RyaW5nIGZyb21cbiAgICogdGhlIGN1cnJlbnQgdGFzayBjb250ZXh0IGFzIGNvbXBsZXRlIHBheWxvYWRcbiAgICogdG8gYSB0YXNrLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGZyb21Kc29uUGF0aEF0YC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvbnRleHRBdChwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IFRhc2tJbnB1dChJbnB1dFR5cGUuVEVYVCwgSnNvblBhdGguc3RyaW5nQXQocGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIHR5cGUgb2YgdGFzayBpbnB1dFxuICAgKiBAcGFyYW0gdmFsdWUgcGF5bG9hZCBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgaW5wdXQgdHlwZS5cbiAgICogSXQgY2FuIGJlIGEgSlNPTi1lbmNvZGVkIG9iamVjdCwgY29udGV4dCwgZGF0YSwgZXRjLlxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZTogSW5wdXRUeXBlLCBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueSkge31cbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiB0YXNrIGlucHV0XG4gKi9cbmV4cG9ydCBlbnVtIElucHV0VHlwZSB7XG4gIC8qKlxuICAgKiBVc2UgYSBsaXRlcmFsIHN0cmluZ1xuICAgKiBUaGlzIG1pZ2h0IGJlIGEgSlNPTi1lbmNvZGVkIG9iamVjdCwgb3IganVzdCB0ZXh0LlxuICAgKiB2YWxpZCBKU09OIHRleHQ6IHN0YW5kYWxvbmUsIHF1b3RlLWRlbGltaXRlZCBzdHJpbmdzOyBvYmplY3RzOyBhcnJheXM7IG51bWJlcnM7IEJvb2xlYW4gdmFsdWVzOyBhbmQgbnVsbC5cbiAgICpcbiAgICogZXhhbXBsZTogYGxpdGVyYWwgc3RyaW5nYFxuICAgKiBleGFtcGxlOiB7XCJqc29uXCI6IFwiZW5jb2RlZFwifVxuICAgKi9cbiAgVEVYVCxcbiAgLyoqXG4gICAqIFVzZSBhbiBvYmplY3Qgd2hpY2ggbWF5IGNvbnRhaW4gRGF0YSBhbmQgQ29udGV4dCBmaWVsZHNcbiAgICogYXMgb2JqZWN0IHZhbHVlcywgaWYgZGVzaXJlZC5cbiAgICpcbiAgICogZXhhbXBsZTpcbiAgICoge1xuICAgKiAgbGl0ZXJhbDogJ2xpdGVyYWwnLFxuICAgKiAgU29tZUlucHV0OiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuc29tZUZpZWxkJylcbiAgICogfVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29uY2VwdHMtc3RhdGUtbWFjaGluZS1kYXRhLmh0bWxcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2lucHV0LW91dHB1dC1jb250ZXh0b2JqZWN0Lmh0bWxcbiAgICovXG4gIE9CSkVDVCxcbn1cbiJdfQ==