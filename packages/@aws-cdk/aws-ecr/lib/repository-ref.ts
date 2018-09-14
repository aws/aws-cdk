import cdk = require('@aws-cdk/cdk');
import { RepositoryArn, RepositoryName } from './ecr.generated';

/**
 * An ECR repository
 */
export abstract class RepositoryRef extends cdk.Construct {
    /**
     * Import a repository
     */
    public static import(parent: cdk.Construct, id: string, props: RepositoryRefProps): RepositoryRef {
        return new ImportedRepository(parent, id, props);
    }

    /**
     * The name of the repository
     */
    public abstract readonly repositoryName: RepositoryName;

    /**
     * The ARN of the repository
     */
    public abstract readonly repositoryArn: RepositoryArn;

    /**
     * Add a policy statement to the repository's resource policy
     */
    public abstract addToResourcePolicy(statement: cdk.PolicyStatement): void;

    /**
     * Export this repository from the stack
     */
    public export(): RepositoryRefProps {
        return {
            repositoryArn: new RepositoryArn(new cdk.Output(this, 'RepositoryArn', { value: this.repositoryArn }).makeImportValue()),
        };
    }

    /**
     * The URI of the repository, for use in Docker/image references
     */
    public get repositoryUri(): RepositoryUri {
        // Calculate this from the ARN
        const parts = cdk.Arn.parseToken(this.repositoryArn);
        return new RepositoryUri(`${parts.account}.dkr.ecr.${parts.region}.amazonaws.com/${parts.resourceName}`);
    }
}

/**
 * URI of a repository
 */
export class RepositoryUri extends cdk.CloudFormationToken {
}

export interface RepositoryRefProps {
    repositoryArn: RepositoryArn;
}

/**
 * An already existing repository
 */
class ImportedRepository extends RepositoryRef {
    public readonly repositoryName: RepositoryName;
    public readonly repositoryArn: RepositoryArn;

    constructor(parent: cdk.Construct, id: string, props: RepositoryRefProps) {
        super(parent, id);
        this.repositoryArn = props.repositoryArn;
        this.repositoryName = new RepositoryName(cdk.Arn.parseToken(props.repositoryArn).resourceName);
    }

    public addToResourcePolicy(_statement: cdk.PolicyStatement) {
        // FIXME: Add annotation about policy we dropped on the floor
    }
}