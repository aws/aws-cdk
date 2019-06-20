import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
interface AdoptedRepositoryProps {
    /**
     * An ECR repository to adopt. Once adopted, the repository will
     * practically become part of this stack, so it will be removed when
     * the stack is deleted.
     */
    repositoryName: string;
}
/**
 * An internal class used to adopt an ECR repository used for the locally built
 * image into the stack.
 *
 * Since the repository is not created by the stack (but by the CDK toolkit),
 * adopting will make the repository "owned" by the stack. It will be cleaned
 * up when the stack gets deleted, to avoid leaving orphaned repositories on
 * stack cleanup.
 */
export declare class AdoptedRepository extends ecr.RepositoryBase {
    private readonly props;
    readonly repositoryName: string;
    readonly repositoryArn: string;
    private readonly policyDocument;
    constructor(scope: cdk.Construct, id: string, props: AdoptedRepositoryProps);
    /**
     * Export this repository from the stack
     */
    export(): AdoptedRepositoryProps;
    /**
     * Adds a statement to the repository resource policy.
     *
     * Contrary to normal imported repositories, which no-op here, we can
     * use the custom resource to modify the ECR resource policy if needed.
     */
    addToResourcePolicy(statement: iam.PolicyStatement): void;
}
export {};
