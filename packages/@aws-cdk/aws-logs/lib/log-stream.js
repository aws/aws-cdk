"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogStream = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const logs_generated_1 = require("./logs.generated");
/**
 * Define a Log Stream in a Log Group
 */
class LogStream extends core_1.Resource {
    /**
     * Import an existing LogGroup
     */
    static fromLogStreamName(scope, id, logStreamName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.logStreamName = logStreamName;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.logStreamName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_LogStreamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LogStream);
            }
            throw error;
        }
        const resource = new logs_generated_1.CfnLogStream(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            logStreamName: this.physicalName,
        });
        resource.applyRemovalPolicy(props.removalPolicy);
        this.logStreamName = this.getResourceNameAttribute(resource.ref);
    }
}
_a = JSII_RTTI_SYMBOL_1;
LogStream[_a] = { fqn: "@aws-cdk/aws-logs.LogStream", version: "0.0.0" };
exports.LogStream = LogStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXN0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZy1zdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW1FO0FBR25FLHFEQUFnRDtBQTJDaEQ7O0dBRUc7QUFDSCxNQUFhLFNBQVUsU0FBUSxlQUFRO0lBQ3JDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGFBQXFCO1FBQ2pGLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixrQkFBYSxHQUFHLGFBQWEsQ0FBQztZQUNoRCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQU9ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGFBQWE7U0FDbEMsQ0FBQyxDQUFDOzs7Ozs7K0NBcEJNLFNBQVM7Ozs7UUFzQmxCLE1BQU0sUUFBUSxHQUFHLElBQUksNkJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2xELFlBQVksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVk7WUFDekMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2pDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xFOzs7O0FBN0JVLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTG9nR3JvdXAgfSBmcm9tICcuL2xvZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5Mb2dTdHJlYW0gfSBmcm9tICcuL2xvZ3MuZ2VuZXJhdGVkJztcblxuZXhwb3J0IGludGVyZmFjZSBJTG9nU3RyZWFtIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgbG9nIHN0cmVhbVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsb2dTdHJlYW1OYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBMb2dTdHJlYW1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dTdHJlYW1Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbG9nIGdyb3VwIHRvIGNyZWF0ZSBhIGxvZyBzdHJlYW0gZm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXA6IElMb2dHcm91cDtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBzdHJlYW0gdG8gY3JlYXRlLlxuICAgKlxuICAgKiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGxvZ1N0cmVhbU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB3aGF0IGhhcHBlbnMgd2hlbiB0aGUgbG9nIHN0cmVhbSByZXNvdXJjZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAqIGFwcC5cbiAgICpcbiAgICogTm9ybWFsbHkgeW91IHdhbnQgdG8gcmV0YWluIHRoZSBsb2cgc3RyZWFtIHNvIHlvdSBjYW4gZGlhZ25vc2UgaXNzdWVzIGZyb21cbiAgICogbG9ncyBldmVuIGFmdGVyIGEgZGVwbG95bWVudCB0aGF0IG5vIGxvbmdlciBpbmNsdWRlcyB0aGUgbG9nIHN0cmVhbS5cbiAgICpcbiAgICogVGhlIGRhdGUtYmFzZWQgcmV0ZW50aW9uIHBvbGljeSBvZiB5b3VyIGxvZyBncm91cCB3aWxsIGFnZSBvdXQgdGhlIGxvZ3NcbiAgICogYWZ0ZXIgYSBjZXJ0YWluIHRpbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUmV0YWluXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBMb2cgU3RyZWFtIGluIGEgTG9nIEdyb3VwXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dTdHJlYW0gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMb2dTdHJlYW0ge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIExvZ0dyb3VwXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Mb2dTdHJlYW1OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxvZ1N0cmVhbU5hbWU6IHN0cmluZyk6IElMb2dTdHJlYW0ge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUxvZ1N0cmVhbSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbG9nU3RyZWFtTmFtZSA9IGxvZ1N0cmVhbU5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGxvZyBzdHJlYW1cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2dTdHJlYW1OYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvZ1N0cmVhbVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmxvZ1N0cmVhbU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Mb2dTdHJlYW0odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiBwcm9wcy5sb2dHcm91cC5sb2dHcm91cE5hbWUsXG4gICAgICBsb2dTdHJlYW1OYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcblxuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcbiAgICB0aGlzLmxvZ1N0cmVhbU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICB9XG59XG4iXX0=