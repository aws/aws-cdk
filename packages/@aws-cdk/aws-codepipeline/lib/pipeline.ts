import actions = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codepipeline.generated';
import { CommonStageProps, Stage, StagePlacement } from './stage';

export interface PipelineProps {
  /**
   * The S3 bucket used by this Pipeline to store artifacts.
   * If not specified, a new S3 bucket will be created.
   */
  artifactBucket?: s3.BucketRef;

  /**
   * Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
   */
  restartExecutionOnUpdate?: boolean;

  /**
   * Name of the pipeline. If you don't specify a name,  AWS CloudFormation generates an ID
   * and uses that for the pipeline name.
   */
  pipelineName?: string;
}

/**
 * An AWS CodePipeline pipeline with its associated IAM role and S3 bucket.
 *
 * @example
 * // create a pipeline
 * const pipeline = new Pipeline(this, 'Pipeline');
 *
 * // add a stage
 * const sourceStage = new Stage(pipeline, 'Source');
 *
 * // add a source action to the stage
 * new codecommit.PipelineSourceAction(sourceStage, 'Source', {
 *   artifactName: 'SourceArtifact',
 *   repository: repo,
 * });
 *
 * // ... add more stages
 */
export class Pipeline extends cdk.Construct implements events.IEventRuleTarget {
  /**
   * The IAM role AWS CodePipeline will use to perform actions or assume roles for actions with
   * a more specific IAM role.
   */
  public readonly role: iam.Role;

  /**
   * ARN of this pipeline
   */
  public readonly pipelineArn: string;

  /**
   * The name of the pipeline
   */
  public readonly pipelineName: string;

  /**
   * The version of the pipeline
   */
  public readonly pipelineVersion: string;

  /**
   * Bucket used to store output artifacts
   */
  public readonly artifactBucket: s3.BucketRef;

  private readonly stages = new Array<Stage>();
  private eventsRole?: iam.Role;

