"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGroup = exports.ReportGroupType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const codebuild_generated_1 = require("./codebuild.generated");
const report_group_utils_1 = require("./report-group-utils");
class ReportGroupBase extends cdk.Resource {
    grantWrite(identity) {
        const typeAction = this.type === ReportGroupType.CODE_COVERAGE ? 'codebuild:BatchPutCodeCoverages' : 'codebuild:BatchPutTestCases';
        const ret = iam.Grant.addToPrincipal({
            grantee: identity,
            actions: [
                'codebuild:CreateReport',
                'codebuild:UpdateReport',
                typeAction,
            ],
            resourceArns: [this.reportGroupArn],
        });
        if (this.exportBucket) {
            this.exportBucket.grantWrite(identity);
        }
        return ret;
    }
}
/**
 * The type of reports in the report group.
 */
var ReportGroupType;
(function (ReportGroupType) {
    /**
     * The report group contains test reports.
     */
    ReportGroupType["TEST"] = "TEST";
    /**
     * The report group contains code coverage reports.
     */
    ReportGroupType["CODE_COVERAGE"] = "CODE_COVERAGE";
})(ReportGroupType = exports.ReportGroupType || (exports.ReportGroupType = {}));
/**
 * The ReportGroup resource class.
 */
class ReportGroup extends ReportGroupBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.reportGroupName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_ReportGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ReportGroup);
            }
            throw error;
        }
        this.type = props.type ? props.type : ReportGroupType.TEST;
        const resource = new codebuild_generated_1.CfnReportGroup(this, 'Resource', {
            type: this.type,
            exportConfig: {
                exportConfigType: props.exportBucket ? 'S3' : 'NO_EXPORT',
                s3Destination: props.exportBucket
                    ? {
                        bucket: props.exportBucket.bucketName,
                        encryptionDisabled: props.exportBucket.encryptionKey ? false : undefined,
                        encryptionKey: props.exportBucket.encryptionKey?.keyArn,
                        packaging: props.zipExport ? 'ZIP' : undefined,
                    }
                    : undefined,
            },
            name: props.reportGroupName,
        });
        resource.applyRemovalPolicy(props.removalPolicy, {
            default: cdk.RemovalPolicy.RETAIN,
        });
        this.reportGroupArn = this.getResourceArnAttribute(resource.attrArn, report_group_utils_1.reportGroupArnComponents(this.physicalName));
        this.reportGroupName = this.getResourceNameAttribute(
        // there is no separate name attribute,
        // so use Fn::Select + Fn::Split to make one
        cdk.Fn.select(1, cdk.Fn.split('/', resource.ref)));
        this.exportBucket = props.exportBucket;
    }
    /**
     * Reference an existing ReportGroup,
     * defined outside of the CDK code,
     * by name.
     */
    static fromReportGroupName(scope, id, reportGroupName) {
        class Import extends ReportGroupBase {
            constructor() {
                super(...arguments);
                this.reportGroupName = reportGroupName;
                this.reportGroupArn = report_group_utils_1.renderReportGroupArn(scope, reportGroupName);
                this.exportBucket = undefined;
                this.type = undefined;
            }
        }
        return new Import(scope, id);
    }
}
exports.ReportGroup = ReportGroup;
_a = JSII_RTTI_SYMBOL_1;
ReportGroup[_a] = { fqn: "@aws-cdk/aws-codebuild.ReportGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVwb3J0LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4QyxxQ0FBcUM7QUFFckMsK0RBQXVEO0FBQ3ZELDZEQUFzRjtBQStCdEYsTUFBZSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBTTFDLFVBQVUsQ0FBQyxRQUF3QjtRQUN4QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQztRQUNuSSxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUNuQyxPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCO2dCQUN4Qix3QkFBd0I7Z0JBQ3hCLFVBQVU7YUFDWDtZQUNELFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxHQUFHLENBQUM7S0FDWjtDQUNGO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGVBU1g7QUFURCxXQUFZLGVBQWU7SUFDekI7O09BRUc7SUFDSCxnQ0FBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCxrREFBK0IsQ0FBQTtBQUNqQyxDQUFDLEVBVFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFTMUI7QUFpREQ7O0dBRUc7QUFDSCxNQUFhLFdBQVksU0FBUSxlQUFlO0lBdUI5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQTBCLEVBQUU7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGVBQWU7U0FDcEMsQ0FBQyxDQUFDOzs7Ozs7K0NBMUJNLFdBQVc7Ozs7UUEyQnBCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztRQUMzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLG9DQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixZQUFZLEVBQUU7Z0JBQ1osZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUN6RCxhQUFhLEVBQUUsS0FBSyxDQUFDLFlBQVk7b0JBQy9CLENBQUMsQ0FBQzt3QkFDQSxNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVO3dCQUNyQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTO3dCQUN4RSxhQUFhLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTTt3QkFDdkQsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUztxQkFDL0M7b0JBQ0QsQ0FBQyxDQUFDLFNBQVM7YUFDZDtZQUNELElBQUksRUFBRSxLQUFLLENBQUMsZUFBZTtTQUM1QixDQUFDLENBQUM7UUFDSCxRQUFRLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUMvQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQ2xDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQ2pFLDZDQUF3QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHdCQUF3QjtRQUNsRCx1Q0FBdUM7UUFDdkMsNENBQTRDO1FBQzVDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ2xELENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7S0FDeEM7SUFwREQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxlQUF1QjtRQUNyRixNQUFNLE1BQU8sU0FBUSxlQUFlO1lBQXBDOztnQkFDa0Isb0JBQWUsR0FBRyxlQUFlLENBQUM7Z0JBQ2xDLG1CQUFjLEdBQUcseUNBQW9CLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUMzRCxpQkFBWSxHQUFHLFNBQVMsQ0FBQztnQkFDekIsU0FBSSxHQUFHLFNBQVMsQ0FBQztZQUN0QyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7QUFoQkgsa0NBdURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUmVwb3J0R3JvdXAgfSBmcm9tICcuL2NvZGVidWlsZC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgcmVuZGVyUmVwb3J0R3JvdXBBcm4sIHJlcG9ydEdyb3VwQXJuQ29tcG9uZW50cyB9IGZyb20gJy4vcmVwb3J0LWdyb3VwLXV0aWxzJztcblxuLyoqXG4gKiBUaGUgaW50ZXJmYWNlIHJlcHJlc2VudGluZyB0aGUgUmVwb3J0R3JvdXAgcmVzb3VyY2UgLVxuICogZWl0aGVyIGFuIGV4aXN0aW5nIG9uZSwgaW1wb3J0ZWQgdXNpbmcgdGhlXG4gKiBgUmVwb3J0R3JvdXAuZnJvbVJlcG9ydEdyb3VwTmFtZWAgbWV0aG9kLFxuICogb3IgYSBuZXcgb25lLCBjcmVhdGVkIHdpdGggdGhlIGBSZXBvcnRHcm91cGAgY2xhc3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJlcG9ydEdyb3VwIGV4dGVuZHMgY2RrLklSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBSZXBvcnRHcm91cC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3J0R3JvdXBBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFJlcG9ydEdyb3VwLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByZXBvcnRHcm91cE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnRzIHRoZSBnaXZlbiBlbnRpdHkgcGVybWlzc2lvbnMgdG8gd3JpdGVcbiAgICogKHRoYXQgaXMsIHVwbG9hZCByZXBvcnRzIHRvKVxuICAgKiB0aGlzIHJlcG9ydCBncm91cC5cbiAgICovXG4gIGdyYW50V3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBSZXBvcnRHcm91cEJhc2UgZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVwb3J0R3JvdXAge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcmVwb3J0R3JvdXBBcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlcG9ydEdyb3VwTmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgZXhwb3J0QnVja2V0PzogczMuSUJ1Y2tldDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHR5cGU/OiBSZXBvcnRHcm91cFR5cGU7XG5cbiAgcHVibGljIGdyYW50V3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICBjb25zdCB0eXBlQWN0aW9uID0gdGhpcy50eXBlID09PSBSZXBvcnRHcm91cFR5cGUuQ09ERV9DT1ZFUkFHRSA/ICdjb2RlYnVpbGQ6QmF0Y2hQdXRDb2RlQ292ZXJhZ2VzJyA6ICdjb2RlYnVpbGQ6QmF0Y2hQdXRUZXN0Q2FzZXMnO1xuICAgIGNvbnN0IHJldCA9IGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2NvZGVidWlsZDpDcmVhdGVSZXBvcnQnLFxuICAgICAgICAnY29kZWJ1aWxkOlVwZGF0ZVJlcG9ydCcsXG4gICAgICAgIHR5cGVBY3Rpb24sXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5yZXBvcnRHcm91cEFybl0sXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5leHBvcnRCdWNrZXQpIHtcbiAgICAgIHRoaXMuZXhwb3J0QnVja2V0LmdyYW50V3JpdGUoaWRlbnRpdHkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiByZXBvcnRzIGluIHRoZSByZXBvcnQgZ3JvdXAuXG4gKi9cbmV4cG9ydCBlbnVtIFJlcG9ydEdyb3VwVHlwZSB7XG4gIC8qKlxuICAgKiBUaGUgcmVwb3J0IGdyb3VwIGNvbnRhaW5zIHRlc3QgcmVwb3J0cy5cbiAgICovXG4gIFRFU1QgPSAnVEVTVCcsXG4gIC8qKlxuICAgKiBUaGUgcmVwb3J0IGdyb3VwIGNvbnRhaW5zIGNvZGUgY292ZXJhZ2UgcmVwb3J0cy5cbiAgICovXG4gIENPREVfQ09WRVJBR0UgPSAnQ09ERV9DT1ZFUkFHRSdcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYFJlcG9ydEdyb3VwYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXBvcnRHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSByZXBvcnQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ2xvdWRGb3JtYXRpb24tZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9ydEdyb3VwTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgUzMgYnVja2V0IHRvIGV4cG9ydCB0aGUgcmVwb3J0cyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgcmVwb3J0cyB3aWxsIG5vdCBiZSBleHBvcnRlZFxuICAgKi9cbiAgcmVhZG9ubHkgZXhwb3J0QnVja2V0PzogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogV2hldGhlciB0byBvdXRwdXQgdGhlIHJlcG9ydCBmaWxlcyBpbnRvIHRoZSBleHBvcnQgYnVja2V0IGFzLWlzLFxuICAgKiBvciBjcmVhdGUgYSBaSVAgZnJvbSB0aGVtIGJlZm9yZSBkb2luZyB0aGUgZXhwb3J0LlxuICAgKiBJZ25vcmVkIGlmIGBleHBvcnRCdWNrZXRgIGhhcyBub3QgYmVlbiBwcm92aWRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZSAodGhlIGZpbGVzIHdpbGwgbm90IGJlIFpJUHBlZClcbiAgICovXG4gIHJlYWRvbmx5IHppcEV4cG9ydD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoYXQgdG8gZG8gd2hlbiB0aGlzIHJlc291cmNlIGlzIGRlbGV0ZWQgZnJvbSBhIHN0YWNrLlxuICAgKiBBcyBDb2RlQnVpbGQgZG9lcyBub3QgYWxsb3cgZGVsZXRpbmcgYSBSZXNvdXJjZUdyb3VwIHRoYXQgaGFzIHJlcG9ydHMgaW5zaWRlIG9mIGl0LFxuICAgKiB0aGlzIGlzIHNldCB0byByZXRhaW4gdGhlIHJlc291cmNlIGJ5IGRlZmF1bHQuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUkVUQUlOXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogY2RrLlJlbW92YWxQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHJlcG9ydCBncm91cC4gVGhpcyBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKlxuICAgKiAtICoqVEVTVCoqIC0gVGhlIHJlcG9ydCBncm91cCBjb250YWlucyB0ZXN0IHJlcG9ydHMuXG4gICAqIC0gKipDT0RFX0NPVkVSQUdFKiogLSBUaGUgcmVwb3J0IGdyb3VwIGNvbnRhaW5zIGNvZGUgY292ZXJhZ2UgcmVwb3J0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgVEVTVFxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZT86IFJlcG9ydEdyb3VwVHlwZVxufVxuXG4vKipcbiAqIFRoZSBSZXBvcnRHcm91cCByZXNvdXJjZSBjbGFzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlcG9ydEdyb3VwIGV4dGVuZHMgUmVwb3J0R3JvdXBCYXNlIHtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIGFuIGV4aXN0aW5nIFJlcG9ydEdyb3VwLFxuICAgKiBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIENESyBjb2RlLFxuICAgKiBieSBuYW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVwb3J0R3JvdXBOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlcG9ydEdyb3VwTmFtZTogc3RyaW5nKTogSVJlcG9ydEdyb3VwIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXBvcnRHcm91cEJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9ydEdyb3VwTmFtZSA9IHJlcG9ydEdyb3VwTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXBvcnRHcm91cEFybiA9IHJlbmRlclJlcG9ydEdyb3VwQXJuKHNjb3BlLCByZXBvcnRHcm91cE5hbWUpO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGV4cG9ydEJ1Y2tldCA9IHVuZGVmaW5lZDtcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSB0eXBlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3J0R3JvdXBBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJlcG9ydEdyb3VwTmFtZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXhwb3J0QnVja2V0PzogczMuSUJ1Y2tldDtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHR5cGU/OiBSZXBvcnRHcm91cFR5cGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJlcG9ydEdyb3VwUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5yZXBvcnRHcm91cE5hbWUsXG4gICAgfSk7XG4gICAgdGhpcy50eXBlID0gcHJvcHMudHlwZSA/IHByb3BzLnR5cGUgOiBSZXBvcnRHcm91cFR5cGUuVEVTVDtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXBvcnRHcm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBleHBvcnRDb25maWc6IHtcbiAgICAgICAgZXhwb3J0Q29uZmlnVHlwZTogcHJvcHMuZXhwb3J0QnVja2V0ID8gJ1MzJyA6ICdOT19FWFBPUlQnLFxuICAgICAgICBzM0Rlc3RpbmF0aW9uOiBwcm9wcy5leHBvcnRCdWNrZXRcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgIGJ1Y2tldDogcHJvcHMuZXhwb3J0QnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgICAgICBlbmNyeXB0aW9uRGlzYWJsZWQ6IHByb3BzLmV4cG9ydEJ1Y2tldC5lbmNyeXB0aW9uS2V5ID8gZmFsc2UgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBlbmNyeXB0aW9uS2V5OiBwcm9wcy5leHBvcnRCdWNrZXQuZW5jcnlwdGlvbktleT8ua2V5QXJuLFxuICAgICAgICAgICAgcGFja2FnaW5nOiBwcm9wcy56aXBFeHBvcnQgPyAnWklQJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9XG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgbmFtZTogcHJvcHMucmVwb3J0R3JvdXBOYW1lLFxuICAgIH0pO1xuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5LCB7XG4gICAgICBkZWZhdWx0OiBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgfSk7XG4gICAgdGhpcy5yZXBvcnRHcm91cEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybixcbiAgICAgIHJlcG9ydEdyb3VwQXJuQ29tcG9uZW50cyh0aGlzLnBoeXNpY2FsTmFtZSkpO1xuICAgIHRoaXMucmVwb3J0R3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUoXG4gICAgICAvLyB0aGVyZSBpcyBubyBzZXBhcmF0ZSBuYW1lIGF0dHJpYnV0ZSxcbiAgICAgIC8vIHNvIHVzZSBGbjo6U2VsZWN0ICsgRm46OlNwbGl0IHRvIG1ha2Ugb25lXG4gICAgICBjZGsuRm4uc2VsZWN0KDEsIGNkay5Gbi5zcGxpdCgnLycsIHJlc291cmNlLnJlZikpLFxuICAgICk7XG4gICAgdGhpcy5leHBvcnRCdWNrZXQgPSBwcm9wcy5leHBvcnRCdWNrZXQ7XG4gIH1cbn1cbiJdfQ==