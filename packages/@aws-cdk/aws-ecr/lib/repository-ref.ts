import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { CommonPipelineSourceActionProps, PipelineSourceAction } from './pipeline-action';

/**
 * Represents an ECR repository.
 */
export interface IRepository {
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
   * Convenience method for creating a new {@link PipelineSourceAction},
   * and adding it to the given Stage.
   *
   * @param stage the Pipeline Stage to add the new Action to
   * @param name the name of the newly created Action
   * @param props the optional construction properties of the new Action
   * @returns the newly created {@link PipelineSourceAction}
   */
  addToPipeline(stage: codepipeline.IStage, name: string, props?: CommonPipelineSourceActionProps):
      PipelineSourceAction;

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  grant(identity?: iam.IPrincipal, ...actions: string[]): void;

  /**
   * Grant the given identity permissions to pull images in this repository.
   */
  grantPull(identity?: iam.IPrincipal): void;

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  grantPullPush(identity?: iam.IPrincipal): void;

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   * @param name The name of the rule
   * @param target An IEventRuleTarget to invoke when this event happens (you can add more targets using `addTarget`)
   * @param imageTag Only trigger on the specific image tag
   */
  onImagePushed(name: string, target?: events.IEventRuleTarget, imageTag?: string): events.EventRule;
}

export interface ImportRepositoryProps {
  /**
   * The ARN of the repository to import.
   *
   * At least one of `repositoryArn` or `repositoryName` is required.
   *
   * @default If you only have a repository name and the repository is in the same
   * account/region as the current stack, you can set `repositoryName` instead
   * and the ARN will be formatted with the current region and account.
   */
  repositoryArn?: string;

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
  repositoryName?: string;
}

/**
 * Base class for ECR repository. Reused between imported repositories and owned repositories.
 */
export abstract class RepositoryBase extends cdk.Construct implements IRepository {
  /**
   * Import a repository
   */
  public static import(parent: cdk.Construct, id: string, props: ImportRepositoryProps): IRepository {
    return new ImportedRepository(parent, id, props);
  }

  /**
   * Returns an ECR ARN for a repository that resides in the same account/region
   * as the current stack.
   */
  public static arnForLocalRepository(repositoryName: string): string {
    return cdk.ArnUtils.fromComponents({
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
    const parts = cdk.ArnUtils.parse(this.repositoryArn);
    return `${parts.account}.dkr.ecr.${parts.region}.amazonaws.com/${this.repositoryName}${tagSuffix}`;
  }

  /**
   * Export this repository from the stack
   */
  public export(): ImportRepositoryProps {
    return {
      repositoryArn: new cdk.Output(this, 'RepositoryArn', { value: this.repositoryArn }).makeImportValue().toString(),
      repositoryName: new cdk.Output(this, 'RepositoryName', { value: this.repositoryName }).makeImportValue().toString()
    };
  }

  public addToPipeline(stage: codepipeline.IStage, name: string, props: CommonPipelineSourceActionProps = {}):
      PipelineSourceAction {
    return new PipelineSourceAction(this, name, {
      stage,
      repository: this,
      ...props,
    });
  }

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
  public grant(identity?: iam.IPrincipal, ...actions: string[]) {
    if (!identity) {
      return;
    }
    identity.addToPolicy(new iam.PolicyStatement()
      .addResource(this.repositoryArn)
      .addActions(...actions));
  }

  /**
   * Grant the given identity permissions to use the images in this repository
   */
  public grantPull(identity?: iam.IPrincipal) {
    this.grant(identity, "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage");

    if (identity) {
      identity.addToPolicy(new iam.PolicyStatement()
        .addActions("ecr:GetAuthorizationToken", "logs:CreateLogStream", "logs:PutLogEvents")
        .addAllResources());
    }
  }

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  public grantPullPush(identity?: iam.IPrincipal) {
      this.grantPull(identity);
      this.grant(identity,
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

  constructor(parent: cdk.Construct, id: string, props: ImportRepositoryProps) {
    super(parent, id);

    if (props.repositoryArn) {
      this.repositoryArn = props.repositoryArn;
    } else {
      if (!props.repositoryName) {
        throw new Error('If "repositoruyArn" is not specified, you must specify "repositoryName", ' +
          'which also implies that the repository resides in the same region/account as this stack');
      }

      this.repositoryArn = RepositoryBase.arnForLocalRepository(props.repositoryName);
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

  public addToResourcePolicy(_statement: iam.PolicyStatement) {
    // FIXME: Add annotation about policy we dropped on the floor
  }
}
