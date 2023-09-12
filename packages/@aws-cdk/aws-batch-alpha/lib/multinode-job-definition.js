"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiNodeJobDefinition = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
const aws_batch_1 = require("aws-cdk-lib/aws-batch");
const ecs_job_definition_1 = require("./ecs-job-definition");
const job_definition_base_1 = require("./job-definition-base");
/**
 * A JobDefinition that uses Ecs orchestration to run multiple containers
 *
 * @resource AWS::Batch::JobDefinition
 */
class MultiNodeJobDefinition extends job_definition_base_1.JobDefinitionBase {
    /**
     * refer to an existing JobDefinition by its arn
     */
    static fromJobDefinitionArn(scope, id, jobDefinitionArn) {
        const stack = core_1.Stack.of(scope);
        const jobDefinitionName = stack.splitArn(jobDefinitionArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        class Import extends job_definition_base_1.JobDefinitionBase {
            constructor() {
                super(...arguments);
                this.jobDefinitionArn = jobDefinitionArn;
                this.jobDefinitionName = jobDefinitionName;
                this.enabled = true;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_MultiNodeJobDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MultiNodeJobDefinition);
            }
            throw error;
        }
        this.containers = props.containers ?? [];
        this.mainNode = props.mainNode;
        this.instanceType = props.instanceType;
        this.propagateTags = props?.propagateTags;
        const resource = new aws_batch_1.CfnJobDefinition(this, 'Resource', {
            ...(0, job_definition_base_1.baseJobDefinitionProperties)(this),
            type: 'multinode',
            jobDefinitionName: props.jobDefinitionName,
            propagateTags: this.propagateTags,
            nodeProperties: {
                mainNode: this.mainNode ?? 0,
                nodeRangeProperties: core_1.Lazy.any({
                    produce: () => this.containers.map((container) => ({
                        targetNodes: container.startNode + ':' + container.endNode,
                        container: {
                            ...container.container._renderContainerDefinition(),
                            instanceType: this.instanceType.toString(),
                        },
                    })),
                }),
                numNodes: core_1.Lazy.number({
                    produce: () => computeNumNodes(this.containers),
                }),
            },
            platformCapabilities: [ecs_job_definition_1.Compatibility.EC2],
        });
        this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
            service: 'batch',
            resource: 'job-definition',
            resourceName: this.physicalName,
        });
        this.jobDefinitionName = this.getResourceNameAttribute(resource.ref);
        this.node.addValidation({ validate: () => validateContainers(this.containers) });
    }
    addContainer(container) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_MultiNodeContainer(container);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addContainer);
            }
            throw error;
        }
        this.containers.push(container);
    }
}
exports.MultiNodeJobDefinition = MultiNodeJobDefinition;
_a = JSII_RTTI_SYMBOL_1;
MultiNodeJobDefinition[_a] = { fqn: "@aws-cdk/aws-batch-alpha.MultiNodeJobDefinition", version: "0.0.0" };
function computeNumNodes(containers) {
    let result = 0;
    for (const container of containers) {
        result += container.endNode - container.startNode + 1;
    }
    return result;
}
function validateContainers(containers) {
    return containers.length === 0 ? ['multinode job has no containers!'] : [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlub2RlLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibXVsdGlub2RlLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDJDQUEwRDtBQUUxRCxxREFBeUQ7QUFFekQsNkRBQXFEO0FBQ3JELCtEQUEySDtBQWlHM0g7Ozs7R0FJRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsdUNBQWlCO0lBQzNEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGdCQUF3QjtRQUN2RixNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBYSxDQUFDO1FBRXhHLE1BQU0sTUFBTyxTQUFRLHVDQUFpQjtZQUF0Qzs7Z0JBQ2tCLHFCQUFnQixHQUFHLGdCQUFnQixDQUFDO2dCQUNwQyxzQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztnQkFDdEMsWUFBTyxHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQVVELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0M7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0ExQmYsc0JBQXNCOzs7O1FBNEIvQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLEVBQUUsYUFBYSxDQUFDO1FBRTFDLE1BQU0sUUFBUSxHQUFHLElBQUksNEJBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxHQUFHLElBQUEsaURBQTJCLEVBQUMsSUFBSSxDQUFDO1lBQ3BDLElBQUksRUFBRSxXQUFXO1lBQ2pCLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDMUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLGNBQWMsRUFBRTtnQkFDZCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO2dCQUM1QixtQkFBbUIsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDO29CQUM1QixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ2pELFdBQVcsRUFBRSxTQUFTLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsT0FBTzt3QkFDMUQsU0FBUyxFQUFFOzRCQUNULEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsRUFBRTs0QkFDbkQsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO3lCQUMzQztxQkFDRixDQUFDLENBQUM7aUJBQ0osQ0FBQztnQkFDRixRQUFRLEVBQUUsV0FBSSxDQUFDLE1BQU0sQ0FBQztvQkFDcEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUNoRCxDQUFDO2FBQ0g7WUFDRCxvQkFBb0IsRUFBRSxDQUFDLGtDQUFhLENBQUMsR0FBRyxDQUFDO1NBQzFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNqRSxPQUFPLEVBQUUsT0FBTztZQUNoQixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2xGO0lBRU0sWUFBWSxDQUFDLFNBQTZCOzs7Ozs7Ozs7O1FBQy9DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2pDOztBQW5FSCx3REFvRUM7OztBQUVELFNBQVMsZUFBZSxDQUFDLFVBQWdDO0lBQ3ZELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVmLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO1FBQ2xDLE1BQU0sSUFBSSxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsVUFBZ0M7SUFDMUQsT0FBTyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDN0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IEFybkZvcm1hdCwgTGF6eSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuSm9iRGVmaW5pdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5pbXBvcnQgeyBJRWNzQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4vZWNzLWNvbnRhaW5lci1kZWZpbml0aW9uJztcbmltcG9ydCB7IENvbXBhdGliaWxpdHkgfSBmcm9tICcuL2Vjcy1qb2ItZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBiYXNlSm9iRGVmaW5pdGlvblByb3BlcnRpZXMsIElKb2JEZWZpbml0aW9uLCBKb2JEZWZpbml0aW9uQmFzZSwgSm9iRGVmaW5pdGlvblByb3BzIH0gZnJvbSAnLi9qb2ItZGVmaW5pdGlvbi1iYXNlJztcblxuaW50ZXJmYWNlIElNdWx0aU5vZGVKb2JEZWZpbml0aW9uIGV4dGVuZHMgSUpvYkRlZmluaXRpb24ge1xuICAvKipcbiAgICogVGhlIGNvbnRhaW5lcnMgdGhhdCB0aGlzIG11bHRpbm9kZSBqb2Igd2lsbCBydW4uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9ibG9ncy9jb21wdXRlL2J1aWxkaW5nLWEtdGlnaHRseS1jb3VwbGVkLW1vbGVjdWxhci1keW5hbWljcy13b3JrZmxvdy13aXRoLW11bHRpLW5vZGUtcGFyYWxsZWwtam9icy1pbi1hd3MtYmF0Y2gvXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJzOiBNdWx0aU5vZGVDb250YWluZXJbXTtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHR5cGUgdGhhdCB0aGlzIGpvYiBkZWZpbml0aW9uIHdpbGwgcnVuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBpbmRleCBvZiB0aGUgbWFpbiBub2RlIGluIHRoaXMgam9iLlxuICAgKiBUaGUgbWFpbiBub2RlIGlzIHJlc3BvbnNpYmxlIGZvciBvcmNoZXN0cmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICByZWFkb25seSBtYWluTm9kZT86IG51bWJlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBwcm9wb2dhdGUgdGFncyBmcm9tIHRoZSBKb2JEZWZpbml0aW9uXG4gICAqIHRvIHRoZSBFQ1MgdGFzayB0aGF0IEJhdGNoIHNwYXduc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGFnYXRlVGFncz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRhaW5lciB0byB0aGlzIG11bHRpbm9kZSBqb2JcbiAgICovXG4gIGFkZENvbnRhaW5lcihjb250YWluZXI6IE11bHRpTm9kZUNvbnRhaW5lcik6IHZvaWQ7XG59XG5cbi8qKlxuICogUnVucyB0aGUgY29udGFpbmVyIG9uIG5vZGVzIFtzdGFydE5vZGUsIGVuZE5vZGVdXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTXVsdGlOb2RlQ29udGFpbmVyIHtcbiAgLyoqXG4gICAqIFRoZSBpbmRleCBvZiB0aGUgZmlyc3Qgbm9kZSB0byBydW4gdGhpcyBjb250YWluZXJcbiAgICpcbiAgICogVGhlIGNvbnRhaW5lciBpcyBydW4gb24gYWxsIG5vZGVzIGluIHRoZSByYW5nZSBbc3RhcnROb2RlLCBlbmROb2RlXSAoaW5jbHVzaXZlKVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhcnROb2RlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBpbmRleCBvZiB0aGUgbGFzdCBub2RlIHRvIHJ1biB0aGlzIGNvbnRhaW5lci5cbiAgICpcbiAgICogVGhlIGNvbnRhaW5lciBpcyBydW4gb24gYWxsIG5vZGVzIGluIHRoZSByYW5nZSBbc3RhcnROb2RlLCBlbmROb2RlXSAoaW5jbHVzaXZlKVxuICAgKi9cbiAgcmVhZG9ubHkgZW5kTm9kZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIHRoYXQgdGhpcyBub2RlIHJhbmdlIHdpbGwgcnVuXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXI6IElFY3NDb250YWluZXJEZWZpbml0aW9uO1xufVxuXG4vKipcbiAqIFByb3BzIHRvIGNvbmZpZ3VyZSBhIE11bHRpTm9kZUpvYkRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNdWx0aU5vZGVKb2JEZWZpbml0aW9uUHJvcHMgZXh0ZW5kcyBKb2JEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHR5cGUgdGhhdCB0aGlzIGpvYiBkZWZpbml0aW9uXG4gICAqIHdpbGwgcnVuLlxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVycyB0aGF0IHRoaXMgbXVsdGlub2RlIGpvYiB3aWxsIHJ1bi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2NvbXB1dGUvYnVpbGRpbmctYS10aWdodGx5LWNvdXBsZWQtbW9sZWN1bGFyLWR5bmFtaWNzLXdvcmtmbG93LXdpdGgtbXVsdGktbm9kZS1wYXJhbGxlbC1qb2JzLWluLWF3cy1iYXRjaC9cbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVycz86IE11bHRpTm9kZUNvbnRhaW5lcltdO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5kZXggb2YgdGhlIG1haW4gbm9kZSBpbiB0aGlzIGpvYi5cbiAgICogVGhlIG1haW4gbm9kZSBpcyByZXNwb25zaWJsZSBmb3Igb3JjaGVzdHJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgcmVhZG9ubHkgbWFpbk5vZGU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcHJvcG9nYXRlIHRhZ3MgZnJvbSB0aGUgSm9iRGVmaW5pdGlvblxuICAgKiB0byB0aGUgRUNTIHRhc2sgdGhhdCBCYXRjaCBzcGF3bnNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByb3BhZ2F0ZVRhZ3M/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgSm9iRGVmaW5pdGlvbiB0aGF0IHVzZXMgRWNzIG9yY2hlc3RyYXRpb24gdG8gcnVuIG11bHRpcGxlIGNvbnRhaW5lcnNcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvblxuICovXG5leHBvcnQgY2xhc3MgTXVsdGlOb2RlSm9iRGVmaW5pdGlvbiBleHRlbmRzIEpvYkRlZmluaXRpb25CYXNlIGltcGxlbWVudHMgSU11bHRpTm9kZUpvYkRlZmluaXRpb24ge1xuICAvKipcbiAgICogcmVmZXIgdG8gYW4gZXhpc3RpbmcgSm9iRGVmaW5pdGlvbiBieSBpdHMgYXJuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Kb2JEZWZpbml0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGpvYkRlZmluaXRpb25Bcm46IHN0cmluZyk6IElKb2JEZWZpbml0aW9uIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBqb2JEZWZpbml0aW9uTmFtZSA9IHN0YWNrLnNwbGl0QXJuKGpvYkRlZmluaXRpb25Bcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUhO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgSm9iRGVmaW5pdGlvbkJhc2UgaW1wbGVtZW50cyBJSm9iRGVmaW5pdGlvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybiA9IGpvYkRlZmluaXRpb25Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbk5hbWUgPSBqb2JEZWZpbml0aW9uTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lcnM6IE11bHRpTm9kZUNvbnRhaW5lcltdO1xuICBwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlO1xuICBwdWJsaWMgcmVhZG9ubHkgbWFpbk5vZGU/OiBudW1iZXI7XG4gIHB1YmxpYyByZWFkb25seSBwcm9wYWdhdGVUYWdzPzogYm9vbGVhbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgam9iRGVmaW5pdGlvbk5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTXVsdGlOb2RlSm9iRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lcnMgPSBwcm9wcy5jb250YWluZXJzID8/IFtdO1xuICAgIHRoaXMubWFpbk5vZGUgPSBwcm9wcy5tYWluTm9kZTtcbiAgICB0aGlzLmluc3RhbmNlVHlwZSA9IHByb3BzLmluc3RhbmNlVHlwZTtcbiAgICB0aGlzLnByb3BhZ2F0ZVRhZ3MgPSBwcm9wcz8ucHJvcGFnYXRlVGFncztcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkpvYkRlZmluaXRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgLi4uYmFzZUpvYkRlZmluaXRpb25Qcm9wZXJ0aWVzKHRoaXMpLFxuICAgICAgdHlwZTogJ211bHRpbm9kZScsXG4gICAgICBqb2JEZWZpbml0aW9uTmFtZTogcHJvcHMuam9iRGVmaW5pdGlvbk5hbWUsXG4gICAgICBwcm9wYWdhdGVUYWdzOiB0aGlzLnByb3BhZ2F0ZVRhZ3MsXG4gICAgICBub2RlUHJvcGVydGllczoge1xuICAgICAgICBtYWluTm9kZTogdGhpcy5tYWluTm9kZSA/PyAwLFxuICAgICAgICBub2RlUmFuZ2VQcm9wZXJ0aWVzOiBMYXp5LmFueSh7XG4gICAgICAgICAgcHJvZHVjZTogKCkgPT4gdGhpcy5jb250YWluZXJzLm1hcCgoY29udGFpbmVyKSA9PiAoe1xuICAgICAgICAgICAgdGFyZ2V0Tm9kZXM6IGNvbnRhaW5lci5zdGFydE5vZGUgKyAnOicgKyBjb250YWluZXIuZW5kTm9kZSxcbiAgICAgICAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICAgICAgICAuLi5jb250YWluZXIuY29udGFpbmVyLl9yZW5kZXJDb250YWluZXJEZWZpbml0aW9uKCksXG4gICAgICAgICAgICAgIGluc3RhbmNlVHlwZTogdGhpcy5pbnN0YW5jZVR5cGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpLFxuICAgICAgICB9KSxcbiAgICAgICAgbnVtTm9kZXM6IExhenkubnVtYmVyKHtcbiAgICAgICAgICBwcm9kdWNlOiAoKSA9PiBjb21wdXRlTnVtTm9kZXModGhpcy5jb250YWluZXJzKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgcGxhdGZvcm1DYXBhYmlsaXRpZXM6IFtDb21wYXRpYmlsaXR5LkVDMl0sXG4gICAgfSk7XG4gICAgdGhpcy5qb2JEZWZpbml0aW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5yZWYsIHtcbiAgICAgIHNlcnZpY2U6ICdiYXRjaCcsXG4gICAgICByZXNvdXJjZTogJ2pvYi1kZWZpbml0aW9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG4gICAgdGhpcy5qb2JEZWZpbml0aW9uTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB2YWxpZGF0ZUNvbnRhaW5lcnModGhpcy5jb250YWluZXJzKSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRDb250YWluZXIoY29udGFpbmVyOiBNdWx0aU5vZGVDb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVOdW1Ob2Rlcyhjb250YWluZXJzOiBNdWx0aU5vZGVDb250YWluZXJbXSkge1xuICBsZXQgcmVzdWx0ID0gMDtcblxuICBmb3IgKGNvbnN0IGNvbnRhaW5lciBvZiBjb250YWluZXJzKSB7XG4gICAgcmVzdWx0ICs9IGNvbnRhaW5lci5lbmROb2RlIC0gY29udGFpbmVyLnN0YXJ0Tm9kZSArIDE7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbnRhaW5lcnMoY29udGFpbmVyczogTXVsdGlOb2RlQ29udGFpbmVyW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBjb250YWluZXJzLmxlbmd0aCA9PT0gMCA/IFsnbXVsdGlub2RlIGpvYiBoYXMgbm8gY29udGFpbmVycyEnXSA6IFtdO1xufVxuIl19