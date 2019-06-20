"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cfn = require("@aws-cdk/aws-cloudformation");
const ecr = require("@aws-cdk/aws-ecr");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const path = require("path");
/**
 * An internal class used to adopt an ECR repository used for the locally built
 * image into the stack.
 *
 * Since the repository is not created by the stack (but by the CDK toolkit),
 * adopting will make the repository "owned" by the stack. It will be cleaned
 * up when the stack gets deleted, to avoid leaving orphaned repositories on
 * stack cleanup.
 */
class AdoptedRepository extends ecr.RepositoryBase {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.policyDocument = new iam.PolicyDocument();
        const fn = new lambda.SingletonFunction(this, 'Function', {
            runtime: lambda.Runtime.NodeJS810,
            lambdaPurpose: 'AdoptEcrRepository',
            handler: 'handler.handler',
            code: lambda.Code.asset(path.join(__dirname, 'adopt-repository')),
            uuid: 'dbc60def-c595-44bc-aa5c-28c95d68f62c',
            timeout: 300
        });
        fn.addToRolePolicy(new iam.PolicyStatement()
            .addResource(ecr.Repository.arnForLocalRepository(props.repositoryName, this))
            .addActions('ecr:GetRepositoryPolicy', 'ecr:SetRepositoryPolicy', 'ecr:DeleteRepository', 'ecr:ListImages', 'ecr:BatchDeleteImage'));
        const adopter = new cfn.CustomResource(this, 'Resource', {
            resourceType: 'Custom::ECRAdoptedRepository',
            provider: cfn.CustomResourceProvider.lambda(fn),
            properties: {
                RepositoryName: props.repositoryName,
                PolicyDocument: this.policyDocument
            }
        });
        if (fn.role) {
            // Need to explicitly depend on the role's policies, so they are applied before we try to use them
            adopter.node.addDependency(fn.role);
        }
        // we use the Fn::GetAtt with the RepositoryName returned by the custom
        // resource in order to implicitly create a dependency between consumers
        // and the custom resource.
        this.repositoryName = adopter.getAtt('RepositoryName').toString();
        // this this repository is "local" to the stack (in the same region/account)
        // we can render it's ARN from it's name.
        this.repositoryArn = ecr.Repository.arnForLocalRepository(this.repositoryName, this);
    }
    /**
     * Export this repository from the stack
     */
    export() {
        return this.props;
    }
    /**
     * Adds a statement to the repository resource policy.
     *
     * Contrary to normal imported repositories, which no-op here, we can
     * use the custom resource to modify the ECR resource policy if needed.
     */
    addToResourcePolicy(statement) {
        this.policyDocument.addStatement(statement);
    }
}
exports.AdoptedRepository = AdoptedRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRvcHRlZC1yZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWRvcHRlZC1yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQW9EO0FBQ3BELHdDQUF5QztBQUN6Qyx3Q0FBeUM7QUFDekMsOENBQStDO0FBRS9DLDZCQUE4QjtBQVc5Qjs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLGNBQWM7SUFNdkQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBbUIsS0FBNkI7UUFDMUYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUQ0QyxVQUFLLEdBQUwsS0FBSyxDQUF3QjtRQUYzRSxtQkFBYyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBS3pELE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDeEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxhQUFhLEVBQUUsb0JBQW9CO1lBQ25DLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDakUsSUFBSSxFQUFFLHNDQUFzQztZQUM1QyxPQUFPLEVBQUUsR0FBRztTQUNiLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFO2FBQ3pDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0UsVUFBVSxDQUNULHlCQUF5QixFQUN6Qix5QkFBeUIsRUFDekIsc0JBQXNCLEVBQ3RCLGdCQUFnQixFQUNoQixzQkFBc0IsQ0FDdkIsQ0FBQyxDQUFDO1FBRUwsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdkQsWUFBWSxFQUFFLDhCQUE4QjtZQUM1QyxRQUFRLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDL0MsVUFBVSxFQUFFO2dCQUNWLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDcEMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQ1gsa0dBQWtHO1lBQ2xHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQztRQUVELHVFQUF1RTtRQUN2RSx3RUFBd0U7UUFDeEUsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWxFLDRFQUE0RTtRQUM1RSx5Q0FBeUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxtQkFBbUIsQ0FBQyxTQUE4QjtRQUN2RCxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0Y7QUFuRUQsOENBbUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNmbiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbicpO1xuaW1wb3J0IGVjciA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lY3InKTtcbmltcG9ydCBpYW0gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtaWFtJyk7XG5pbXBvcnQgbGFtYmRhID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWxhbWJkYScpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmludGVyZmFjZSBBZG9wdGVkUmVwb3NpdG9yeVByb3BzIHtcbiAgLyoqXG4gICAqIEFuIEVDUiByZXBvc2l0b3J5IHRvIGFkb3B0LiBPbmNlIGFkb3B0ZWQsIHRoZSByZXBvc2l0b3J5IHdpbGxcbiAgICogcHJhY3RpY2FsbHkgYmVjb21lIHBhcnQgb2YgdGhpcyBzdGFjaywgc28gaXQgd2lsbCBiZSByZW1vdmVkIHdoZW5cbiAgICogdGhlIHN0YWNrIGlzIGRlbGV0ZWQuXG4gICAqL1xuICByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFuIGludGVybmFsIGNsYXNzIHVzZWQgdG8gYWRvcHQgYW4gRUNSIHJlcG9zaXRvcnkgdXNlZCBmb3IgdGhlIGxvY2FsbHkgYnVpbHRcbiAqIGltYWdlIGludG8gdGhlIHN0YWNrLlxuICpcbiAqIFNpbmNlIHRoZSByZXBvc2l0b3J5IGlzIG5vdCBjcmVhdGVkIGJ5IHRoZSBzdGFjayAoYnV0IGJ5IHRoZSBDREsgdG9vbGtpdCksXG4gKiBhZG9wdGluZyB3aWxsIG1ha2UgdGhlIHJlcG9zaXRvcnkgXCJvd25lZFwiIGJ5IHRoZSBzdGFjay4gSXQgd2lsbCBiZSBjbGVhbmVkXG4gKiB1cCB3aGVuIHRoZSBzdGFjayBnZXRzIGRlbGV0ZWQsIHRvIGF2b2lkIGxlYXZpbmcgb3JwaGFuZWQgcmVwb3NpdG9yaWVzIG9uXG4gKiBzdGFjayBjbGVhbnVwLlxuICovXG5leHBvcnQgY2xhc3MgQWRvcHRlZFJlcG9zaXRvcnkgZXh0ZW5kcyBlY3IuUmVwb3NpdG9yeUJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHBvbGljeURvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBBZG9wdGVkUmVwb3NpdG9yeVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5TaW5nbGV0b25GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlSlM4MTAsXG4gICAgICBsYW1iZGFQdXJwb3NlOiAnQWRvcHRFY3JSZXBvc2l0b3J5JyxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyLmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2Fkb3B0LXJlcG9zaXRvcnknKSksXG4gICAgICB1dWlkOiAnZGJjNjBkZWYtYzU5NS00NGJjLWFhNWMtMjhjOTVkNjhmNjJjJyxcbiAgICAgIHRpbWVvdXQ6IDMwMFxuICAgIH0pO1xuXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KClcbiAgICAgIC5hZGRSZXNvdXJjZShlY3IuUmVwb3NpdG9yeS5hcm5Gb3JMb2NhbFJlcG9zaXRvcnkocHJvcHMucmVwb3NpdG9yeU5hbWUsIHRoaXMpKVxuICAgICAgLmFkZEFjdGlvbnMoXG4gICAgICAgICdlY3I6R2V0UmVwb3NpdG9yeVBvbGljeScsXG4gICAgICAgICdlY3I6U2V0UmVwb3NpdG9yeVBvbGljeScsXG4gICAgICAgICdlY3I6RGVsZXRlUmVwb3NpdG9yeScsXG4gICAgICAgICdlY3I6TGlzdEltYWdlcycsXG4gICAgICAgICdlY3I6QmF0Y2hEZWxldGVJbWFnZSdcbiAgICAgICkpO1xuXG4gICAgY29uc3QgYWRvcHRlciA9IG5ldyBjZm4uQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpFQ1JBZG9wdGVkUmVwb3NpdG9yeScsXG4gICAgICBwcm92aWRlcjogY2ZuLkN1c3RvbVJlc291cmNlUHJvdmlkZXIubGFtYmRhKGZuKSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgICBQb2xpY3lEb2N1bWVudDogdGhpcy5wb2xpY3lEb2N1bWVudFxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChmbi5yb2xlKSB7XG4gICAgICAvLyBOZWVkIHRvIGV4cGxpY2l0bHkgZGVwZW5kIG9uIHRoZSByb2xlJ3MgcG9saWNpZXMsIHNvIHRoZXkgYXJlIGFwcGxpZWQgYmVmb3JlIHdlIHRyeSB0byB1c2UgdGhlbVxuICAgICAgYWRvcHRlci5ub2RlLmFkZERlcGVuZGVuY3koZm4ucm9sZSk7XG4gICAgfVxuXG4gICAgLy8gd2UgdXNlIHRoZSBGbjo6R2V0QXR0IHdpdGggdGhlIFJlcG9zaXRvcnlOYW1lIHJldHVybmVkIGJ5IHRoZSBjdXN0b21cbiAgICAvLyByZXNvdXJjZSBpbiBvcmRlciB0byBpbXBsaWNpdGx5IGNyZWF0ZSBhIGRlcGVuZGVuY3kgYmV0d2VlbiBjb25zdW1lcnNcbiAgICAvLyBhbmQgdGhlIGN1c3RvbSByZXNvdXJjZS5cbiAgICB0aGlzLnJlcG9zaXRvcnlOYW1lID0gYWRvcHRlci5nZXRBdHQoJ1JlcG9zaXRvcnlOYW1lJykudG9TdHJpbmcoKTtcblxuICAgIC8vIHRoaXMgdGhpcyByZXBvc2l0b3J5IGlzIFwibG9jYWxcIiB0byB0aGUgc3RhY2sgKGluIHRoZSBzYW1lIHJlZ2lvbi9hY2NvdW50KVxuICAgIC8vIHdlIGNhbiByZW5kZXIgaXQncyBBUk4gZnJvbSBpdCdzIG5hbWUuXG4gICAgdGhpcy5yZXBvc2l0b3J5QXJuID0gZWNyLlJlcG9zaXRvcnkuYXJuRm9yTG9jYWxSZXBvc2l0b3J5KHRoaXMucmVwb3NpdG9yeU5hbWUsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9ydCB0aGlzIHJlcG9zaXRvcnkgZnJvbSB0aGUgc3RhY2tcbiAgICovXG4gIHB1YmxpYyBleHBvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgcmVwb3NpdG9yeSByZXNvdXJjZSBwb2xpY3kuXG4gICAqXG4gICAqIENvbnRyYXJ5IHRvIG5vcm1hbCBpbXBvcnRlZCByZXBvc2l0b3JpZXMsIHdoaWNoIG5vLW9wIGhlcmUsIHdlIGNhblxuICAgKiB1c2UgdGhlIGN1c3RvbSByZXNvdXJjZSB0byBtb2RpZnkgdGhlIEVDUiByZXNvdXJjZSBwb2xpY3kgaWYgbmVlZGVkLlxuICAgKi9cbiAgcHVibGljIGFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5wb2xpY3lEb2N1bWVudC5hZGRTdGF0ZW1lbnQoc3RhdGVtZW50KTtcbiAgfVxufVxuIl19