  constructor(parent: cdk.Construct, name: string, props?: PipelineProps) {
    super(parent, name);
    props = props || {};

    actions.validateName('Pipeline', props.pipelineName);

    // If a bucket has been provided, use it - otherwise, create a bucket.
    let propsBucket = props.artifactBucket;
    if (!propsBucket) {
      propsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
        removalPolicy: cdk.RemovalPolicy.Orphan
      });
    }
    this.artifactBucket = propsBucket;

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new cdk.ServicePrincipal('codepipeline.amazonaws.com')
    });

    const codePipeline = new cloudformation.PipelineResource(this, 'Resource', {
      artifactStore: new cdk.Token(() => this.renderArtifactStore()) as any,
      stages: new cdk.Token(() => this.renderStages()) as any,
      roleArn: this.role.roleArn,
      restartExecutionOnUpdate: props && props.restartExecutionOnUpdate,
      pipelineName: props && props.pipelineName,
    });

    // this will produce a DependsOn for both the role and the policy resources.
    codePipeline.addDependency(this.role);

    this.artifactBucket.grantReadWrite(this.role);

    this.pipelineName = codePipeline.ref;
    this.pipelineVersion = codePipeline.pipelineVersion;

    // Does not expose a Fn::GetAtt for the ARN so we'll have to make it ourselves
    this.pipelineArn = cdk.ArnUtils.fromComponents({
      service: 'codepipeline',
      resource: this.pipelineName
    });
  }

  /**
   * Convenience method for creating a new {@link Stage},
   * and adding it to this Pipeline.
   *
   * @param name the name of the newly created Stage
   * @param props the optional construction properties of the new Stage
   * @returns the newly created Stage
   */
  public addStage(name: string, props?: CommonStageProps): Stage {
    return new Stage(this, name, {
      pipeline: this,
      ...props,
    });
  }

  /**
   * Adds a statement to the pipeline role.
   */
  public addToRolePolicy(statement: cdk.PolicyStatement) {
    this.role.addToPolicy(statement);
  }

  /**
   * Allows the pipeline to be used as a CloudWatch event rule target.
   *
   * Usage:
   *
   *    const pipeline = new Pipeline(this, 'MyPipeline');
   *    const rule = new EventRule(this, 'MyRule', { schedule: 'rate(1 minute)' });
   *    rule.addTarget(pipeline);
   *
   */
  public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
    // the first time the event rule target is retrieved, we define an IAM
    // role assumable by the CloudWatch events service which is allowed to
    // start the execution of this pipeline. no need to define more than one
    // role per pipeline.
    if (!this.eventsRole) {
      this.eventsRole = new iam.Role(this, 'EventsRole', {
        assumedBy: new cdk.ServicePrincipal('events.amazonaws.com')
      });

      this.eventsRole.addToPolicy(new cdk.PolicyStatement()
        .addResource(this.pipelineArn)
        .addAction('codepipeline:StartPipelineExecution'));
    }

    return {
      id: this.id,
      arn: this.pipelineArn,
      roleArn: this.eventsRole.roleArn,
    };
  }

  /**
   * Defines an event rule triggered by the "CodePipeline Pipeline Execution
   * State Change" event emitted from this pipeline.
   *
   * @param target Initial target to add to the event rule. You can also add
   * targets and customize target inputs by calling `rule.addTarget(target[,
   * options])` after the rule was created.
   *
   * @param options Additional options to pass to the event rule
   *
   * @param name The name of the event rule construct. If you wish to define
   * more than a single onStateChange event, you will need to explicitly
   * specify a name.
   */
  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule {
    const rule = new events.EventRule(this, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Pipeline Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipelineArn ],
    });
    return rule;
  }

  /**
   * Validate the pipeline structure
   *
   * Validation happens according to the rules documented at
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements
   * @override
   */
  public validate(): string[] {
    return [
      ...this.validateHasStages(),
      ...this.validateSourceActionLocations()
    ];
  }

  /**
   * Get the number of Stages in this Pipeline.
   */
  public get stageCount(): number {
    return this.stages.length;
  }

  /**
   * Adds a Stage to this Pipeline.
   * This is an internal operation -
   * a Stage is added to a Pipeline when it's constructed
   * (the Pipeline is passed through the {@link StageProps#pipeline} property),
   * so there is never a need to call this method explicitly.
   *
   * @param stage the newly created Stage to add to this Pipeline
   * @param placement an optional specification of where to place the newly added Stage in the Pipeline
   */
  // ignore unused private method (it's actually used in Stage)
  // @ts-ignore
  private _attachStage(stage: Stage, placement?: StagePlacement): void {
    // _attachStage should be idempotent, in case a customer ever calls it directly
    if (this.stages.includes(stage)) {
      return;
    }

    if (this.stages.find(x => x.name === stage.name)) {
      throw new Error(`A stage with name '${stage.name}' already exists`);
    }

    const index = placement
      ? this.calculateInsertIndexFromPlacement(placement)
      : this.stageCount;

    this.stages.splice(index, 0, stage);
  }

  private calculateInsertIndexFromPlacement(placement: StagePlacement): number {
    // check if at most one placement property was provided
    const providedPlacementProps = ['rightBefore', 'justAfter', 'atIndex']
      .filter((prop) => (placement as any)[prop] !== undefined);
    if (providedPlacementProps.length > 1) {
      throw new Error("Error adding Stage to the Pipeline: " +
        'you can only provide at most one placement property, but ' +
        `'${providedPlacementProps.join(', ')}' were given`);
    }

    if (placement.rightBefore !== undefined) {
      const targetIndex = this.findStageIndex(placement.rightBefore);
      if (targetIndex === -1) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `the requested Stage to add it before, '${placement.rightBefore.name}', was not found`);
      }
      return targetIndex;
    }

    if (placement.justAfter !== undefined) {
      const targetIndex = this.findStageIndex(placement.justAfter);
      if (targetIndex === -1) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `the requested Stage to add it after, '${placement.justAfter.name}', was not found`);
      }
      return targetIndex + 1;
    }

    if (placement.atIndex !== undefined) {
      const index = placement.atIndex;
      if (index < 0 || index > this.stageCount) {
        throw new Error("Error adding Stage to the Pipeline: " +
          `{ placed: atIndex } should be between 0 and the number of stages in the Pipeline (${this.stageCount}), ` +
          ` got: ${index}`);
      }
      return index;
    }

    return this.stageCount;
  }

  private findStageIndex(targetStage: Stage) {
    return this.stages.findIndex((stage: Stage) => stage === targetStage);
  }

  private validateSourceActionLocations(): string[] {
    const errors = new Array<string>();
    let firstStage = true;
    for (const stage of this.stages) {
      const onlySourceActionsPermitted = firstStage;
      for (const action of stage.actions) {
        errors.push(...actions.validateSourceAction(onlySourceActionsPermitted, action.category, action.id, stage.id));
      }
      firstStage = false;
    }
    return errors;
  }

  private validateHasStages(): string[] {
    if (this.stageCount < 2) {
      return ['Pipeline must have at least two stages'];
    }
    return [];
  }

  private renderArtifactStore(): cloudformation.PipelineResource.ArtifactStoreProperty {
    let encryptionKey: cloudformation.PipelineResource.EncryptionKeyProperty | undefined;
    const bucketKey = this.artifactBucket.encryptionKey;
    if (bucketKey) {
      encryptionKey = {
        type: 'KMS',
        id: bucketKey.keyArn,
      };
    }

    const bucketName = this.artifactBucket.bucketName;
    if (!bucketName) {
      throw new Error('Artifacts bucket must have a bucket name');
    }

    return {
      type: 'S3',
      location: bucketName,
      encryptionKey
    };
  }

  private renderStages(): cloudformation.PipelineResource.StageDeclarationProperty[] {
    return this.stages.map(stage => stage.render());
  }
}
