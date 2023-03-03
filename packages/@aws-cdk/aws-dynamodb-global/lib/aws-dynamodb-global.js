"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTable = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const global_table_coordinator_1 = require("./global-table-coordinator");
/**
 * This class works by deploying an AWS DynamoDB table into each region specified in  GlobalTableProps.regions[],
 * then triggering a CloudFormation Custom Resource Lambda to link them all together to create linked AWS Global DynamoDB tables.
 *
 * @deprecated use `@aws-cdk/aws-dynamodb.Table.replicationRegions` instead
 */
class GlobalTable extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * Creates dynamoDB tables across regions that will be able to be globbed together into a global table
         */
        this._regionalTables = new Array();
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-dynamodb-global.GlobalTable", "use `@aws-cdk/aws-dynamodb.Table.replicationRegions` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_dynamodb_global_GlobalTableProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GlobalTable);
            }
            throw error;
        }
        cdk.Annotations.of(this).addWarning('The @aws-cdk/aws-dynamodb-global module has been deprecated in favor of @aws-cdk/aws-dynamodb.Table.replicationRegions');
        this._regionalTables = [];
        if (props.stream != null && props.stream !== dynamodb.StreamViewType.NEW_AND_OLD_IMAGES) {
            throw new Error('dynamoProps.stream MUST be set to dynamodb.StreamViewType.NEW_AND_OLD_IMAGES');
        }
        // need to set this stream specification, otherwise global tables don't work
        // And no way to set a default value in an interface
        const regionalTableProps = {
            ...props,
            removalPolicy: props.removalPolicy,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        };
        this.lambdaGlobalTableCoordinator = new global_table_coordinator_1.GlobalTableCoordinator(scope, id + '-CustomResource', props);
        const scopeStack = cdk.Stack.of(scope);
        // here we loop through the configured regions.
        // in each region we'll deploy a separate stack with a DynamoDB Table with identical properties in the individual stacks
        for (const region of props.regions) {
            const regionalStack = new cdk.Stack(this, id + '-' + region, { env: { region, account: scopeStack.account } });
            const regionalTable = new dynamodb.Table(regionalStack, `${id}-GlobalTable-${region}`, regionalTableProps);
            this._regionalTables.push(regionalTable);
            // deploy the regional stack before the Lambda coordinator stack
            this.lambdaGlobalTableCoordinator.addDependency(regionalStack);
        }
    }
    /**
     * Obtain tables deployed in other each region
     */
    get regionalTables() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-dynamodb-global.GlobalTable#regionalTables", "use `@aws-cdk/aws-dynamodb.Table.replicationRegions` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "regionalTables").get);
            }
            throw error;
        }
        return this._regionalTables.map(x => x);
    }
}
exports.GlobalTable = GlobalTable;
_a = JSII_RTTI_SYMBOL_1;
GlobalTable[_a] = { fqn: "@aws-cdk/aws-dynamodb-global.GlobalTable", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWR5bmFtb2RiLWdsb2JhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1keW5hbW9kYi1nbG9iYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQWtEO0FBQ2xELHFDQUFxQztBQUNyQywyQ0FBdUM7QUFDdkMseUVBQW9FO0FBb0JwRTs7Ozs7R0FLRztBQUNILE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBV3hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQU5uQjs7V0FFRztRQUNjLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQWtCLENBQUM7Ozs7Ozs7K0NBVHBELFdBQVc7Ozs7UUFjcEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLHdIQUF3SCxDQUFDLENBQUM7UUFFOUosSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFFMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUU7WUFDdkYsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1NBQ2pHO1FBRUQsNEVBQTRFO1FBQzVFLG9EQUFvRDtRQUNwRCxNQUFNLGtCQUFrQixHQUF3QjtZQUM5QyxHQUFHLEtBQUs7WUFDUixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1NBQ25ELENBQUM7UUFFRixJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxpREFBc0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJHLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLCtDQUErQztRQUMvQyx3SEFBd0g7UUFDeEgsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0csTUFBTSxhQUFhLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLE1BQU0sRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDM0csSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFekMsZ0VBQWdFO1lBQ2hFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEU7S0FDRjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxjQUFjOzs7Ozs7Ozs7O1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6Qzs7QUFsREgsa0NBbURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgR2xvYmFsVGFibGVDb29yZGluYXRvciB9IGZyb20gJy4vZ2xvYmFsLXRhYmxlLWNvb3JkaW5hdG9yJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgbXVsdGlwbGUgRHluYW1vREIgdGFibGVzIHRvIG1hc2ggdG9nZXRoZXIgaW50byBhXG4gKiBnbG9iYWwgdGFibGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxUYWJsZVByb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMsIGR5bmFtb2RiLlRhYmxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBEeW5hbW9EQiB0YWJsZSB0byB1c2UgYWNyb3NzIGFsbCByZWdpb25hbCB0YWJsZXMuXG4gICAqIFRoaXMgaXMgcmVxdWlyZWQgZm9yIGdsb2JhbCB0YWJsZXMuXG4gICAqL1xuICByZWFkb25seSB0YWJsZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQXJyYXkgb2YgZW52aXJvbm1lbnRzIHRvIGNyZWF0ZSBEeW5hbW9EQiB0YWJsZXMgaW4uXG4gICAqIFRoZSB0YWJsZXMgd2lsbCBhbGwgYmUgY3JlYXRlZCBpbiB0aGUgc2FtZSBhY2NvdW50LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uczogc3RyaW5nW107XG59XG5cbi8qKlxuICogVGhpcyBjbGFzcyB3b3JrcyBieSBkZXBsb3lpbmcgYW4gQVdTIER5bmFtb0RCIHRhYmxlIGludG8gZWFjaCByZWdpb24gc3BlY2lmaWVkIGluICBHbG9iYWxUYWJsZVByb3BzLnJlZ2lvbnNbXSxcbiAqIHRoZW4gdHJpZ2dlcmluZyBhIENsb3VkRm9ybWF0aW9uIEN1c3RvbSBSZXNvdXJjZSBMYW1iZGEgdG8gbGluayB0aGVtIGFsbCB0b2dldGhlciB0byBjcmVhdGUgbGlua2VkIEFXUyBHbG9iYWwgRHluYW1vREIgdGFibGVzLlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBgQGF3cy1jZGsvYXdzLWR5bmFtb2RiLlRhYmxlLnJlcGxpY2F0aW9uUmVnaW9uc2AgaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgR2xvYmFsVGFibGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY2xvdWRmb3JtYXRpb24gY3VzdG9tIHJlc291cmNlIHRoYXQgbGF1bmNoZXMgYSBsYW1iZGEgdG8gdGllIGl0IGFsbCB0b2dldGhlclxuICAgKi9cbiAgcHJpdmF0ZSBsYW1iZGFHbG9iYWxUYWJsZUNvb3JkaW5hdG9yOiBHbG9iYWxUYWJsZUNvb3JkaW5hdG9yO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGR5bmFtb0RCIHRhYmxlcyBhY3Jvc3MgcmVnaW9ucyB0aGF0IHdpbGwgYmUgYWJsZSB0byBiZSBnbG9iYmVkIHRvZ2V0aGVyIGludG8gYSBnbG9iYWwgdGFibGVcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3JlZ2lvbmFsVGFibGVzID0gbmV3IEFycmF5PGR5bmFtb2RiLlRhYmxlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHbG9iYWxUYWJsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNkay5Bbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCdUaGUgQGF3cy1jZGsvYXdzLWR5bmFtb2RiLWdsb2JhbCBtb2R1bGUgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBAYXdzLWNkay9hd3MtZHluYW1vZGIuVGFibGUucmVwbGljYXRpb25SZWdpb25zJyk7XG5cbiAgICB0aGlzLl9yZWdpb25hbFRhYmxlcyA9IFtdO1xuXG4gICAgaWYgKHByb3BzLnN0cmVhbSAhPSBudWxsICYmIHByb3BzLnN0cmVhbSAhPT0gZHluYW1vZGIuU3RyZWFtVmlld1R5cGUuTkVXX0FORF9PTERfSU1BR0VTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R5bmFtb1Byb3BzLnN0cmVhbSBNVVNUIGJlIHNldCB0byBkeW5hbW9kYi5TdHJlYW1WaWV3VHlwZS5ORVdfQU5EX09MRF9JTUFHRVMnKTtcbiAgICB9XG5cbiAgICAvLyBuZWVkIHRvIHNldCB0aGlzIHN0cmVhbSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZ2xvYmFsIHRhYmxlcyBkb24ndCB3b3JrXG4gICAgLy8gQW5kIG5vIHdheSB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGluIGFuIGludGVyZmFjZVxuICAgIGNvbnN0IHJlZ2lvbmFsVGFibGVQcm9wczogZHluYW1vZGIuVGFibGVQcm9wcyA9IHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgcmVtb3ZhbFBvbGljeTogcHJvcHMucmVtb3ZhbFBvbGljeSxcbiAgICAgIHN0cmVhbTogZHluYW1vZGIuU3RyZWFtVmlld1R5cGUuTkVXX0FORF9PTERfSU1BR0VTLFxuICAgIH07XG5cbiAgICB0aGlzLmxhbWJkYUdsb2JhbFRhYmxlQ29vcmRpbmF0b3IgPSBuZXcgR2xvYmFsVGFibGVDb29yZGluYXRvcihzY29wZSwgaWQgKyAnLUN1c3RvbVJlc291cmNlJywgcHJvcHMpO1xuXG4gICAgY29uc3Qgc2NvcGVTdGFjayA9IGNkay5TdGFjay5vZihzY29wZSk7XG4gICAgLy8gaGVyZSB3ZSBsb29wIHRocm91Z2ggdGhlIGNvbmZpZ3VyZWQgcmVnaW9ucy5cbiAgICAvLyBpbiBlYWNoIHJlZ2lvbiB3ZSdsbCBkZXBsb3kgYSBzZXBhcmF0ZSBzdGFjayB3aXRoIGEgRHluYW1vREIgVGFibGUgd2l0aCBpZGVudGljYWwgcHJvcGVydGllcyBpbiB0aGUgaW5kaXZpZHVhbCBzdGFja3NcbiAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBwcm9wcy5yZWdpb25zKSB7XG4gICAgICBjb25zdCByZWdpb25hbFN0YWNrID0gbmV3IGNkay5TdGFjayh0aGlzLCBpZCArICctJyArIHJlZ2lvbiwgeyBlbnY6IHsgcmVnaW9uLCBhY2NvdW50OiBzY29wZVN0YWNrLmFjY291bnQgfSB9KTtcbiAgICAgIGNvbnN0IHJlZ2lvbmFsVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUocmVnaW9uYWxTdGFjaywgYCR7aWR9LUdsb2JhbFRhYmxlLSR7cmVnaW9ufWAsIHJlZ2lvbmFsVGFibGVQcm9wcyk7XG4gICAgICB0aGlzLl9yZWdpb25hbFRhYmxlcy5wdXNoKHJlZ2lvbmFsVGFibGUpO1xuXG4gICAgICAvLyBkZXBsb3kgdGhlIHJlZ2lvbmFsIHN0YWNrIGJlZm9yZSB0aGUgTGFtYmRhIGNvb3JkaW5hdG9yIHN0YWNrXG4gICAgICB0aGlzLmxhbWJkYUdsb2JhbFRhYmxlQ29vcmRpbmF0b3IuYWRkRGVwZW5kZW5jeShyZWdpb25hbFN0YWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT2J0YWluIHRhYmxlcyBkZXBsb3llZCBpbiBvdGhlciBlYWNoIHJlZ2lvblxuICAgKi9cbiAgcHVibGljIGdldCByZWdpb25hbFRhYmxlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVnaW9uYWxUYWJsZXMubWFwKHggPT4geCk7XG4gIH1cbn1cbiJdfQ==