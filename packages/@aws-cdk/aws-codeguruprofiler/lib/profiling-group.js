"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilingGroup = exports.ComputePlatform = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const codeguruprofiler_generated_1 = require("./codeguruprofiler.generated");
/**
 * The compute platform of the profiling group.
 */
var ComputePlatform;
(function (ComputePlatform) {
    /**
     * Use AWS_LAMBDA if your application runs on AWS Lambda.
     */
    ComputePlatform["AWS_LAMBDA"] = "AWSLambda";
    /**
     * Use Default if your application runs on a compute platform that is not AWS Lambda,
     * such an Amazon EC2 instance, an on-premises server, or a different platform.
     */
    ComputePlatform["DEFAULT"] = "Default";
})(ComputePlatform = exports.ComputePlatform || (exports.ComputePlatform = {}));
class ProfilingGroupBase extends core_1.Resource {
    /**
     * Grant access to publish profiling information to the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:ConfigureAgent
     *  - codeguru-profiler:PostAgentProfile
     *
     * @param grantee Principal to grant publish rights to
     */
    grantPublish(grantee) {
        // https://docs.aws.amazon.com/codeguru/latest/profiler-ug/security-iam.html#security-iam-access-control
        return aws_iam_1.Grant.addToPrincipal({
            grantee,
            actions: ['codeguru-profiler:ConfigureAgent', 'codeguru-profiler:PostAgentProfile'],
            resourceArns: [this.profilingGroupArn],
        });
    }
    /**
     * Grant access to read profiling information from the Profiling Group to the given identity.
     *
     * This will grant the following permissions:
     *
     *  - codeguru-profiler:GetProfile
     *  - codeguru-profiler:DescribeProfilingGroup
     *
     * @param grantee Principal to grant read rights to
     */
    grantRead(grantee) {
        // https://docs.aws.amazon.com/codeguru/latest/profiler-ug/security-iam.html#security-iam-access-control
        return aws_iam_1.Grant.addToPrincipal({
            grantee,
            actions: ['codeguru-profiler:GetProfile', 'codeguru-profiler:DescribeProfilingGroup'],
            resourceArns: [this.profilingGroupArn],
        });
    }
}
/**
 * A new Profiling Group.
 */
