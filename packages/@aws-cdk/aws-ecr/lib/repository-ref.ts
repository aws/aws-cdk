import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { CommonPipelineSourceActionProps, PipelineSourceAction } from './pipeline-action';

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
   * Export this repository from the stack
   */
  public export(): RepositoryRefProps {
    return {
      repositoryArn: new cdk.Output(this, 'RepositoryArn', { value: this.repositoryArn }).makeImportValue().toString(),
    };
  }

  /**
   * The URI of the repository, for use in Docker/image references
   */
  public get repositoryUri(): string {
    // Calculate this from the ARN
    const parts = cdk.ArnUtils.parse(this.repositoryArn);
    return `${parts.account}.dkr.ecr.${parts.region}.amazonaws.com/${parts.resourceName}`;
  }

  /**
   * Convenience method for creating a new {@link PipelineSourceAction},
   * and adding it to the given Stage.
   *
   * @param stage the Pipeline Stage to add the new Action to
   * @param name the name of the newly created Action
   * @param props the optional construction properties of the new Action
   * @returns the newly created {@link PipelineSourceAction}
   */
  public addToPipeline(stage: codepipeline.IStage, name: string, props: CommonPipelineSourceActionProps = {}):
      PipelineSourceAction {
    return new PipelineSourceAction(this, name, {
      stage,
      repository: this,
      ...props,
    });
  }

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
  public grantUseImage(identity?: iam.IPrincipal) {
    this.grant(identity, "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage");

    if (identity) {
      identity.addToPolicy(new iam.PolicyStatement()
        .addActions("ecr:GetAuthorizationToken", "logs:CreateLogStream", "logs:PutLogEvents")
        .addAllResources());
    }
  }
}

export interface RepositoryRefProps {
  repositoryArn: string;
}

/**
 * An already existing repository
 */
class ImportedRepository extends RepositoryRef {
  public readonly repositoryName: string;
  public readonly repositoryArn: string;

  constructor(parent: cdk.Construct, id: string, props: RepositoryRefProps) {
    super(parent, id);
    this.repositoryArn = props.repositoryArn;
    this.repositoryName = cdk.ArnUtils.parse(props.repositoryArn).resourceName!;
  }

  public addToResourcePolicy(_statement: iam.PolicyStatement) {
    // FIXME: Add annotation about policy we dropped on the floor
  }
}
