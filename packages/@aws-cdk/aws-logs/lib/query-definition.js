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
exports.QueryString = QueryString;
_a = JSII_RTTI_SYMBOL_1;
QueryString[_a] = { fqn: "@aws-cdk/aws-logs.QueryString", version: "0.0.0" };
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
exports.QueryDefinition = QueryDefinition;
_b = JSII_RTTI_SYMBOL_1;
QueryDefinition[_b] = { fqn: "@aws-cdk/aws-logs.QueryDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXJ5LWRlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXlDO0FBRXpDLHdCQUF1QztBQWtGdkM7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFTdEIsWUFBWSxRQUEwQixFQUFFOzs7Ozs7K0NBVDdCLFdBQVc7Ozs7UUFVcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUU3QixpR0FBaUc7UUFDakcsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNwQzthQUFNLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtRQUVELHFHQUFxRztRQUNyRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztTQUN0QzthQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNsQjtLQUNGO0lBRUQ7O01BRUU7SUFDSyxRQUFRO1FBQ2IsT0FBTztZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM1QyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUM7WUFDcEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QyxDQUFDLE1BQU0sQ0FDTixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FDL0QsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEI7SUFFRDs7Ozs7O09BTUc7SUFDSyxlQUFlLENBQUMsT0FBZSxFQUFFLFVBQXFCO1FBQzVELElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM1QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUNuQixDQUFDLFNBQWlCLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUN2RSxDQUFDO0tBQ0g7SUFFRDs7Ozs7O09BTUc7SUFDSyxjQUFjLENBQUMsT0FBZSxFQUFFLFNBQWtCO1FBQ3hELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ25EOztBQTlFSCxrQ0ErRUM7OztBQXdCRDs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxlQUFRO0lBUTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtTQUN4QyxDQUFDLENBQUM7Ozs7OzsrQ0FYTSxlQUFlOzs7O1FBYXhCLE1BQU0sZUFBZSxHQUFHLElBQUkscUJBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvRCxJQUFJLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtZQUMvQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDekMsYUFBYSxFQUFFLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1NBQ3hILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUMscUJBQXFCLENBQUM7S0FDaEU7O0FBcEJILDBDQXFCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblF1ZXJ5RGVmaW5pdGlvbiB9IGZyb20gJy4nO1xuaW1wb3J0IHsgSUxvZ0dyb3VwIH0gZnJvbSAnLi9sb2ctZ3JvdXAnO1xuXG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBRdWVyeVN0cmluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5U3RyaW5nUHJvcHMge1xuICAvKipcbiAgKiBSZXRyaWV2ZXMgdGhlIHNwZWNpZmllZCBmaWVsZHMgZnJvbSBsb2cgZXZlbnRzIGZvciBkaXNwbGF5LlxuICAqXG4gICogQGRlZmF1bHQgLSBubyBmaWVsZHMgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgZmllbGRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICogQSBzaW5nbGUgc3RhdGVtZW50IGZvciBwYXJzaW5nIGRhdGEgZnJvbSBhIGxvZyBmaWVsZCBhbmQgY3JlYXRpbmcgZXBoZW1lcmFsIGZpZWxkcyB0aGF0IGNhblxuICAqIGJlIHByb2Nlc3NlZCBmdXJ0aGVyIGluIHRoZSBxdWVyeS5cbiAgKlxuICAqIEBkZXByZWNhdGVkIFVzZSBgcGFyc2VTdGF0ZW1lbnRzYCBpbnN0ZWFkXG4gICogQGRlZmF1bHQgLSBubyBwYXJzZSBpbiBRdWVyeVN0cmluZ1xuICAqL1xuICByZWFkb25seSBwYXJzZT86IHN0cmluZztcblxuICAvKipcbiAgKiBBbiBhcnJheSBvZiBvbmUgb3IgbW9yZSBzdGF0ZW1lbnRzIGZvciBwYXJzaW5nIGRhdGEgZnJvbSBhIGxvZyBmaWVsZCBhbmQgY3JlYXRpbmcgZXBoZW1lcmFsXG4gICogZmllbGRzIHRoYXQgY2FuIGJlIHByb2Nlc3NlZCBmdXJ0aGVyIGluIHRoZSBxdWVyeS4gRWFjaCBwcm92aWRlZCBzdGF0ZW1lbnQgZ2VuZXJhdGVzIGEgc2VwYXJhdGVcbiAgKiBwYXJzZSBsaW5lIGluIHRoZSBxdWVyeSBzdHJpbmcuXG4gICpcbiAgKiBOb3RlOiBJZiBwcm92aWRlZCwgdGhpcyBwcm9wZXJ0eSBvdmVycmlkZXMgYW55IHZhbHVlIHByb3ZpZGVkIGZvciB0aGUgYHBhcnNlYCBwcm9wZXJ0eS5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gcGFyc2UgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgcGFyc2VTdGF0ZW1lbnRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICogQSBzaW5nbGUgc3RhdGVtZW50IGZvciBmaWx0ZXJpbmcgdGhlIHJlc3VsdHMgb2YgYSBxdWVyeSBiYXNlZCBvbiBhIGJvb2xlYW4gZXhwcmVzc2lvbi5cbiAgKlxuICAqIEBkZXByZWNhdGVkIFVzZSBgZmlsdGVyU3RhdGVtZW50c2AgaW5zdGVhZFxuICAqIEBkZWZhdWx0IC0gbm8gZmlsdGVyIGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IGZpbHRlcj86IHN0cmluZztcblxuICAvKipcbiAgKiBBbiBhcnJheSBvZiBvbmUgb3IgbW9yZSBzdGF0ZW1lbnRzIGZvciBmaWx0ZXJpbmcgdGhlIHJlc3VsdHMgb2YgYSBxdWVyeSBiYXNlZCBvbiBhIGJvb2xlYW5cbiAgKiBleHByZXNzaW9uLiBFYWNoIHByb3ZpZGVkIHN0YXRlbWVudCBnZW5lcmF0ZXMgYSBzZXBhcmF0ZSBmaWx0ZXIgbGluZSBpbiB0aGUgcXVlcnkgc3RyaW5nLlxuICAqXG4gICogTm90ZTogSWYgcHJvdmlkZWQsIHRoaXMgcHJvcGVydHkgb3ZlcnJpZGVzIGFueSB2YWx1ZSBwcm92aWRlZCBmb3IgdGhlIGBmaWx0ZXJgIHByb3BlcnR5LlxuICAqXG4gICogQGRlZmF1bHQgLSBubyBmaWx0ZXIgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgZmlsdGVyU3RhdGVtZW50cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAqIFVzZXMgbG9nIGZpZWxkIHZhbHVlcyB0byBjYWxjdWxhdGUgYWdncmVnYXRlIHN0YXRpc3RpY3MuXG4gICpcbiAgKiBAZGVmYXVsdCAtIG5vIHN0YXRzIGluIFF1ZXJ5U3RyaW5nXG4gICovXG4gIHJlYWRvbmx5IHN0YXRzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAqIFNvcnRzIHRoZSByZXRyaWV2ZWQgbG9nIGV2ZW50cy5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gc29ydCBpbiBRdWVyeVN0cmluZ1xuICAqL1xuICByZWFkb25seSBzb3J0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAqIFNwZWNpZmllcyB0aGUgbnVtYmVyIG9mIGxvZyBldmVudHMgcmV0dXJuZWQgYnkgdGhlIHF1ZXJ5LlxuICAqXG4gICogQGRlZmF1bHQgLSBubyBsaW1pdCBpbiBRdWVyeVN0cmluZ1xuICAqL1xuICByZWFkb25seSBsaW1pdD86IE51bWJlcjtcblxuICAvKipcbiAgKiBTcGVjaWZpZXMgd2hpY2ggZmllbGRzIHRvIGRpc3BsYXkgaW4gdGhlIHF1ZXJ5IHJlc3VsdHMuXG4gICpcbiAgKiBAZGVmYXVsdCAtIG5vIGRpc3BsYXkgaW4gUXVlcnlTdHJpbmdcbiAgKi9cbiAgcmVhZG9ubHkgZGlzcGxheT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBRdWVyeVN0cmluZ1xuICovXG5leHBvcnQgY2xhc3MgUXVlcnlTdHJpbmcge1xuICBwcml2YXRlIHJlYWRvbmx5IGZpZWxkcz86IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IHBhcnNlOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBmaWx0ZXI6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXRzPzogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHNvcnQ/OiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGltaXQ/OiBOdW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlzcGxheT86IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUXVlcnlTdHJpbmdQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5maWVsZHMgPSBwcm9wcy5maWVsZHM7XG4gICAgdGhpcy5zdGF0cyA9IHByb3BzLnN0YXRzO1xuICAgIHRoaXMuc29ydCA9IHByb3BzLnNvcnQ7XG4gICAgdGhpcy5saW1pdCA9IHByb3BzLmxpbWl0O1xuICAgIHRoaXMuZGlzcGxheSA9IHByb3BzLmRpc3BsYXk7XG5cbiAgICAvLyBEZXRlcm1pbmUgcGFyc2luZyBieSBlaXRoZXIgdGhlIHBhcnNlU3RhdGVtZW50cyBvciBwYXJzZSBwcm9wZXJ0aWVzLCBvciBkZWZhdWx0IHRvIGVtcHR5IGFycmF5XG4gICAgaWYgKHByb3BzLnBhcnNlU3RhdGVtZW50cykge1xuICAgICAgdGhpcy5wYXJzZSA9IHByb3BzLnBhcnNlU3RhdGVtZW50cztcbiAgICB9IGVsc2UgaWYgKHByb3BzLnBhcnNlKSB7XG4gICAgICB0aGlzLnBhcnNlID0gW3Byb3BzLnBhcnNlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJzZSA9IFtdO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBmaWx0ZXJpbmcgYnkgZWl0aGVyIHRoZSBmaWx0ZXJTdGF0ZW1lbnRzIG9yIGZpbHRlciBwcm9wZXJ0aWVzLCBvciBkZWZhdWx0IHRvIGVtcHR5IGFycmF5XG4gICAgaWYgKHByb3BzLmZpbHRlclN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuZmlsdGVyID0gcHJvcHMuZmlsdGVyU3RhdGVtZW50cztcbiAgICB9IGVsc2UgaWYgKHByb3BzLmZpbHRlcikge1xuICAgICAgdGhpcy5maWx0ZXIgPSBbcHJvcHMuZmlsdGVyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXIgPSBbXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBRdWVyeVN0cmluZy5cbiAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMuYnVpbGRRdWVyeUxpbmUoJ2ZpZWxkcycsIHRoaXMuZmllbGRzPy5qb2luKCcsICcpKSxcbiAgICAgIC4uLnRoaXMuYnVpbGRRdWVyeUxpbmVzKCdwYXJzZScsIHRoaXMucGFyc2UpLFxuICAgICAgLi4udGhpcy5idWlsZFF1ZXJ5TGluZXMoJ2ZpbHRlcicsIHRoaXMuZmlsdGVyKSxcbiAgICAgIHRoaXMuYnVpbGRRdWVyeUxpbmUoJ3N0YXRzJywgdGhpcy5zdGF0cyksXG4gICAgICB0aGlzLmJ1aWxkUXVlcnlMaW5lKCdzb3J0JywgdGhpcy5zb3J0KSxcbiAgICAgIHRoaXMuYnVpbGRRdWVyeUxpbmUoJ2xpbWl0JywgdGhpcy5saW1pdD8udG9TdHJpbmcoKSksXG4gICAgICB0aGlzLmJ1aWxkUXVlcnlMaW5lKCdkaXNwbGF5JywgdGhpcy5kaXNwbGF5KSxcbiAgICBdLmZpbHRlcihcbiAgICAgIChxdWVyeUxpbmUpID0+IHF1ZXJ5TGluZSAhPT0gdW5kZWZpbmVkICYmIHF1ZXJ5TGluZS5sZW5ndGggPiAwLFxuICAgICkuam9pbignXFxufCAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZCBhbiBhcnJheSBvZiBxdWVyeSBsaW5lcyBnaXZlbiBhIGNvbW1hbmQgYW5kIHN0YXRlbWVudChzKS5cbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgYSBxdWVyeSBjb21tYW5kXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnRzIG9uZSBvciBtb3JlIHF1ZXJ5IHN0YXRlbWVudHMgZm9yIHRoZSBzcGVjaWZpZWQgY29tbWFuZCwgb3IgdW5kZWZpbmVkXG4gICAqIEByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBxdWVyeSBzdHJpbmcgbGluZXMgZ2VuZXJhdGVkIGZyb20gdGhlIHByb3ZpZGVkIGNvbW1hbmQgYW5kIHN0YXRlbWVudHNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRRdWVyeUxpbmVzKGNvbW1hbmQ6IHN0cmluZywgc3RhdGVtZW50cz86IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgIGlmIChzdGF0ZW1lbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cy5tYXAoXG4gICAgICAoc3RhdGVtZW50OiBzdHJpbmcpOiBzdHJpbmcgPT4gdGhpcy5idWlsZFF1ZXJ5TGluZShjb21tYW5kLCBzdGF0ZW1lbnQpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgYSBzaW5nbGUgcXVlcnkgbGluZSBnaXZlbiBhIGNvbW1hbmQgYW5kIHN0YXRlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgYSBxdWVyeSBjb21tYW5kXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnQgYSBzaW5nbGUgcXVlcnkgc3RhdGVtZW50XG4gICAqIEByZXR1cm5zIGEgc2luZ2xlIHF1ZXJ5IHN0cmluZyBsaW5lIGdlbmVyYXRlZCBmcm9tIHRoZSBwcm92aWRlZCBjb21tYW5kIGFuZCBzdGF0ZW1lbnRcbiAgICovXG4gIHByaXZhdGUgYnVpbGRRdWVyeUxpbmUoY29tbWFuZDogc3RyaW5nLCBzdGF0ZW1lbnQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdGF0ZW1lbnQgPyBgJHtjb21tYW5kfSAke3N0YXRlbWVudH1gIDogJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFF1ZXJ5RGVmaW5pdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5RGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICogTmFtZSBvZiB0aGUgcXVlcnkgZGVmaW5pdGlvbi5cbiAgKi9cbiAgcmVhZG9ubHkgcXVlcnlEZWZpbml0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcXVlcnkgc3RyaW5nIHRvIHVzZSBmb3IgdGhpcyBxdWVyeSBkZWZpbml0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgcXVlcnlTdHJpbmc6IFF1ZXJ5U3RyaW5nO1xuXG4gIC8qKlxuICAqIFNwZWNpZnkgY2VydGFpbiBsb2cgZ3JvdXBzIGZvciB0aGUgcXVlcnkgZGVmaW5pdGlvbi5cbiAgKlxuICAqIEBkZWZhdWx0IC0gbm8gc3BlY2lmaWVkIGxvZyBncm91cHNcbiAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXBzPzogSUxvZ0dyb3VwW107XG59XG5cbi8qKlxuICogRGVmaW5lIGEgcXVlcnkgZGVmaW5pdGlvbiBmb3IgQ2xvdWRXYXRjaCBMb2dzIEluc2lnaHRzXG4gKi9cbmV4cG9ydCBjbGFzcyBRdWVyeURlZmluaXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIHF1ZXJ5IGRlZmluaXRpb24uXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBxdWVyeURlZmluaXRpb25JZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBRdWVyeURlZmluaXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5xdWVyeURlZmluaXRpb25OYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVlcnlEZWZpbml0aW9uID0gbmV3IENmblF1ZXJ5RGVmaW5pdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5xdWVyeURlZmluaXRpb25OYW1lLFxuICAgICAgcXVlcnlTdHJpbmc6IHByb3BzLnF1ZXJ5U3RyaW5nLnRvU3RyaW5nKCksXG4gICAgICBsb2dHcm91cE5hbWVzOiB0eXBlb2YgcHJvcHMubG9nR3JvdXBzID09PSAndW5kZWZpbmVkJyA/IFtdIDogcHJvcHMubG9nR3JvdXBzLmZsYXRNYXAobG9nR3JvdXAgPT4gbG9nR3JvdXAubG9nR3JvdXBOYW1lKSxcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcnlEZWZpbml0aW9uSWQgPSBxdWVyeURlZmluaXRpb24uYXR0clF1ZXJ5RGVmaW5pdGlvbklkO1xuICB9XG59XG4iXX0=