class ProfilingGroup extends ProfilingGroupBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.profilingGroupName ?? core_1.Lazy.string({ produce: () => this.generateUniqueId() }),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codeguruprofiler_ProfilingGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ProfilingGroup);
            }
            throw error;
        }
        const profilingGroup = new codeguruprofiler_generated_1.CfnProfilingGroup(this, 'ProfilingGroup', {
            profilingGroupName: this.physicalName,
            computePlatform: props.computePlatform,
        });
        this.profilingGroupName = this.getResourceNameAttribute(profilingGroup.ref);
        this.profilingGroupArn = this.getResourceArnAttribute(profilingGroup.attrArn, {
            service: 'codeguru-profiler',
            resource: 'profilingGroup',
            resourceName: this.physicalName,
        });
    }
    /**
     * Import an existing Profiling Group provided a Profiling Group Name.
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param profilingGroupName Profiling Group Name
     */
    static fromProfilingGroupName(scope, id, profilingGroupName) {
        const stack = core_1.Stack.of(scope);
        return this.fromProfilingGroupArn(scope, id, stack.formatArn({
            service: 'codeguru-profiler',
            resource: 'profilingGroup',
            resourceName: profilingGroupName,
        }));
    }
    /**
     * Import an existing Profiling Group provided an ARN.
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param profilingGroupArn Profiling Group ARN
     */
    static fromProfilingGroupArn(scope, id, profilingGroupArn) {
        class Import extends ProfilingGroupBase {
            constructor() {
                super(...arguments);
                this.profilingGroupName = core_1.Stack.of(scope).splitArn(profilingGroupArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
                this.profilingGroupArn = profilingGroupArn;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: profilingGroupArn,
        });
    }
    generateUniqueId() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 240) {
            return name.substring(0, 120) + name.substring(name.length - 120);
        }
        return name;
    }
}
exports.ProfilingGroup = ProfilingGroup;
_a = JSII_RTTI_SYMBOL_1;
ProfilingGroup[_a] = { fqn: "@aws-cdk/aws-codeguruprofiler.ProfilingGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsaW5nLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZmlsaW5nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFxRDtBQUNyRCx3Q0FBbUY7QUFFbkYsNkVBQWlFO0FBRWpFOztHQUVHO0FBQ0gsSUFBWSxlQVdYO0FBWEQsV0FBWSxlQUFlO0lBQ3pCOztPQUVHO0lBQ0gsMkNBQXdCLENBQUE7SUFFeEI7OztPQUdHO0lBQ0gsc0NBQW1CLENBQUE7QUFDckIsQ0FBQyxFQVhXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVzFCO0FBK0NELE1BQWUsa0JBQW1CLFNBQVEsZUFBUTtJQU1oRDs7Ozs7Ozs7O09BU0c7SUFDSSxZQUFZLENBQUMsT0FBbUI7UUFDckMsd0dBQXdHO1FBQ3hHLE9BQU8sZUFBSyxDQUFDLGNBQWMsQ0FBQztZQUMxQixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsa0NBQWtDLEVBQUUsb0NBQW9DLENBQUM7WUFDbkYsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1NBQ3ZDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksU0FBUyxDQUFDLE9BQW1CO1FBQ2xDLHdHQUF3RztRQUN4RyxPQUFPLGVBQUssQ0FBQyxjQUFjLENBQUM7WUFDMUIsT0FBTztZQUNQLE9BQU8sRUFBRSxDQUFDLDhCQUE4QixFQUFFLDBDQUEwQyxDQUFDO1lBQ3JGLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztTQUN2QyxDQUFDLENBQUM7S0FDSjtDQUVGO0FBc0JEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsa0JBQWtCO0lBbURwRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQTZCLEVBQUU7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixJQUFJLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQztTQUNsRyxDQUFDLENBQUM7Ozs7OzsrQ0F0RE0sY0FBYzs7OztRQXdEdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSw4Q0FBaUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDckMsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1NBQ3ZDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtZQUM1RSxPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztLQUNKO0lBbEVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxrQkFBMEI7UUFDM0YsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDM0QsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFlBQVksRUFBRSxrQkFBa0I7U0FDakMsQ0FBQyxDQUFDLENBQUM7S0FDTDtJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxpQkFBeUI7UUFDekYsTUFBTSxNQUFPLFNBQVEsa0JBQWtCO1lBQXZDOztnQkFDa0IsdUJBQWtCLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQWEsQ0FBQztnQkFDOUcsc0JBQWlCLEdBQUcsaUJBQWlCLENBQUM7WUFDeEQsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzNCLGtCQUFrQixFQUFFLGlCQUFpQjtTQUN0QyxDQUFDLENBQUM7S0FDSjtJQW1DTyxnQkFBZ0I7UUFDdEIsTUFBTSxJQUFJLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjs7QUE1RUgsd0NBOEVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JhbnQsIElHcmFudGFibGUgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEFybkZvcm1hdCwgSVJlc291cmNlLCBMYXp5LCBOYW1lcywgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblByb2ZpbGluZ0dyb3VwIH0gZnJvbSAnLi9jb2RlZ3VydXByb2ZpbGVyLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogVGhlIGNvbXB1dGUgcGxhdGZvcm0gb2YgdGhlIHByb2ZpbGluZyBncm91cC5cbiAqL1xuZXhwb3J0IGVudW0gQ29tcHV0ZVBsYXRmb3JtIHtcbiAgLyoqXG4gICAqIFVzZSBBV1NfTEFNQkRBIGlmIHlvdXIgYXBwbGljYXRpb24gcnVucyBvbiBBV1MgTGFtYmRhLlxuICAgKi9cbiAgQVdTX0xBTUJEQSA9ICdBV1NMYW1iZGEnLFxuXG4gIC8qKlxuICAgKiBVc2UgRGVmYXVsdCBpZiB5b3VyIGFwcGxpY2F0aW9uIHJ1bnMgb24gYSBjb21wdXRlIHBsYXRmb3JtIHRoYXQgaXMgbm90IEFXUyBMYW1iZGEsXG4gICAqIHN1Y2ggYW4gQW1hem9uIEVDMiBpbnN0YW5jZSwgYW4gb24tcHJlbWlzZXMgc2VydmVyLCBvciBhIGRpZmZlcmVudCBwbGF0Zm9ybS5cbiAgICovXG4gIERFRkFVTFQgPSAnRGVmYXVsdCcsXG59XG5cbi8qKlxuICogSVJlc291cmNlIHJlcHJlc2VudHMgYSBQcm9maWxpbmcgR3JvdXAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2ZpbGluZ0dyb3VwIGV4dGVuZHMgSVJlc291cmNlIHtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByb2ZpbGluZyBncm91cC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHByb2ZpbGluZyBncm91cC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBBcm46IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnQgYWNjZXNzIHRvIHB1Ymxpc2ggcHJvZmlsaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBQcm9maWxpbmcgR3JvdXAgdG8gdGhlIGdpdmVuIGlkZW50aXR5LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgZ3JhbnQgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uczpcbiAgICpcbiAgICogIC0gY29kZWd1cnUtcHJvZmlsZXI6Q29uZmlndXJlQWdlbnRcbiAgICogIC0gY29kZWd1cnUtcHJvZmlsZXI6UG9zdEFnZW50UHJvZmlsZVxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBQcmluY2lwYWwgdG8gZ3JhbnQgcHVibGlzaCByaWdodHMgdG9cbiAgICovXG4gIGdyYW50UHVibGlzaChncmFudGVlOiBJR3JhbnRhYmxlKTogR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IGFjY2VzcyB0byByZWFkIHByb2ZpbGluZyBpbmZvcm1hdGlvbiBmcm9tIHRoZSBQcm9maWxpbmcgR3JvdXAgdG8gdGhlIGdpdmVuIGlkZW50aXR5LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgZ3JhbnQgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uczpcbiAgICpcbiAgICogIC0gY29kZWd1cnUtcHJvZmlsZXI6R2V0UHJvZmlsZVxuICAgKiAgLSBjb2RlZ3VydS1wcm9maWxlcjpEZXNjcmliZVByb2ZpbGluZ0dyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFByaW5jaXBhbCB0byBncmFudCByZWFkIHJpZ2h0cyB0b1xuICAgKi9cbiAgZ3JhbnRSZWFkKGdyYW50ZWU6IElHcmFudGFibGUpOiBHcmFudDtcblxufVxuXG5hYnN0cmFjdCBjbGFzcyBQcm9maWxpbmdHcm91cEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQcm9maWxpbmdHcm91cCB7XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHByb2ZpbGluZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcm9maWxpbmdHcm91cEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHcmFudCBhY2Nlc3MgdG8gcHVibGlzaCBwcm9maWxpbmcgaW5mb3JtYXRpb24gdG8gdGhlIFByb2ZpbGluZyBHcm91cCB0byB0aGUgZ2l2ZW4gaWRlbnRpdHkuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBncmFudCB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb25zOlxuICAgKlxuICAgKiAgLSBjb2RlZ3VydS1wcm9maWxlcjpDb25maWd1cmVBZ2VudFxuICAgKiAgLSBjb2RlZ3VydS1wcm9maWxlcjpQb3N0QWdlbnRQcm9maWxlXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFByaW5jaXBhbCB0byBncmFudCBwdWJsaXNoIHJpZ2h0cyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50UHVibGlzaChncmFudGVlOiBJR3JhbnRhYmxlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVndXJ1L2xhdGVzdC9wcm9maWxlci11Zy9zZWN1cml0eS1pYW0uaHRtbCNzZWN1cml0eS1pYW0tYWNjZXNzLWNvbnRyb2xcbiAgICByZXR1cm4gR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnY29kZWd1cnUtcHJvZmlsZXI6Q29uZmlndXJlQWdlbnQnLCAnY29kZWd1cnUtcHJvZmlsZXI6UG9zdEFnZW50UHJvZmlsZSddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5wcm9maWxpbmdHcm91cEFybl0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgYWNjZXNzIHRvIHJlYWQgcHJvZmlsaW5nIGluZm9ybWF0aW9uIGZyb20gdGhlIFByb2ZpbGluZyBHcm91cCB0byB0aGUgZ2l2ZW4gaWRlbnRpdHkuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBncmFudCB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb25zOlxuICAgKlxuICAgKiAgLSBjb2RlZ3VydS1wcm9maWxlcjpHZXRQcm9maWxlXG4gICAqICAtIGNvZGVndXJ1LXByb2ZpbGVyOkRlc2NyaWJlUHJvZmlsaW5nR3JvdXBcbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgUHJpbmNpcGFsIHRvIGdyYW50IHJlYWQgcmlnaHRzIHRvXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRSZWFkKGdyYW50ZWU6IElHcmFudGFibGUpIHtcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWd1cnUvbGF0ZXN0L3Byb2ZpbGVyLXVnL3NlY3VyaXR5LWlhbS5odG1sI3NlY3VyaXR5LWlhbS1hY2Nlc3MtY29udHJvbFxuICAgIHJldHVybiBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydjb2RlZ3VydS1wcm9maWxlcjpHZXRQcm9maWxlJywgJ2NvZGVndXJ1LXByb2ZpbGVyOkRlc2NyaWJlUHJvZmlsaW5nR3JvdXAnXSxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMucHJvZmlsaW5nR3JvdXBBcm5dLFxuICAgIH0pO1xuICB9XG5cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhIG5ldyBQcm9maWxpbmcgR3JvdXAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZmlsaW5nR3JvdXBQcm9wcyB7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHByb2ZpbGluZyBncm91cC5cbiAgICogQGRlZmF1bHQgLSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tcHV0ZSBwbGF0Zm9ybSBvZiB0aGUgcHJvZmlsaW5nIGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDb21wdXRlUGxhdGZvcm0uREVGQVVMVFxuICAgKi9cbiAgcmVhZG9ubHkgY29tcHV0ZVBsYXRmb3JtPzogQ29tcHV0ZVBsYXRmb3JtO1xuXG59XG5cbi8qKlxuICogQSBuZXcgUHJvZmlsaW5nIEdyb3VwLlxuICovXG5leHBvcnQgY2xhc3MgUHJvZmlsaW5nR3JvdXAgZXh0ZW5kcyBQcm9maWxpbmdHcm91cEJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgUHJvZmlsaW5nIEdyb3VwIHByb3ZpZGVkIGEgUHJvZmlsaW5nIEdyb3VwIE5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIHByb2ZpbGluZ0dyb3VwTmFtZSBQcm9maWxpbmcgR3JvdXAgTmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUHJvZmlsaW5nR3JvdXBOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb2ZpbGluZ0dyb3VwTmFtZTogc3RyaW5nKTogSVByb2ZpbGluZ0dyb3VwIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcblxuICAgIHJldHVybiB0aGlzLmZyb21Qcm9maWxpbmdHcm91cEFybihzY29wZSwgaWQsIHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnY29kZWd1cnUtcHJvZmlsZXInLFxuICAgICAgcmVzb3VyY2U6ICdwcm9maWxpbmdHcm91cCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHByb2ZpbGluZ0dyb3VwTmFtZSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIFByb2ZpbGluZyBHcm91cCBwcm92aWRlZCBhbiBBUk4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIHByb2ZpbGluZ0dyb3VwQXJuIFByb2ZpbGluZyBHcm91cCBBUk5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVByb2ZpbGluZ0dyb3VwQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb2ZpbGluZ0dyb3VwQXJuOiBzdHJpbmcpOiBJUHJvZmlsaW5nR3JvdXAge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFByb2ZpbGluZ0dyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBOYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKHByb2ZpbGluZ0dyb3VwQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lITtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwcm9maWxpbmdHcm91cEFybiA9IHByb2ZpbGluZ0dyb3VwQXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBwcm9maWxpbmdHcm91cEFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgUHJvZmlsaW5nIEdyb3VwLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIFByb2ZpbGluZyBHcm91cC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByb2ZpbGluZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFByb2ZpbGluZ0dyb3VwUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wcm9maWxpbmdHcm91cE5hbWUgPz8gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmdlbmVyYXRlVW5pcXVlSWQoKSB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gbmV3IENmblByb2ZpbGluZ0dyb3VwKHRoaXMsICdQcm9maWxpbmdHcm91cCcsIHtcbiAgICAgIHByb2ZpbGluZ0dyb3VwTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBjb21wdXRlUGxhdGZvcm06IHByb3BzLmNvbXB1dGVQbGF0Zm9ybSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvZmlsaW5nR3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocHJvZmlsaW5nR3JvdXAucmVmKTtcblxuICAgIHRoaXMucHJvZmlsaW5nR3JvdXBBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHByb2ZpbGluZ0dyb3VwLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdjb2RlZ3VydS1wcm9maWxlcicsXG4gICAgICByZXNvdXJjZTogJ3Byb2ZpbGluZ0dyb3VwJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVW5pcXVlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBuYW1lID0gTmFtZXMudW5pcXVlSWQodGhpcyk7XG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMjQwKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwgMTIwKSArIG5hbWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoIC0gMTIwKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxufVxuIl19