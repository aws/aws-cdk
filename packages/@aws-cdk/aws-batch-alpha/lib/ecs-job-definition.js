"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsJobDefinition = exports.Compatibility = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
const aws_batch_1 = require("aws-cdk-lib/aws-batch");
const ecs_container_definition_1 = require("./ecs-container-definition");
const job_definition_base_1 = require("./job-definition-base");
const iam = require("aws-cdk-lib/aws-iam");
/**
 * @internal
 */
var Compatibility;
(function (Compatibility) {
    Compatibility["EC2"] = "EC2";
    Compatibility["FARGATE"] = "FARGATE";
})(Compatibility || (exports.Compatibility = Compatibility = {}));
/**
 * A JobDefinition that uses ECS orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
class EcsJobDefinition extends job_definition_base_1.JobDefinitionBase {
    /**
     * Import a JobDefinition by its arn.
     */
    static fromJobDefinitionArn(scope, id, jobDefinitionArn) {
        class Import extends job_definition_base_1.JobDefinitionBase {
            constructor() {
                super(...arguments);
                this.jobDefinitionArn = jobDefinitionArn;
                this.jobDefinitionName = EcsJobDefinition.getJobDefinitionName(this, jobDefinitionArn);
                this.enabled = true;
                this.container = {};
            }
        }
        return new Import(scope, id);
    }
    static getJobDefinitionName(scope, jobDefinitionArn) {
        const resourceName = core_1.Stack.of(scope).splitArn(jobDefinitionArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        return resourceName.split(':')[0];
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EcsJobDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsJobDefinition);
            }
            throw error;
        }
        this.container = props.container;
        this.propagateTags = props?.propagateTags;
        const resource = new aws_batch_1.CfnJobDefinition(this, 'Resource', {
            ...(0, job_definition_base_1.baseJobDefinitionProperties)(this),
            type: 'container',
            jobDefinitionName: props.jobDefinitionName,
            containerProperties: this.container?._renderContainerDefinition(),
            platformCapabilities: this.renderPlatformCapabilities(),
            propagateTags: this.propagateTags,
        });
        this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
            service: 'batch',
            resource: 'job-definition',
            resourceName: this.physicalName,
        });
        this.jobDefinitionName = EcsJobDefinition.getJobDefinitionName(scope, this.jobDefinitionArn);
    }
    /**
     * Grants the `batch:submitJob` permission to the identity on both this job definition and the `queue`
    */
    grantSubmitJob(identity, queue) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_IJobQueue(queue);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grantSubmitJob);
            }
            throw error;
        }
        iam.Grant.addToPrincipal({
            actions: ['batch:SubmitJob'],
            grantee: identity,
            resourceArns: [this.jobDefinitionArn, queue.jobQueueArn],
        });
    }
    renderPlatformCapabilities() {
        if (this.container instanceof ecs_container_definition_1.EcsEc2ContainerDefinition) {
            return [Compatibility.EC2];
        }
        return [Compatibility.FARGATE];
    }
}
exports.EcsJobDefinition = EcsJobDefinition;
_a = JSII_RTTI_SYMBOL_1;
EcsJobDefinition[_a] = { fqn: "@aws-cdk/aws-batch-alpha.EcsJobDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNzLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUFvRDtBQUVwRCxxREFBeUQ7QUFDekQseUVBQWdHO0FBQ2hHLCtEQUEySDtBQUMzSCwyQ0FBMkM7QUFxQjNDOztHQUVHO0FBQ0gsSUFBWSxhQUdYO0FBSEQsV0FBWSxhQUFhO0lBQ3ZCLDRCQUFXLENBQUE7SUFDWCxvQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSFcsYUFBYSw2QkFBYixhQUFhLFFBR3hCO0FBb0JEOzs7O0dBSUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHVDQUFpQjtJQUNyRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxnQkFBd0I7UUFDdkYsTUFBTSxNQUFPLFNBQVEsdUNBQWlCO1lBQXRDOztnQkFDa0IscUJBQWdCLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQ3BDLHNCQUFpQixHQUFHLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNsRixZQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUMvQixjQUFTLEdBQUcsRUFBUyxDQUFDO1lBQ3hCLENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQWdCLEVBQUUsZ0JBQXdCO1FBQzVFLE1BQU0sWUFBWSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFhLENBQUM7UUFDN0csT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25DO0lBUUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQTNCZixnQkFBZ0I7Ozs7UUE2QnpCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssRUFBRSxhQUFhLENBQUM7UUFFMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSw0QkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELEdBQUcsSUFBQSxpREFBMkIsRUFBQyxJQUFJLENBQUM7WUFDcEMsSUFBSSxFQUFFLFdBQVc7WUFDakIsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUMxQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFFO1lBQ2pFLG9CQUFvQixFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRTtZQUN2RCxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2pFLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDOUY7SUFFRDs7TUFFRTtJQUNLLGNBQWMsQ0FBQyxRQUF3QixFQUFFLEtBQWdCOzs7Ozs7Ozs7O1FBQzlELEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO1lBQzVCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDO1NBQ3pELENBQUMsQ0FBQztLQUNKO0lBRU8sMEJBQTBCO1FBQ2hDLElBQUksSUFBSSxDQUFDLFNBQVMsWUFBWSxvREFBeUIsRUFBRTtZQUN2RCxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBRUQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNoQzs7QUFsRUgsNENBbUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Kb2JEZWZpbml0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWJhdGNoJztcbmltcG9ydCB7IEVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24sIElFY3NDb250YWluZXJEZWZpbml0aW9uIH0gZnJvbSAnLi9lY3MtY29udGFpbmVyLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgYmFzZUpvYkRlZmluaXRpb25Qcm9wZXJ0aWVzLCBJSm9iRGVmaW5pdGlvbiwgSm9iRGVmaW5pdGlvbkJhc2UsIEpvYkRlZmluaXRpb25Qcm9wcyB9IGZyb20gJy4vam9iLWRlZmluaXRpb24tYmFzZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBJSm9iUXVldWUgfSBmcm9tICcuL2pvYi1xdWV1ZSc7XG5cbi8qKlxuICogQSBKb2JEZWZpbml0aW9uIHRoYXQgdXNlcyBFQ1Mgb3JjaGVzdHJhdGlvblxuICovXG5pbnRlcmZhY2UgSUVjc0pvYkRlZmluaXRpb24gZXh0ZW5kcyBJSm9iRGVmaW5pdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIHRoYXQgdGhpcyBqb2Igd2lsbCBydW5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lcjogSUVjc0NvbnRhaW5lckRlZmluaXRpb25cblxuICAvKipcbiAgICogV2hldGhlciB0byBwcm9wb2dhdGUgdGFncyBmcm9tIHRoZSBKb2JEZWZpbml0aW9uXG4gICAqIHRvIHRoZSBFQ1MgdGFzayB0aGF0IEJhdGNoIHNwYXduc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGFnYXRlVGFncz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBlbnVtIENvbXBhdGliaWxpdHkge1xuICBFQzIgPSAnRUMyJyxcbiAgRkFSR0FURSA9ICdGQVJHQVRFJyxcbn1cblxuLyoqXG4gKiBQcm9wcyBmb3IgRWNzSm9iRGVmaW5pdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc0pvYkRlZmluaXRpb25Qcm9wcyBleHRlbmRzIEpvYkRlZmluaXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIHRoYXQgdGhpcyBqb2Igd2lsbCBydW5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lcjogSUVjc0NvbnRhaW5lckRlZmluaXRpb25cblxuICAvKipcbiAgICogV2hldGhlciB0byBwcm9wb2dhdGUgdGFncyBmcm9tIHRoZSBKb2JEZWZpbml0aW9uXG4gICAqIHRvIHRoZSBFQ1MgdGFzayB0aGF0IEJhdGNoIHNwYXduc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGFnYXRlVGFncz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBKb2JEZWZpbml0aW9uIHRoYXQgdXNlcyBFQ1Mgb3JjaGVzdHJhdGlvblxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NKb2JEZWZpbml0aW9uIGV4dGVuZHMgSm9iRGVmaW5pdGlvbkJhc2UgaW1wbGVtZW50cyBJRWNzSm9iRGVmaW5pdGlvbiB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBKb2JEZWZpbml0aW9uIGJ5IGl0cyBhcm4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Kb2JEZWZpbml0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGpvYkRlZmluaXRpb25Bcm46IHN0cmluZyk6IElKb2JEZWZpbml0aW9uIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBKb2JEZWZpbml0aW9uQmFzZSBpbXBsZW1lbnRzIElFY3NKb2JEZWZpbml0aW9uIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBqb2JEZWZpbml0aW9uQXJuID0gam9iRGVmaW5pdGlvbkFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBqb2JEZWZpbml0aW9uTmFtZSA9IEVjc0pvYkRlZmluaXRpb24uZ2V0Sm9iRGVmaW5pdGlvbk5hbWUodGhpcywgam9iRGVmaW5pdGlvbkFybik7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5hYmxlZCA9IHRydWU7XG4gICAgICBjb250YWluZXIgPSB7fSBhcyBhbnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldEpvYkRlZmluaXRpb25OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGpvYkRlZmluaXRpb25Bcm46IHN0cmluZykge1xuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihqb2JEZWZpbml0aW9uQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lITtcbiAgICByZXR1cm4gcmVzb3VyY2VOYW1lLnNwbGl0KCc6JylbMF07XG4gIH1cblxuICByZWFkb25seSBjb250YWluZXI6IElFY3NDb250YWluZXJEZWZpbml0aW9uXG4gIHB1YmxpYyByZWFkb25seSBwcm9wYWdhdGVUYWdzPzogYm9vbGVhbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbk5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWNzSm9iRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IHByb3BzLmNvbnRhaW5lcjtcbiAgICB0aGlzLnByb3BhZ2F0ZVRhZ3MgPSBwcm9wcz8ucHJvcGFnYXRlVGFncztcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkpvYkRlZmluaXRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgLi4uYmFzZUpvYkRlZmluaXRpb25Qcm9wZXJ0aWVzKHRoaXMpLFxuICAgICAgdHlwZTogJ2NvbnRhaW5lcicsXG4gICAgICBqb2JEZWZpbml0aW9uTmFtZTogcHJvcHMuam9iRGVmaW5pdGlvbk5hbWUsXG4gICAgICBjb250YWluZXJQcm9wZXJ0aWVzOiB0aGlzLmNvbnRhaW5lcj8uX3JlbmRlckNvbnRhaW5lckRlZmluaXRpb24oKSxcbiAgICAgIHBsYXRmb3JtQ2FwYWJpbGl0aWVzOiB0aGlzLnJlbmRlclBsYXRmb3JtQ2FwYWJpbGl0aWVzKCksXG4gICAgICBwcm9wYWdhdGVUYWdzOiB0aGlzLnByb3BhZ2F0ZVRhZ3MsXG4gICAgfSk7XG5cbiAgICB0aGlzLmpvYkRlZmluaXRpb25Bcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLnJlZiwge1xuICAgICAgc2VydmljZTogJ2JhdGNoJyxcbiAgICAgIHJlc291cmNlOiAnam9iLWRlZmluaXRpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLmpvYkRlZmluaXRpb25OYW1lID0gRWNzSm9iRGVmaW5pdGlvbi5nZXRKb2JEZWZpbml0aW9uTmFtZShzY29wZSwgdGhpcy5qb2JEZWZpbml0aW9uQXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgdGhlIGBiYXRjaDpzdWJtaXRKb2JgIHBlcm1pc3Npb24gdG8gdGhlIGlkZW50aXR5IG9uIGJvdGggdGhpcyBqb2IgZGVmaW5pdGlvbiBhbmQgdGhlIGBxdWV1ZWBcbiAgKi9cbiAgcHVibGljIGdyYW50U3VibWl0Sm9iKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgcXVldWU6IElKb2JRdWV1ZSkge1xuICAgIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBhY3Rpb25zOiBbJ2JhdGNoOlN1Ym1pdEpvYiddLFxuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmpvYkRlZmluaXRpb25Bcm4sIHF1ZXVlLmpvYlF1ZXVlQXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUGxhdGZvcm1DYXBhYmlsaXRpZXMoKSB7XG4gICAgaWYgKHRoaXMuY29udGFpbmVyIGluc3RhbmNlb2YgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbikge1xuICAgICAgcmV0dXJuIFtDb21wYXRpYmlsaXR5LkVDMl07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtDb21wYXRpYmlsaXR5LkZBUkdBVEVdO1xuICB9XG59XG4iXX0=