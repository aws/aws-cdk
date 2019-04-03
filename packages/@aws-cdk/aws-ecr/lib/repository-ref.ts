import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

/**
 * Represents an ECR repository.
 */
export interface IRepository extends cdk.IConstruct {
  /**
   * The name of the repository
   */
  readonly repositoryName: string;

  /**
   * The ARN of the repository
   */
  readonly repositoryArn: string;

  /**
   * The URI of this repository (represents the latest image):
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
   *
   */
  readonly repositoryUri: string;

  /**
   * Returns the URI of the repository for a certain tag. Can be used in `docker push/pull`.
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
   *
   * @param tag Image tag to use (tools usually default to "latest" if omitted)
   */
  repositoryUriForTag(tag?: string): string;

  /**
   * Add a policy statement to the repository's resource policy
   */
  addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to pull images in this repository.
   */
  grantPull(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  grantPullPush(grantee: iam.IGrantable): iam.Grant;

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   * @param name The name of the rule
   * @param target An IEventRuleTarget to invoke when this event happens (you can add more targets using `addTarget`)
   * @param imageTag Only trigger on the specific image tag
   */
  onImagePushed(name: string, target?: events.IEventRuleTarget, imageTag?: string): events.EventRule;

  /**
   * Export this repository from the stack
   */
  export(): RepositoryImportProps;
}

export interface RepositoryImportProps {
  /**
   * The ARN of the repository to import.
   *
   * At least one of `repositoryArn` or `repositoryName` is required.
   *
   * @default If you only have a repository name and the repository is in the same
   * account/region as the current stack, you can set `repositoryName` instead
   * and the ARN will be formatted with the current region and account.
   */
  readonly repositoryArn?: string;

  /**
   * The full name of the repository to import.
   *
   * This is only needed if the repository ARN is not a concrete string, in which
   * case it is impossible to safely parse the ARN and extract full repository
   * names from it if it includes multiple components (e.g. `foo/bar/myrepo`).
   *
   * If the repository is in the same region/account as the stack, it is sufficient
   * to only specify the repository name.
   */
  readonly repositoryName?: string;
}

/**
 * Base class for ECR repository. Reused between imported repositories and owned repositories.
 */
export abstract class RepositoryBase extends cdk.Construct implements IRepository {
  /**
   * Import a repository
   */
  public static import(scope: cdk.Construct, id: string, props: RepositoryImportProps): IRepository {
    return new ImportedRepository(scope, id, props);
  }

  /**
   * Returns an ECR ARN for a repository that resides in the same account/region
   * as the current stack.
   */
  public static arnForLocalRepository(repositoryName: string, scope: cdk.IConstruct): string {
    return scope.node.stack.formatArn({
      service: 'ecr',
      resource: 'repository',
      resourceName: repositoryName
    });
  }

  /**
   * The name of the repository
   */
  public abstract readonly repositoryName: string;

  /**
   * The ARN of the repository
   */
  public abstract readonly repositoryArn: string;

  /**
   * Add a policy statement to the repository's resource policy
   */
  public abstract addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * The URI of this repository (represents the latest image):
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
   *
   */
  public get repositoryUri() {
    return this.repositoryUriForTag();
  }

  /**
   * Returns the URL of the repository. Can be used in `docker push/pull`.
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
   *
   * @param tag Optional image tag
   */
  public repositoryUriForTag(tag?: string): string {
    const tagSuffix = tag ? `:${tag}` : '';
    const parts = this.node.stack.parseArn(this.repositoryArn);
    return `${parts.account}.dkr.ecr.${parts.region}.amazonaws.com/${this.repositoryName}${tagSuffix}`;
  }

  /**
   * Export this repository from the stack
   */
  public abstract export(): RepositoryImportProps;

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   * @param name The name of the rule
   * @param target An IEventRuleTarget to invoke when this event happens (you can add more targets using `addTarget`)
   * @param imageTag Only trigger on the specific image tag
   */
  public onImagePushed(name: string, target?: events.IEventRuleTarget, imageTag?: string): events.EventRule {
    return new events.EventRule(this, name, {
      targets: target ? [target] : undefined,
      eventPattern: {
        source: ['aws.ecr'],
        detail: {
          eventName: [
            'PutImage',
          ],
          requestParameters: {
            repositoryName: [
              this.repositoryName,
            ],
            imageTag: imageTag ? [imageTag] : undefined,
          },
        },
      },
    });
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.onPrincipalOrResource({
      grantee,
      actions,
      resourceArns: [this.repositoryArn],
      resource: this,
    });
  }

  /**
   * Grant the given identity permissions to use the images in this repository
   */
  public grantPull(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage");

    iam.Grant.onPrincipal({
      grantee,
      actions: ["ecr:GetAuthorizationToken"],
      resourceArns: ['*'],
      scope: this,
    });

    return ret;
  }

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  public grantPullPush(grantee: iam.IGrantable) {
    this.grantPull(grantee);
    return this.grant(grantee,
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload");
  }
}

/**
 * An already existing repository
 */
class ImportedRepository extends RepositoryBase {
  public readonly repositoryName: string;
  public readonly repositoryArn: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: RepositoryImportProps) {
    super(scope, id);

    if (props.repositoryArn) {
      this.repositoryArn = props.repositoryArn;
    } else {
      if (!props.repositoryName) {
        throw new Error('If "repositoruyArn" is not specified, you must specify "repositoryName", ' +
          'which also implies that the repository resides in the same region/account as this stack');
      }

      this.repositoryArn = RepositoryBase.arnForLocalRepository(props.repositoryName, this);
    }

    if (props.repositoryName) {
      this.repositoryName = props.repositoryName;
    } else {
      // if repositoryArn is a token, the repository name is also required. this is because
      // repository names can include "/" (e.g. foo/bar/myrepo) and it is impossible to
      // parse the name from an ARN using CloudFormation's split/select.
      if (cdk.unresolved(this.repositoryArn)) {
        throw new Error('repositoryArn is a late-bound value, and therefore repositoryName is required');
      }

      this.repositoryName = this.repositoryArn.split('/').slice(1).join('/');
    }
  }

  public export(): RepositoryImportProps {
    return this.props;
  }

  public addToResourcePolicy(_statement: iam.PolicyStatement) {
    // FIXME: Add annotation about policy we dropped on the floor
  }
}
