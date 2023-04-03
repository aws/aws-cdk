"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchJob = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const util_1 = require("./util");
/**
 * Use an AWS Batch Job / Queue as an event rule target.
 * Most likely the code will look something like this:
 * `new BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition)`
 *
 * In the future this API will be improved to be fully typed
 */
class BatchJob {
    constructor(
    /**
     * The JobQueue arn
     */
    jobQueueArn, 
    /**
     * The JobQueue Resource
     */
    jobQueueScope, 
    /**
     * The jobDefinition arn
     */
    jobDefinitionArn, 
    /**
     * The JobQueue Resource
     */
    jobDefinitionScope, props = {}) {
        this.jobQueueArn = jobQueueArn;
        this.jobQueueScope = jobQueueScope;
        this.jobDefinitionArn = jobDefinitionArn;
        this.jobDefinitionScope = jobDefinitionScope;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_BatchJobProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BatchJob);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger queue this batch job as a
     * result from an EventBridge event.
     */
    bind(rule, _id) {
        const batchParameters = {
            jobDefinition: this.jobDefinitionArn,
            jobName: this.props.jobName ?? core_1.Names.nodeUniqueId(rule.node),
            arrayProperties: this.props.size ? { size: this.props.size } : undefined,
            retryStrategy: this.props.attempts ? { attempts: this.props.attempts } : undefined,
        };
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
        }
        // When scoping resource-level access for job submission, you must provide both job queue and job definition resource types.
        // https://docs.aws.amazon.com/batch/latest/userguide/ExamplePolicies_BATCH.html#iam-example-restrict-job-def
        const role = util_1.singletonEventRole(this.jobDefinitionScope);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['batch:SubmitJob'],
            resources: [
                this.jobDefinitionArn,
                this.jobQueueArn,
            ],
        }));
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.jobQueueArn,
            role,
            input: this.props.event,
            targetResource: this.jobQueueScope,
            batchParameters,
        };
    }
}
exports.BatchJob = BatchJob;
_a = JSII_RTTI_SYMBOL_1;
BatchJob[_a] = { fqn: "@aws-cdk/aws-events-targets.BatchJob", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFDeEMsd0NBQXNDO0FBRXRDLGlDQUF1SDtBQXVDdkg7Ozs7OztHQU1HO0FBQ0gsTUFBYSxRQUFRO0lBQ25CO0lBQ0U7O09BRUc7SUFDYyxXQUFtQjtJQUVwQzs7T0FFRztJQUNjLGFBQXlCO0lBRTFDOztPQUVHO0lBQ2MsZ0JBQXdCO0lBRXpDOztPQUVHO0lBQ2Msa0JBQThCLEVBQzlCLFFBQXVCLEVBQUU7UUFoQnpCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBS25CLGtCQUFhLEdBQWIsYUFBYSxDQUFZO1FBS3pCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtRQUt4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQVk7UUFDOUIsVUFBSyxHQUFMLEtBQUssQ0FBb0I7Ozs7OzsrQ0FyQmpDLFFBQVE7Ozs7S0FzQmQ7SUFFTDs7O09BR0c7SUFDSSxJQUFJLENBQUMsSUFBa0IsRUFBRSxHQUFZO1FBQzFDLE1BQU0sZUFBZSxHQUEyQztZQUM5RCxhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUNwQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzVELGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN4RSxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDbkYsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDOUIseUNBQWtDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdEU7UUFFRCw0SEFBNEg7UUFDNUgsNkdBQTZHO1FBQzdHLE1BQU0sSUFBSSxHQUFHLHlCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDaEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsU0FBUyxFQUFFO2dCQUNULElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3JCLElBQUksQ0FBQyxXQUFXO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1lBQ0wsR0FBRywyQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25DLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUNyQixJQUFJO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN2QixjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDbEMsZUFBZTtTQUNoQixDQUFDO0tBQ0g7O0FBM0RILDRCQTREQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5LCBiaW5kQmFzZVRhcmdldENvbmZpZywgc2luZ2xldG9uRXZlbnRSb2xlLCBUYXJnZXRCYXNlUHJvcHMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEN1c3RvbWl6ZSB0aGUgQmF0Y2ggSm9iIEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhdGNoSm9iUHJvcHMgZXh0ZW5kcyBUYXJnZXRCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIGV2ZW50IHRvIHNlbmQgdG8gdGhlIExhbWJkYVxuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgdGhlIHBheWxvYWQgc2VudCB0byB0aGUgTGFtYmRhIEZ1bmN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgZW50aXJlIEV2ZW50QnJpZGdlIGV2ZW50XG4gICAqL1xuICByZWFkb25seSBldmVudD86IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBzaXplIG9mIHRoZSBhcnJheSwgaWYgdGhpcyBpcyBhbiBhcnJheSBiYXRjaCBqb2IuXG4gICAqXG4gICAqIFZhbGlkIHZhbHVlcyBhcmUgaW50ZWdlcnMgYmV0d2VlbiAyIGFuZCAxMCwwMDAuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIGFycmF5UHJvcGVydGllcyBhcmUgc2V0XG4gICAqL1xuICByZWFkb25seSBzaXplPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGF0dGVtcHQgdG8gcmV0cnksIGlmIHRoZSBqb2IgZmFpbHMuIFZhbGlkIHZhbHVlcyBhcmUgMeKAkzEwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBubyByZXRyeVN0cmF0ZWd5IGlzIHNldFxuICAgKi9cbiAgcmVhZG9ubHkgYXR0ZW1wdHM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdWJtaXR0ZWQgam9iXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGpvYk5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVXNlIGFuIEFXUyBCYXRjaCBKb2IgLyBRdWV1ZSBhcyBhbiBldmVudCBydWxlIHRhcmdldC5cbiAqIE1vc3QgbGlrZWx5IHRoZSBjb2RlIHdpbGwgbG9vayBzb21ldGhpbmcgbGlrZSB0aGlzOlxuICogYG5ldyBCYXRjaEpvYihqb2JRdWV1ZS5qb2JRdWV1ZUFybiwgam9iUXVldWUsIGpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybiwgam9iRGVmaW5pdGlvbilgXG4gKlxuICogSW4gdGhlIGZ1dHVyZSB0aGlzIEFQSSB3aWxsIGJlIGltcHJvdmVkIHRvIGJlIGZ1bGx5IHR5cGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXRjaEpvYiBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIFRoZSBKb2JRdWV1ZSBhcm5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGpvYlF1ZXVlQXJuOiBzdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSm9iUXVldWUgUmVzb3VyY2VcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGpvYlF1ZXVlU2NvcGU6IElDb25zdHJ1Y3QsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgam9iRGVmaW5pdGlvbiBhcm5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGpvYkRlZmluaXRpb25Bcm46IHN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIFRoZSBKb2JRdWV1ZSBSZXNvdXJjZVxuICAgICAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgam9iRGVmaW5pdGlvblNjb3BlOiBJQ29uc3RydWN0LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEJhdGNoSm9iUHJvcHMgPSB7fSxcbiAgKSB7IH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIFJ1bGVUYXJnZXQgdGhhdCBjYW4gYmUgdXNlZCB0byB0cmlnZ2VyIHF1ZXVlIHRoaXMgYmF0Y2ggam9iIGFzIGFcbiAgICogcmVzdWx0IGZyb20gYW4gRXZlbnRCcmlkZ2UgZXZlbnQuXG4gICAqL1xuICBwdWJsaWMgYmluZChydWxlOiBldmVudHMuSVJ1bGUsIF9pZD86IHN0cmluZyk6IGV2ZW50cy5SdWxlVGFyZ2V0Q29uZmlnIHtcbiAgICBjb25zdCBiYXRjaFBhcmFtZXRlcnM6IGV2ZW50cy5DZm5SdWxlLkJhdGNoUGFyYW1ldGVyc1Byb3BlcnR5ID0ge1xuICAgICAgam9iRGVmaW5pdGlvbjogdGhpcy5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgam9iTmFtZTogdGhpcy5wcm9wcy5qb2JOYW1lID8/IE5hbWVzLm5vZGVVbmlxdWVJZChydWxlLm5vZGUpLFxuICAgICAgYXJyYXlQcm9wZXJ0aWVzOiB0aGlzLnByb3BzLnNpemUgPyB7IHNpemU6IHRoaXMucHJvcHMuc2l6ZSB9IDogdW5kZWZpbmVkLFxuICAgICAgcmV0cnlTdHJhdGVneTogdGhpcy5wcm9wcy5hdHRlbXB0cyA/IHsgYXR0ZW1wdHM6IHRoaXMucHJvcHMuYXR0ZW1wdHMgfSA6IHVuZGVmaW5lZCxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KHJ1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHNjb3BpbmcgcmVzb3VyY2UtbGV2ZWwgYWNjZXNzIGZvciBqb2Igc3VibWlzc2lvbiwgeW91IG11c3QgcHJvdmlkZSBib3RoIGpvYiBxdWV1ZSBhbmQgam9iIGRlZmluaXRpb24gcmVzb3VyY2UgdHlwZXMuXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvRXhhbXBsZVBvbGljaWVzX0JBVENILmh0bWwjaWFtLWV4YW1wbGUtcmVzdHJpY3Qtam9iLWRlZlxuICAgIGNvbnN0IHJvbGUgPSBzaW5nbGV0b25FdmVudFJvbGUodGhpcy5qb2JEZWZpbml0aW9uU2NvcGUpO1xuICAgIHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydiYXRjaDpTdWJtaXRKb2InXSxcbiAgICAgIHJlc291cmNlczogW1xuICAgICAgICB0aGlzLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgIHRoaXMuam9iUXVldWVBcm4sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5iaW5kQmFzZVRhcmdldENvbmZpZyh0aGlzLnByb3BzKSxcbiAgICAgIGFybjogdGhpcy5qb2JRdWV1ZUFybixcbiAgICAgIHJvbGUsXG4gICAgICBpbnB1dDogdGhpcy5wcm9wcy5ldmVudCxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLmpvYlF1ZXVlU2NvcGUsXG4gICAgICBiYXRjaFBhcmFtZXRlcnMsXG4gICAgfTtcbiAgfVxufVxuIl19