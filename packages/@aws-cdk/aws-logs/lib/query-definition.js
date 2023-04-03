"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryDefinition = exports.QueryString = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const _1 = require(".");
/**
 * Define a QueryString
 */
class QueryString {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_QueryStringProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, QueryString);
            }
            throw error;
        }
        this.fields = props.fields;
        this.stats = props.stats;
        this.sort = props.sort;
        this.limit = props.limit;
        this.display = props.display;
        // Determine parsing by either the parseStatements or parse properties, or default to empty array
        if (props.parseStatements) {
            this.parse = props.parseStatements;
        }
        else if (props.parse) {
            this.parse = [props.parse];
        }
        else {
            this.parse = [];
        }
        // Determine filtering by either the filterStatements or filter properties, or default to empty array
        if (props.filterStatements) {
            this.filter = props.filterStatements;
        }
        else if (props.filter) {
            this.filter = [props.filter];
        }
        else {
            this.filter = [];
        }
    }
    /**
    * String representation of this QueryString.
    */
    toString() {
        return [
            this.buildQueryLine('fields', this.fields?.join(', ')),
            ...this.buildQueryLines('parse', this.parse),
            ...this.buildQueryLines('filter', this.filter),
            this.buildQueryLine('stats', this.stats),
            this.buildQueryLine('sort', this.sort),
            this.buildQueryLine('limit', this.limit?.toString()),
            this.buildQueryLine('display', this.display),
        ].filter((queryLine) => queryLine !== undefined && queryLine.length > 0).join('\n| ');
    }
    /**
     * Build an array of query lines given a command and statement(s).
     *
     * @param command a query command
     * @param statements one or more query statements for the specified command, or undefined
     * @returns an array of the query string lines generated from the provided command and statements
     */
    buildQueryLines(command, statements) {
        if (statements === undefined) {
            return [];
        }
        return statements.map((statement) => this.buildQueryLine(command, statement));
    }
    /**
     * Build a single query line given a command and statement.
     *
     * @param command a query command
     * @param statement a single query statement
     * @returns a single query string line generated from the provided command and statement
     */
    buildQueryLine(command, statement) {
        return statement ? `${command} ${statement}` : '';
    }
}
_a = JSII_RTTI_SYMBOL_1;
QueryString[_a] = { fqn: "@aws-cdk/aws-logs.QueryString", version: "0.0.0" };
exports.QueryString = QueryString;
/**
 * Define a query definition for CloudWatch Logs Insights
 */
class QueryDefinition extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.queryDefinitionName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_QueryDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, QueryDefinition);
            }
            throw error;
        }
        const queryDefinition = new _1.CfnQueryDefinition(this, 'Resource', {
            name: props.queryDefinitionName,
            queryString: props.queryString.toString(),
            logGroupNames: typeof props.logGroups === 'undefined' ? [] : props.logGroups.flatMap(logGroup => logGroup.logGroupName),
        });
        this.queryDefinitionId = queryDefinition.attrQueryDefinitionId;
    }
}
_b = JSII_RTTI_SYMBOL_1;
QueryDefinition[_b] = { fqn: "@aws-cdk/aws-logs.QueryDefinition", version: "0.0.0" };
exports.QueryDefinition = QueryDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXJ5LWRlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXlDO0FBRXpDLHdCQUF1QztBQWtGdkM7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFTdEIsWUFBWSxRQUEwQixFQUFFOzs7Ozs7K0NBVDdCLFdBQVc7Ozs7UUFVcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUU3QixpR0FBaUc7UUFDakcsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNwQzthQUFNLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtRQUVELHFHQUFxRztRQUNyRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztTQUN0QzthQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNsQjtLQUNGO0lBRUQ7O01BRUU7SUFDSyxRQUFRO1FBQ2IsT0FBTztZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM1QyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUM7WUFDcEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QyxDQUFDLE1BQU0sQ0FDTixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FDL0QsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEI7SUFFRDs7Ozs7O09BTUc7SUFDSyxlQUFlLENBQUMsT0FBZSxFQUFFLFVBQXFCO1FBQzVELElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM1QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUNuQixDQUFDLFNBQWlCLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUN2RSxDQUFDO0tBQ0g7SUFFRDs7Ozs7O09BTUc7SUFDSyxjQUFjLENBQUMsT0FBZSxFQUFFLFNBQWtCO1FBQ3hELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ25EOzs7O0FBOUVVLGtDQUFXO0FBdUd4Qjs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxlQUFRO0lBUTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtTQUN4QyxDQUFDLENBQUM7Ozs7OzsrQ0FYTSxlQUFlOzs7O1FBYXhCLE1BQU0sZUFBZSxHQUFHLElBQUkscUJBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvRCxJQUFJLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtZQUMvQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDekMsYUFBYSxFQUFFLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1NBQ3hILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUMscUJBQXFCLENBQUM7S0FDaEU7Ozs7QUFwQlUsMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5RdWVyeURlZmluaXRpb24gfSBmcm9tICcuJztcbmltcG9ydCB7IElMb2dHcm91cCB9IGZyb20gJy4vbG9nLWdyb3VwJztcblxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgUXVlcnlTdHJpbmdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBRdWVyeVN0cmluZ1Byb3BzIHtcbiAgLyoqXG4gICogUmV0cmlldmVzIHRoZSBzcGVjaWZpZWQgZmllbGRzIGZyb20gbG9nIGV2ZW50cyBmb3IgZGlzcGxheS5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gZmllbGRzIGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IGZpZWxkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAqIEEgc2luZ2xlIHN0YXRlbWVudCBmb3IgcGFyc2luZyBkYXRhIGZyb20gYSBsb2cgZmllbGQgYW5kIGNyZWF0aW5nIGVwaGVtZXJhbCBmaWVsZHMgdGhhdCBjYW5cbiAgKiBiZSBwcm9jZXNzZWQgZnVydGhlciBpbiB0aGUgcXVlcnkuXG4gICpcbiAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhcnNlU3RhdGVtZW50c2AgaW5zdGVhZFxuICAqIEBkZWZhdWx0IC0gbm8gcGFyc2UgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgcGFyc2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICogQW4gYXJyYXkgb2Ygb25lIG9yIG1vcmUgc3RhdGVtZW50cyBmb3IgcGFyc2luZyBkYXRhIGZyb20gYSBsb2cgZmllbGQgYW5kIGNyZWF0aW5nIGVwaGVtZXJhbFxuICAqIGZpZWxkcyB0aGF0IGNhbiBiZSBwcm9jZXNzZWQgZnVydGhlciBpbiB0aGUgcXVlcnkuIEVhY2ggcHJvdmlkZWQgc3RhdGVtZW50IGdlbmVyYXRlcyBhIHNlcGFyYXRlXG4gICogcGFyc2UgbGluZSBpbiB0aGUgcXVlcnkgc3RyaW5nLlxuICAqXG4gICogTm90ZTogSWYgcHJvdmlkZWQsIHRoaXMgcHJvcGVydHkgb3ZlcnJpZGVzIGFueSB2YWx1ZSBwcm92aWRlZCBmb3IgdGhlIGBwYXJzZWAgcHJvcGVydHkuXG4gICpcbiAgKiBAZGVmYXVsdCAtIG5vIHBhcnNlIGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IHBhcnNlU3RhdGVtZW50cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAqIEEgc2luZ2xlIHN0YXRlbWVudCBmb3IgZmlsdGVyaW5nIHRoZSByZXN1bHRzIG9mIGEgcXVlcnkgYmFzZWQgb24gYSBib29sZWFuIGV4cHJlc3Npb24uXG4gICpcbiAgKiBAZGVwcmVjYXRlZCBVc2UgYGZpbHRlclN0YXRlbWVudHNgIGluc3RlYWRcbiAgKiBAZGVmYXVsdCAtIG5vIGZpbHRlciBpbiBRdWVyeVN0cmluZ1xuICAqL1xuICByZWFkb25seSBmaWx0ZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICogQW4gYXJyYXkgb2Ygb25lIG9yIG1vcmUgc3RhdGVtZW50cyBmb3IgZmlsdGVyaW5nIHRoZSByZXN1bHRzIG9mIGEgcXVlcnkgYmFzZWQgb24gYSBib29sZWFuXG4gICogZXhwcmVzc2lvbi4gRWFjaCBwcm92aWRlZCBzdGF0ZW1lbnQgZ2VuZXJhdGVzIGEgc2VwYXJhdGUgZmlsdGVyIGxpbmUgaW4gdGhlIHF1ZXJ5IHN0cmluZy5cbiAgKlxuICAqIE5vdGU6IElmIHByb3ZpZGVkLCB0aGlzIHByb3BlcnR5IG92ZXJyaWRlcyBhbnkgdmFsdWUgcHJvdmlkZWQgZm9yIHRoZSBgZmlsdGVyYCBwcm9wZXJ0eS5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gZmlsdGVyIGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IGZpbHRlclN0YXRlbWVudHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgKiBVc2VzIGxvZyBmaWVsZCB2YWx1ZXMgdG8gY2FsY3VsYXRlIGFnZ3JlZ2F0ZSBzdGF0aXN0aWNzLlxuICAqXG4gICogQGRlZmF1bHQgLSBubyBzdGF0cyBpbiBRdWVyeVN0cmluZ1xuICAqL1xuICByZWFkb25seSBzdGF0cz86IHN0cmluZztcblxuICAvKipcbiAgKiBTb3J0cyB0aGUgcmV0cmlldmVkIGxvZyBldmVudHMuXG4gICpcbiAgKiBAZGVmYXVsdCAtIG5vIHNvcnQgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgc29ydD86IHN0cmluZztcblxuICAvKipcbiAgKiBTcGVjaWZpZXMgdGhlIG51bWJlciBvZiBsb2cgZXZlbnRzIHJldHVybmVkIGJ5IHRoZSBxdWVyeS5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gbGltaXQgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgbGltaXQ/OiBOdW1iZXI7XG5cbiAgLyoqXG4gICogU3BlY2lmaWVzIHdoaWNoIGZpZWxkcyB0byBkaXNwbGF5IGluIHRoZSBxdWVyeSByZXN1bHRzLlxuICAqXG4gICogQGRlZmF1bHQgLSBubyBkaXNwbGF5IGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IGRpc3BsYXk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgUXVlcnlTdHJpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5U3RyaW5nIHtcbiAgcHJpdmF0ZSByZWFkb25seSBmaWVsZHM/OiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBwYXJzZTogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZmlsdGVyOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGF0cz86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBzb3J0Pzogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpbWl0PzogTnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IGRpc3BsYXk/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFF1ZXJ5U3RyaW5nUHJvcHMgPSB7fSkge1xuICAgIHRoaXMuZmllbGRzID0gcHJvcHMuZmllbGRzO1xuICAgIHRoaXMuc3RhdHMgPSBwcm9wcy5zdGF0cztcbiAgICB0aGlzLnNvcnQgPSBwcm9wcy5zb3J0O1xuICAgIHRoaXMubGltaXQgPSBwcm9wcy5saW1pdDtcbiAgICB0aGlzLmRpc3BsYXkgPSBwcm9wcy5kaXNwbGF5O1xuXG4gICAgLy8gRGV0ZXJtaW5lIHBhcnNpbmcgYnkgZWl0aGVyIHRoZSBwYXJzZVN0YXRlbWVudHMgb3IgcGFyc2UgcHJvcGVydGllcywgb3IgZGVmYXVsdCB0byBlbXB0eSBhcnJheVxuICAgIGlmIChwcm9wcy5wYXJzZVN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMucGFyc2UgPSBwcm9wcy5wYXJzZVN0YXRlbWVudHM7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5wYXJzZSkge1xuICAgICAgdGhpcy5wYXJzZSA9IFtwcm9wcy5wYXJzZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFyc2UgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgZmlsdGVyaW5nIGJ5IGVpdGhlciB0aGUgZmlsdGVyU3RhdGVtZW50cyBvciBmaWx0ZXIgcHJvcGVydGllcywgb3IgZGVmYXVsdCB0byBlbXB0eSBhcnJheVxuICAgIGlmIChwcm9wcy5maWx0ZXJTdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLmZpbHRlciA9IHByb3BzLmZpbHRlclN0YXRlbWVudHM7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5maWx0ZXIpIHtcbiAgICAgIHRoaXMuZmlsdGVyID0gW3Byb3BzLmZpbHRlcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsdGVyID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgUXVlcnlTdHJpbmcuXG4gICovXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLmJ1aWxkUXVlcnlMaW5lKCdmaWVsZHMnLCB0aGlzLmZpZWxkcz8uam9pbignLCAnKSksXG4gICAgICAuLi50aGlzLmJ1aWxkUXVlcnlMaW5lcygncGFyc2UnLCB0aGlzLnBhcnNlKSxcbiAgICAgIC4uLnRoaXMuYnVpbGRRdWVyeUxpbmVzKCdmaWx0ZXInLCB0aGlzLmZpbHRlciksXG4gICAgICB0aGlzLmJ1aWxkUXVlcnlMaW5lKCdzdGF0cycsIHRoaXMuc3RhdHMpLFxuICAgICAgdGhpcy5idWlsZFF1ZXJ5TGluZSgnc29ydCcsIHRoaXMuc29ydCksXG4gICAgICB0aGlzLmJ1aWxkUXVlcnlMaW5lKCdsaW1pdCcsIHRoaXMubGltaXQ/LnRvU3RyaW5nKCkpLFxuICAgICAgdGhpcy5idWlsZFF1ZXJ5TGluZSgnZGlzcGxheScsIHRoaXMuZGlzcGxheSksXG4gICAgXS5maWx0ZXIoXG4gICAgICAocXVlcnlMaW5lKSA9PiBxdWVyeUxpbmUgIT09IHVuZGVmaW5lZCAmJiBxdWVyeUxpbmUubGVuZ3RoID4gMCxcbiAgICApLmpvaW4oJ1xcbnwgJyk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgYW4gYXJyYXkgb2YgcXVlcnkgbGluZXMgZ2l2ZW4gYSBjb21tYW5kIGFuZCBzdGF0ZW1lbnQocykuXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIGEgcXVlcnkgY29tbWFuZFxuICAgKiBAcGFyYW0gc3RhdGVtZW50cyBvbmUgb3IgbW9yZSBxdWVyeSBzdGF0ZW1lbnRzIGZvciB0aGUgc3BlY2lmaWVkIGNvbW1hbmQsIG9yIHVuZGVmaW5lZFxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcXVlcnkgc3RyaW5nIGxpbmVzIGdlbmVyYXRlZCBmcm9tIHRoZSBwcm92aWRlZCBjb21tYW5kIGFuZCBzdGF0ZW1lbnRzXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkUXVlcnlMaW5lcyhjb21tYW5kOiBzdHJpbmcsIHN0YXRlbWVudHM/OiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgICBpZiAoc3RhdGVtZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlbWVudHMubWFwKFxuICAgICAgKHN0YXRlbWVudDogc3RyaW5nKTogc3RyaW5nID0+IHRoaXMuYnVpbGRRdWVyeUxpbmUoY29tbWFuZCwgc3RhdGVtZW50KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIGEgc2luZ2xlIHF1ZXJ5IGxpbmUgZ2l2ZW4gYSBjb21tYW5kIGFuZCBzdGF0ZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIGEgcXVlcnkgY29tbWFuZFxuICAgKiBAcGFyYW0gc3RhdGVtZW50IGEgc2luZ2xlIHF1ZXJ5IHN0YXRlbWVudFxuICAgKiBAcmV0dXJucyBhIHNpbmdsZSBxdWVyeSBzdHJpbmcgbGluZSBnZW5lcmF0ZWQgZnJvbSB0aGUgcHJvdmlkZWQgY29tbWFuZCBhbmQgc3RhdGVtZW50XG4gICAqL1xuICBwcml2YXRlIGJ1aWxkUXVlcnlMaW5lKGNvbW1hbmQ6IHN0cmluZywgc3RhdGVtZW50Pzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RhdGVtZW50ID8gYCR7Y29tbWFuZH0gJHtzdGF0ZW1lbnR9YCA6ICcnO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBRdWVyeURlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBRdWVyeURlZmluaXRpb25Qcm9wcyB7XG4gIC8qKlxuICAqIE5hbWUgb2YgdGhlIHF1ZXJ5IGRlZmluaXRpb24uXG4gICovXG4gIHJlYWRvbmx5IHF1ZXJ5RGVmaW5pdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHF1ZXJ5IHN0cmluZyB0byB1c2UgZm9yIHRoaXMgcXVlcnkgZGVmaW5pdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5U3RyaW5nOiBRdWVyeVN0cmluZztcblxuICAvKipcbiAgKiBTcGVjaWZ5IGNlcnRhaW4gbG9nIGdyb3VwcyBmb3IgdGhlIHF1ZXJ5IGRlZmluaXRpb24uXG4gICpcbiAgKiBAZGVmYXVsdCAtIG5vIHNwZWNpZmllZCBsb2cgZ3JvdXBzXG4gICovXG4gIHJlYWRvbmx5IGxvZ0dyb3Vwcz86IElMb2dHcm91cFtdO1xufVxuXG4vKipcbiAqIERlZmluZSBhIHF1ZXJ5IGRlZmluaXRpb24gZm9yIENsb3VkV2F0Y2ggTG9ncyBJbnNpZ2h0c1xuICovXG5leHBvcnQgY2xhc3MgUXVlcnlEZWZpbml0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBxdWVyeSBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcXVlcnlEZWZpbml0aW9uSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUXVlcnlEZWZpbml0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucXVlcnlEZWZpbml0aW9uTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHF1ZXJ5RGVmaW5pdGlvbiA9IG5ldyBDZm5RdWVyeURlZmluaXRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogcHJvcHMucXVlcnlEZWZpbml0aW9uTmFtZSxcbiAgICAgIHF1ZXJ5U3RyaW5nOiBwcm9wcy5xdWVyeVN0cmluZy50b1N0cmluZygpLFxuICAgICAgbG9nR3JvdXBOYW1lczogdHlwZW9mIHByb3BzLmxvZ0dyb3VwcyA9PT0gJ3VuZGVmaW5lZCcgPyBbXSA6IHByb3BzLmxvZ0dyb3Vwcy5mbGF0TWFwKGxvZ0dyb3VwID0+IGxvZ0dyb3VwLmxvZ0dyb3VwTmFtZSksXG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJ5RGVmaW5pdGlvbklkID0gcXVlcnlEZWZpbml0aW9uLmF0dHJRdWVyeURlZmluaXRpb25JZDtcbiAgfVxufVxuIl19